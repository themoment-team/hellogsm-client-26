# 런타임 지표 측정 가이드 (T1↔T2, 수동)

React Compiler의 순수 효과를 확인하는 핵심 비교쌍 **T1(컴파일러 OFF) ↔ T2(컴파일러 ON)** 의
런타임 지표(리렌더 횟수·INP)를 측정하는 절차. 로그인이 필요해 자동화가 불가하므로 수동으로 수행한다.

- 계측 코드(react-scan + Web Vitals 로거)는 **측정 전용 브랜치 `bg/react-scan-setup`에만 존재**하며
  마이그레이션 브랜치(`refactor/react-compiler-migration`)에는 절대 머지하지 않는다.
- T2 측정 시 계측 커밋을 cherry-pick해 **T1과 완전히 동일한 계측 코드**로 측정한다(조건 통제).

## 측정 원칙

| 항목 | 방식 | 이유 |
|---|---|---|
| 리렌더 횟수 | **dev 모드**(`next dev`) + react-scan (`NEXT_PUBLIC_REACT_SCAN=true`) | prod는 컴포넌트명이 minify되어 판독 불가. 컴파일러는 dev에도 동일하게 적용되므로 T1↔T2 비교 유효 |
| INP | **prod 빌드**(`next start`) + Web Vitals 콘솔 로거 (`NEXT_PUBLIC_PERF_LOG=true`, react-scan **OFF**) | react-scan 자체 오버헤드가 INP를 오염시키므로 반드시 분리 |
| 반복 | 시나리오당 **5회 반복, 중앙값** 기록 (개별 값도 전부 기입) | 기존 측정 프로토콜 준수 |

공통 조건 (T0/T1 빌드 측정과 동일):

- **배터리 전원(방전 중)** — 전원 조건이 다르면 비교 무효
- dev 서버·다른 무거운 프로그램 종료 (특히 prod 측정 전 `next dev` 종료 확인 — `.next` 오염 이슈 참고)
- **시크릿 창 + 확장 프로그램 전부 off**
- INP 측정 시 DevTools Performance 탭에서 **CPU 4x slowdown** 적용
- 리렌더 측정 시나리오는 **매회 페이지 새로고침 후 시작** (react-scan 카운트 리셋)

## 0. 준비 (1회)

메인 체크아웃(`C:\Users\user\git\hellogsm-front-25`)에서:

```powershell
git worktree remove .claude/worktrees/react-scan-setup   # 세팅용 worktree 정리
git checkout bg/react-scan-setup
pnpm install                                             # react-scan 0.5.7 설치
```

테스트 계정 준비(자동화 불가였던 부분):

- client: **원서 작성이 가능한 지원자 계정** — `/register`는 접수 기간(`oneseoSubmissionStart~End`) 밖이거나
  수정 미승인 상태면 `/`로 리다이렉트되므로, 백엔드(stage) 일정/계정 상태를 먼저 확인할 것
- admin: 지원자 리스트 조회 가능한 관리자 계정

## 1. 리렌더 측정 (dev + react-scan)

```powershell
# client (포트 3000)
cd apps\client
$env:NEXT_PUBLIC_REACT_SCAN = 'true'
pnpm dev

# admin (포트 3001) — client 측정이 끝난 뒤 별도로
cd apps\admin
$env:NEXT_PUBLIC_REACT_SCAN = 'true'
pnpm dev
```

접속하면 우하단에 react-scan 툴바가 뜬다. 사용법:

- 상호작용 중 리렌더되는 컴포넌트에 보라색 아웃라인 + `컴포넌트명 ×횟수` 라벨이 표시됨
- 툴바의 **inspect(과녁 아이콘)** 를 켜고 대상 컴포넌트를 클릭하면 누적 renders 수치 확인 가능
- 시나리오 1회 수행 후 라벨/inspect의 렌더 횟수를 기록하고, **새로고침으로 리셋** 후 다음 회차 진행

> dev 모드는 React StrictMode로 렌더가 이중 계산될 수 있으나 T1/T2 동일 조건이므로 비교엔 지장 없음.

### 시나리오 S1 — 원서 폼 타이핑 (client)

1. 로그인 → `/register?step=1` 진입 (리다이렉트되면 계정/기간 조건 미충족)
2. **이름 입력란**("이름을 입력해 주세요")에 20자 연속 타이핑 (예: "가나다라마바사아자차" ×2)
3. 기록: 리렌더된 주요 컴포넌트(예: `Step1Register`, `Input`, `StepWrapper`)별 렌더 횟수
   - 관심 포인트: 키 입력당 폼 전체가 다시 그려지는가(T1) vs 입력란 주변만 그려지는가(T2)

### 시나리오 S2 — 모달 열닫 (client)

1. **비로그인** 상태로 메인(`/`) 접속 (이 시나리오만 로그인 불필요 — 항상 재현 가능)
2. 원서 접수(또는 성적 확인) 버튼 클릭 → **로그인 안내 모달**(`loginRequiredModal`) 열림 → 닫기. **10회 반복**
3. 기록: 1회 열닫당 `ModalContainer`/`ClientModals` 및 모달 외부 컴포넌트(Header, 메인 섹션)의 렌더 횟수
   - 관심 포인트: 모달 열닫 시 페이지 전체가 리렌더되는가(zustand store 구독 범위)

### 시나리오 S3 — admin 리스트 필터링 (admin)

1. 관리자 로그인 → `/` (지원자 리스트)
2. 다음을 순서대로 수행: ① 검색어 "김" 입력(디바운스 1초 대기) ② 전형 필터 변경 ③ 제출 여부 필터 변경 ④ 페이지 2로 이동
3. 기록: `MainPage`, `FilterBar`, `ApplicantTR`(행), `Pagination`의 렌더 횟수
   - 관심 포인트: 필터 하나 변경 시 테이블 행 전체가 리렌더되는가

## 2. INP 측정 (prod + Web Vitals 로거)

```powershell
# 루트에서 (env는 빌드 전에 설정 — NEXT_PUBLIC_*은 빌드 타임에 인라인됨)
$env:NEXT_PUBLIC_PERF_LOG = 'true'
$env:NEXT_PUBLIC_REACT_SCAN = ''      # 반드시 OFF
pnpm build

cd apps\client ; pnpm start              # 3000
cd apps\admin  ; pnpm start -- -p 3001   # 3001
```

> ⚠️ **이 브랜치의 어떤 빌드도 번들 크기 측정에 사용 금지.** env를 꺼도 Turbopack이 react-scan
> 청크(수백 KB)를 `.next/static`에 방출하는 것을 확인함(런타임 로드는 안 됨). 번들 측정은
> 계측 코드가 없는 마이그레이션 브랜치에서 수행한다.

절차 (시나리오 S1~S3 각각):

1. 시크릿 창 → DevTools Performance 탭에서 **CPU 4x slowdown** 설정
2. 페이지 로드 → 시나리오 상호작용 수행
3. **탭을 blur(다른 탭 클릭)** → 콘솔에 `[Web Vitals] INP: …ms` 최종 값이 찍힘 (INP는 페이지 이탈 시점에 확정 보고됨). `window.__vitals`로 전체 지표(LCP/CLS/FCP/TTFB 포함) 확인 가능
4. 창을 닫고 새 시크릿 창으로 5회 반복

## 3. 결과 기록

`docs/measurements/T1/runtime.md` (T2는 `T2/runtime.md`)에 아래 템플릿으로 기록:

```markdown
# T1 런타임 측정 결과

- 측정일: / 커밋: / 전원: 배터리 / 브라우저: Chrome vXXX
- 계측: bg/react-scan-setup의 계측 커밋 <SHA> (react-scan 0.5.7)

## 리렌더 (dev, react-scan)

| 시나리오 | 대상 컴포넌트 | 1회 | 2회 | 3회 | 4회 | 5회 | 중앙값 |
|---|---|---|---|---|---|---|---|
| S1 타이핑(20자) | Step1Register | | | | | | |
| S1 타이핑(20자) | StepWrapper | | | | | | |
| S2 모달 열닫(10회) | ClientModals | | | | | | |
| S2 모달 열닫(10회) | Header(모달 외부) | | | | | | |
| S3 필터링 | MainPage | | | | | | |
| S3 필터링 | ApplicantTR(행) | | | | | | |

## INP (prod, CPU 4x)

| 시나리오 | 1회 | 2회 | 3회 | 4회 | 5회 | 중앙값 |
|---|---|---|---|---|---|---|
| S1 타이핑 | | | | | | |
| S2 모달 열닫 | | | | | | |
| S3 필터링 | | | | | | |

## 특이사항

- (아웃라이어, 렌더 패턴 관찰 메모 등)
```

측정 후 결과 보존 (결과는 마이그레이션 브랜치에, 계측 코드는 폐기):

```powershell
# runtime.md는 아직 커밋하지 말 것 — untracked 상태로 브랜치 이동하면 그대로 따라옴
git checkout refactor/react-compiler-migration
pnpm install                              # react-scan 제거
git add docs/measurements/T1/runtime.md docs/migration-log.md
git commit                                # 결과 기록 커밋
```

## 4. T2 재측정 (Stage 4 완료 후)

```powershell
git checkout -b measure/t2 <Stage4-완료-커밋>
git cherry-pick <계측-커밋-SHA>           # bg/react-scan-setup의 "chore: react-scan 계측" 커밋
pnpm install
# → 위 1·2절 동일 수행, 결과는 docs/measurements/T2/runtime.md
git checkout refactor/react-compiler-migration
pnpm install
git branch -D measure/t2                  # 계측 브랜치 폐기
```

T1·T2 모두 끝나면 `bg/react-scan-setup` 브랜치도 삭제한다(원격 포함).
