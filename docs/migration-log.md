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
| 2026-07-05 | stage-1 | **Next 14.2.35→15.5.20, React 18.3.1→19.2.7** 업그레이드. 의존성 bump(앱 2 + packages 3 peerDeps ^19 + @types/react 19 overrides 단일화) → `next-async-request-api` codemod 17개 파일 자동 전환(cookies/headers 11 + params/searchParams 6) → 수동 보정은 lint 룰 예외 1건뿐 → images.domains→remotePatterns → fetch 캐싱 결정(아래 표) → radix-ui 6종 최신화. 검증: check-types 9/9, lint 9/9, build 10/10, 스모크 6/6 green | 태그 `upgrade/stage-1-done` |

| 2026-07-06 | stage-2 | **ESLint 8.57.1→9.39.4 + flat config 전면 전환.** 공유 설정 3파일 재작성(typescript-eslint config 헬퍼, import flatConfigs, react configs.flat, next 플러그인은 legacy preset이라 rules 수동 등록), `.eslintrc.cjs` 9개→`eslint.config.mjs`. react-hooks 4.6.2→**7.1.1**(컴파일러 진단 룰 14종 warn 강등, Stage 4에서 승격 검토). **파리티 검증: 사라진 진단 0건**, 신규 10건 전부 react-hooks v7 컴파일러 진단(`scripts/measure/results/stage2-lint-parity/ANALYSIS.md`). 선행 픽스: react-query undefined 에러(기존 이슈). 검증: types 9/9, lint 9/9, build 10/10(빌드 내 lint가 flat config 읽는 것 확인), 스모크 6/6 | 태그 `upgrade/stage-2-done` |

### Stage 2 플러그인 flat config 지원 조사 (2026-07-06 기준)

| 플러그인 | 버전 | flat 지원 형태 |
|---|---|---|
| typescript-eslint (통합) | 8.62.1 | `tseslint.config()` 헬퍼 + `configs.recommended` — parser/plugin 별도 설치 대체 |
| eslint-plugin-import | 2.32.0 | `flatConfigs.recommended/typescript` (import-x 전환 불필요했음) |
| eslint-plugin-react | 7.37.5 | `configs.flat.recommended` |
| eslint-plugin-react-hooks | 7.1.1 | `configs.flat.recommended` (v7부터 컴파일러 진단 룰 포함) |
| @next/eslint-plugin-next | 15.5.20 | **flat preset 없음(legacy 배열)** → plugins 수동 등록 + rules 스프레드 |
| @cspell/eslint-plugin | 10.0.1 | plugins 수동 등록, `configFile` 옵션 스키마 유지 |
| eslint-plugin-turbo / unused-imports / config-prettier | 2.10.3 / 4.4.1 / 10.1.8 | plugins 수동 등록 / flat 배열에 그대로 삽입 가능 |
| eslint | 9.39.4 채택 | ESLint 10(10.6.0) 존재하나 Next 15 공식 지원 범위(9)로 결정 |

### Stage 1 fetch 캐싱 결정 (Next 15 기본값 force-cache→no-store 반전 대응)

| 대상 | 결정 | 근거 |
|---|---|---|
| 세션 쿠키 API 10곳 (`apps/*/src/app/apis/**`) | 기본값(no-store) 그대로 | 사용자별 원서/회원/인증 데이터 — 14에서 암묵 캐싱되던 것이 오히려 위험했음. 새 기본값이 정답 |
| `apps/client/src/app/faq/page.tsx` (Notion API) | 변경 없음 | 이미 `next: { revalidate: 3600 }` 명시돼 있어 기본값 반전 무영향 |
| `packages/api getDate()` (전형 일정, 공개 데이터) | `revalidate: 60` 명시 | 전 페이지에서 호출되는 공통 데이터 — no-store면 요청마다 API 타격. 단 마감/발표 시각 판별에 쓰여 오차 60초로 제한 |

### Stage 1 번들 변화 참고 (webpack, 공식 비교는 T1에서)

- client First Load JS: 308kB → **321kB** (+13kB), admin: 246kB → **258kB** (+12kB) — React 19 + Next 15 런타임 증가분. shared 청크 87.3→102kB
- React 19 콘솔 경고: 프로덕션 스모크 기준 0건 (radix 선최신화로 ref 경고 미발생). dev 모드 경고는 수동 QA 시 확인 예정

## 이슈 로그

문제 발생 시 즉시 기록: 날짜 / 문제 / 원인 / 해결 / 소요 시간.

| 날짜 | 문제 | 원인 | 해결 | 소요 |
|---|---|---|---|---|
| 2026-07-05 | `pnpm add @playwright/test` 직후 `pnpm build` 실패 — `@repo/api`에서 `Cannot find name 'process'`, `Cannot find module 'next/navigation'` | 4월에 생성된 `packages/api/node_modules`의 next/react 심링크가 오래된 `.pnpm` 해시 경로를 가리키고 있었는데, 새 install이 해당 경로를 정리하면서 심링크가 깨짐 (stale node_modules) | `pnpm install` 전체 재실행으로 심링크 재생성 | ~10분 |
| 2026-07-05 | Playwright webServer 기동 실패 — `EADDRINUSE :3000` | client/admin 둘 다 `start` 스크립트가 포트 미지정 `next start`(기본 3000)라 동시 기동 시 충돌 (`dev`만 3000/3001 분리돼 있었음) | playwright.config.ts의 webServer command에 `--port 3000/3001` 명시 | ~5분 |
| 2026-07-05 | Next 15 업그레이드 후 admin `next start`가 `TypeError: Cannot read properties of undefined (reading 'filter')`로 즉사 | admin의 `.next`가 Next 14 시절 빌드 산출물이었음(작업 셸의 cwd가 apps/client에 남아 turbo 빌드 스코프가 client로 좁혀졌던 것) — Next 15 서버가 14의 manifest를 읽다 크래시 | 두 앱 `.next` 삭제 후 루트에서 전체 재빌드. 교훈: **Next 메이저 업그레이드 후 `.next` 잔재는 반드시 청소** | ~15분 |
| 2026-07-05 | `@repo/api` tsc 빌드 실패 — `'next' does not exist in type 'RequestInit'` | getDate에 `next: { revalidate }` 추가했는데, 순수 tsc로 컴파일되는 패키지엔 Next의 RequestInit 전역 확장이 로드되지 않음(앱은 next-env.d.ts로 로드됨) | `/// <reference types="next" />` 추가 | ~10분 |
| 2026-07-06 | dev QA에서 react-query "Query data cannot be undefined" 에러 (`['member','first','result']` 등 2건) | **업그레이드와 무관한 기존 이슈** — axios 인터셉터가 `response.data.data` 반환, 결과 미공개 계정에선 undefined | 해당 훅 2개에서 `?? null` 정규화 | ~20분 |
| 2026-07-06 | flat 전환 후 신규 진단에 ruleId 없는 항목 14건 | ESLint 9부터 `reportUnusedDisableDirectives` 기본 활성화 — 미사용 `eslint-disable` 주석을 보고 | `eslint --fix`로 미사용 지시어 제거(9개 파일, 별도 커밋) | ~10분 |
| 2026-07-06 | 스모크 첫 실행에서 client 메인 1건 실패 후 재실행 통과 | 서버 콜드스타트 + 외부 API 첫 응답 지연으로 인한 플레이크(로컬은 retries 0) | 재실행 통과 확인. CI는 retries 2라 완충 있음 — 반복되면 대기 로직 보강 예정 | ~5분 |
