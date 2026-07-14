# T2 런타임 측정 결과 (React Compiler ON)

- 측정일: 2026-07-09 / 커밋: `e3835b53` (bg/react-scan-t2 = refactor/react-compiler-migration + 계측 cherry-pick) / 브라우저: Chrome 149
- 스택: Next 16 / React 19 / **React Compiler ON** (`reactCompiler: true`, babel-plugin-react-compiler ^1.0.0)
- 계측: T1과 **동일한 방식**(DevTools `onCommitFiberRoot` 훅 + bippy `didFiberRender`, 스크립트는 T1 runtime.md 부록).
  시나리오당 5회 중앙값. 리셋은 `__mcReset()`.
- 상태: **리렌더 S1·S2·S3 완료 / INP S1·S2·S3 완료(2026-07-11, prod·배터리)** — S1 80 / S2 64 / S3 88 ms (아래 INP 섹션)

## 리렌더: T1(컴파일러 OFF) ↔ T2(컴파일러 ON) 비교

| 시나리오 | 지표 | T1 | **T2** | 변화 |
|---|---|---|---|---|
| S1 타이핑(20자) | StepWrapper | 20 | 20 | — |
| S1 타이핑(20자) | Step1Register | 21 | 21 | — |
| S1 타이핑(20자) | Input(합계) | 84 | 84 | — |
| S1 타이핑(20자) | **SelectItem(옵션 합)** | 2,646 | 1,323 | **-50%** |
| S1 타이핑(20자) | **폼 전체** | 16,043 | 13,460 | **-16.1%** |
| S2 모달 열닫(10회) | ClientModals | 20 | 20 | — |
| S2 모달 열닫(10회) | Header(모달 외부) | 0 | 0 | — |
| S2 모달 열닫(10회) | **전체(guide)** | 10,712 | 3,575 | **-66.6%** |
| S3 필터링 | MainPage | 7 | 7 | — |
| S3 필터링 | FilterBar | 7 | 3 | **-57%** |
| S3 필터링 | ApplicantTR(행) | 35 | 31 | **-11.4%** |
| S3 필터링 | Pagination | 7 | 4 | **-43%** |
| S3 필터링 | **전체** | 6,348 | 5,494 | **-13.5%** |

> T2 5회 값: S1 = 13,460 (5회 전부 동일, 결정론적) / S2 = 3,575 중앙값(3439·3402·3575·3575·3575) /
> S3 = 5,494 중앙값(rep1 7,206은 warm-up 아웃라이어, rep2~5 전부 5,494).

## 핵심 관찰

- **S2(모달 열닫)에서 컴파일러 효과가 가장 큼: 전체 churn -66.6%**(10,712→3,575). radix Dialog/Presence/AlertDialog
  계열의 반복 리렌더가 크게 줄었음. 단 ClientModals(토글당 1회=20)·Header(0)는 불변 = 렌더 "범위"가 아니라
  렌더 "비용/횟수"가 줄어든 것.
- **S1(폼 타이핑)은 -16%**로 중간. **SelectItem이 정확히 절반**(2,646→1,323)으로 컴파일러가 Select 옵션 리스트를
  메모이즈. 그러나 StepWrapper·Step1Register·Input은 불변 → 키 입력당 폼 상위 트리는 여전히 리렌더됨(컴파일러가
  최상위 폼 리렌더 자체를 막지는 못함, 하위 무거운 리스트를 메모).
- **S3(admin 필터링)은 -13.5%**로 가장 작음(FilterBar -57%, Pagination -43%이나 절대 수가 작아 전체 영향 제한적).
  테이블 데이터가 5행뿐이라 개선 여지가 작음 — 데이터가 많을수록 ApplicantTR 감소 효과가 커질 가능성.

## 조건/편차 (T1과 동일 통제 위함)

- 리렌더는 결정론적이라 전원·가시성 무관(T1과 동일). dev 모드 + 내 훅. (react-scan은 client만 ON, admin은 OFF였으나
  계측은 react-scan 비의존이라 카운트 무관.)
- **S3 데이터셋: T1과 동일 5행**(B-1/A-7/A-6/A-3/A-1, 1페이지) — 확인함. 행 수 동일하므로 ApplicantTR 비교 유효.
- **S2 조건 차이**: T1은 비로그인 guide, T2는 로그인 guide에서 스토어 토글로 측정. loginRequiredModal 내부 렌더는
  auth 무관이라 ClientModals(20)·Header(0) 동일 확인. "전체"는 guide 페이지 컨텍스트 기준으로 비교(양쪽 guide).
- 측정 환경: 시크릿 아님·확장 on(T1과 동일 편차). 계측 방식은 T1 runtime.md 부록과 동일.

## INP (prod, 배터리) — 완료

측정: react-scan 끈 T2 prod 빌드(`NEXT_PUBLIC_PERF_LOG='true'`, `NEXT_PUBLIC_REACT_SCAN=''`, `pnpm build --force`),
**배터리(방전 중, charging=false, 62%)**, Chrome 포그라운드·visible 탭. 주지표 = `PerformanceObserver('event', durationThreshold:0)`
이벤트 지연 최댓값(ms), 각 5회 중앙값. T1과 동일 방식. 측정일 2026-07-11.

| 시나리오 | 1회 | 2회 | 3회 | 4회 | 5회 | 중앙값(T2) | T1(배터리) | 변화 |
|---|---|---|---|---|---|---|---|---|
| S1 타이핑(20자) | 96 | 88 | 64 | 80 | 64 | **80** | 656 | **-88%** |
| S2 모달 열기 | 72 | 64 | 56 | 48 | 64 | **64** | 80 | **-20%** |
| S3 필터링 | 80 | 88 | 80 | 88 | 88 | **88** | 104 | **-15%** |

## INP 핵심 관찰

- **S1(폼 타이핑) INP -88%(656→80ms)**: 가장 극적. dev 리렌더 수는 -16%(16,043→13,460)에 그쳤으나 INP는 훨씬
  크게 개선. 컴파일러가 메모이즈한 서브트리(특히 SelectItem 옵션 리스트, -50%)에서 React가 재조정(reconciliation)을
  통째로 bail-out 하기 때문 — "커밋 수" 감소보다 "커밋 비용" 감소가 훨씬 큼. Chrome 기준 T1 656ms("나쁨") →
  T2 80ms("좋음")으로 구간 자체가 바뀜.
- **S2(모달 열기) INP -20%(80→64ms)**: 모달 열기 자체가 이미 가벼워(T1 "좋음") 개선 폭 작음. 리렌더 churn은
  -67%지만 "열기 상호작용" 한 번의 지연은 원래 낮아 절대 감소분이 작음.
- **S3(admin 필터링) INP -15%(104→88ms)**: 데이터 5행뿐이라 개선 여지 작음(리렌더도 -13.5%). 데이터가
  많아지면 격차가 커질 가능성.

## INP 측정 조건/편차

- **전원: 배터리 방전 중**(navigator.getBattery charging=false, level 62%) — T1과 동일 조건.
- **탭 포그라운드·visible 확인**(document.visibilityState='visible', 타이핑 시 focus=true). 이벤트 타이밍은
  visible 탭에서만 기록되므로 Chrome을 최전면으로 올려 측정.
- **입력**: S1은 라틴 20자(abc…t)로 결정론적 입력(한글 IME 조합 변수 제거). 지표가 이벤트 지연 최댓값이라 문자 종류 무관.
- **S2**: 로그아웃 상태 guide에서 "원서 작성하기" 클릭 → loginRequiredModal 열기 지연만 측정, 매 회 새 페이지 로드
  (닫기는 페이지 이동이라 제외). 측정 후 재로그인은 사용자 수행.
- **S3**: admin(:3001) 로그인 후 검색"김"(→A-1 김태은 1행)→전형 일반전형→제출여부 제출완료→페이지2(no-op) 시퀀스.
  매 rep 전 페이지 리로드로 베이스라인 복귀. 데이터셋 T1과 동일 5행.
- **⚠️ 교차검증 권장**: S1의 -88%는 폭이 매우 커서, T1도 동일 자동화 하니스(이 세션 스크립트, 라틴 20자, 동일 대기)로
  재측정하면 절대값 비교가 더 엄밀해짐. 현재는 T1 runtime.md 기록값(656)과 비교한 것.
