# React Compiler 마이그레이션 로그

HG(hellogsm-front-25)에 React Compiler를 도입하는 마이그레이션(Next 14→15→16, React 18→19, ESLint 8→9)의
**측정 기록 + 작업 로그 + 이슈 로그**를 모두 이 파일에 남긴다. 모든 작업 후 이 파일에 기록한다.

- 브랜치: `refactor/react-compiler-migration` (단일 브랜치)
- 커밋: 리포 컨벤션 `type: 설명` (`feat`/`refactor`/`chore`/`fix`/`test`/`docs`) 준수, stage 구분은 커밋 본문에 `stage-N:` 줄로 기록
- 측정 원본 데이터: `scripts/measure/results/{T0..T3}/` (JSON + 빌드 출력 전문)

## 측정 시점 정의

| 시점 | 상태 | 용도 |
|---|---|---|
| **T0** | Next 14.2.35 / React 18.3.1 / webpack (착수 전) | 전체 스토리의 출발점 |
| **T1** | Next 16 / React 19 / Turbopack, 컴파일러 **OFF** | 컴파일러 효과 격리용 기준점 |
| **T2** | React Compiler **ON** 직후 | T1 대비 = 컴파일러 순수 효과 |
| **T3** | 수동 메모 제거 + forwardRef 정리 + 안정화 후 | 최종 상태 |

핵심 비교쌍: **T1 vs T2**(컴파일러 효과), **T0 vs T3**(전체 성과). T0 vs T2 직접 비교 금지(Turbopack/React 19 효과가 섞임).

## 측정 프로토콜

- **시간 측정은 10회 반복 후 평균** 기록. 10회 개별 값도 전부 기입한다.
- 빌드 시간: `node scripts/measure/build-time.mjs <label> 10`
  - 매 회 `apps/client/.next`, `apps/admin/.next` 삭제 후 `pnpm build --force` (turbo 캐시 우회) → 10회 모두 동일 조건의 콜드 빌드.
  - `turbo run build`는 apps/client + apps/admin + apps/storybook + packages/* 전체 파이프라인을 포함.
- 런타임 지표(리렌더/INP/Lighthouse): production build + `next start`, 시크릿 창, 확장 off, CPU 4x throttle, 5회 중앙값 (T1 시점부터 세팅 예정).
- 동일 머신·동일 전원 조건에서만 시점 간 비교 유효 (아래 환경 기록 참조).

## 측정 환경

| 항목 | 값 |
|---|---|
| 머신 | Intel Core Ultra 7 155H / 16GB RAM (노트북) |
| OS | Windows 11 Pro 10.0.26200 |
| Node | v22.16.0 |
| pnpm | 10.30.2 |
| turbo | 2.8.9 |
| 전원 | **배터리(방전 중)** — ⚠️ T1~T3 측정도 반드시 배터리 상태에서 수행할 것 (전원 조건이 다르면 비교 무효) |

---

## T0 — 베이스라인 (Next 14.2.35 / React 18.3.1 / webpack)

- 측정일: 2026-07-03
- 측정 대상 커밋: `c5512199` (develop HEAD와 동일 코드 — 측정 스크립트/문서만 추가된 상태)
- 브랜치: `refactor/react-compiler-migration` (develop `c5512199`에서 분기)

### 빌드 시간 (`pnpm build --force`, .next 삭제 후 콜드 빌드 × 10회)

| 회차 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| 시간(s) | 59.1 | 59.1 | 104.7 | 57.5 | 58.8 | 57.2 | 60.3 | 73.9 | 68.4 | 68.2 |

- **평균: 66.7s**
- 중앙값: 59.7s / 최소: 57.2s / 최대: 104.7s
- 비고: 3회차(104.7s)는 명백한 아웃라이어(백그라운드 프로세스 간섭 추정). 아웃라이어에 강한 중앙값(59.7s)을 T1 비교 시 함께 볼 것.
- 원본: `scripts/measure/results/T0/build-times.json`
- 빌드 출력 전문(라우트별 First Load JS 포함 — webpack 마지막 수치 📸): `scripts/measure/results/T0/last-build-output.txt`

### 번들 크기 (라우트별 First Load JS, webpack)

| 앱 | 라우트 | First Load JS |
|---|---|---|
| client | `/` `/callback` `/check-result` `/faq` `/guide` `/introduce` `/mypage` `/oneseo/calculate` `/print` `/register` `/signup` | **308 kB** (전 라우트 동일) |
| client | `/_not-found` | 87.5 kB |
| client | shared by all | 87.3 kB |
| admin | `/` `/print` `/signin` | **246 kB** |
| admin | `/edit/[memberId]` `/print/[memberId]` | 235 kB |
| admin | `/_not-found` | 88.2 kB |
| admin | shared by all | 87.3 kB |

- client는 모든 라우트가 308kB로 동일 — 라우트별 코드 스플리팅이 사실상 안 되고 있음(공통 청크에 전부 포함). 컴파일러와 무관하게 개선 여지 포인트로 기록.

### 기타 T0 지표

- Lighthouse / 리렌더 / INP: 미측정 — 측정 도구 세팅(Stage 0 후속)과 함께 수행 예정.

---

## T1 — Next 16 / Turbopack, 컴파일러 OFF

(Stage 3 완료 후 기입)

## T2 — React Compiler ON

(Stage 4 완료 후 기입)

## T3 — 최종 (수동 메모 제거 + 안정화)

(Stage 5 완료 후 기입)

---

## 작업 로그

| 날짜 | Stage | 작업 내용 | 커밋/태그 |
|---|---|---|---|
| 2026-07-03 | stage-0 | 브랜치 생성, 측정 스크립트(`scripts/measure/build-time.mjs`) 추가, T0 빌드 시간 10회 측정(평균 66.7s) + 번들 수치 기록 | 태그 `upgrade/t0-baseline` |
| 2026-07-05 | stage-0 | Playwright 스모크 E2E 6개 추가(client 4: 메인/FAQ/원서조회/회원가입, admin 2: signin 리다이렉트 origin·OAuth redirect_uri — #419~422 회귀 직격 검증) + CI 스텝 추가. 로컬 6/6 green (12.2s) | 태그 `upgrade/stage-0-done` |

## 이슈 로그

문제 발생 시 즉시 기록: 날짜 / 문제 / 원인 / 해결 / 소요 시간.

| 날짜 | 문제 | 원인 | 해결 | 소요 |
|---|---|---|---|---|
| 2026-07-05 | `pnpm add @playwright/test` 직후 `pnpm build` 실패 — `@repo/api`에서 `Cannot find name 'process'`, `Cannot find module 'next/navigation'` | 4월에 생성된 `packages/api/node_modules`의 next/react 심링크가 오래된 `.pnpm` 해시 경로를 가리키고 있었는데, 새 install이 해당 경로를 정리하면서 심링크가 깨짐 (stale node_modules) | `pnpm install` 전체 재실행으로 심링크 재생성 | ~10분 |
| 2026-07-05 | Playwright webServer 기동 실패 — `EADDRINUSE :3000` | client/admin 둘 다 `start` 스크립트가 포트 미지정 `next start`(기본 3000)라 동시 기동 시 충돌 (`dev`만 3000/3001 분리돼 있었음) | playwright.config.ts의 webServer command에 `--port 3000/3001` 명시 | ~5분 |
