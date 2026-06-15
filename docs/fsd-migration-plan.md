# FSD 마이그레이션 플랜

> 기준: Feature-Sliced Design v2 (`pages` → `views` 로 rename)
> 대상: `apps/client`, `apps/admin`
> 작성일: 2026-06-15

---

## 목표 구조

### 레이어 정의

```
app       — Next.js App Router 라우팅 (얇은 re-export만)
views     — 페이지 컴포지션 (FSD pages 레이어, naming conflict 회피)
widgets   — 독립적인 대형 UI 블록 (Header, Footer 등)
features  — 재사용 가능한 비즈니스 기능 (폼 스텝, 인증 등)
entities  — 핵심 비즈니스 엔티티 (member, oneseo, operation)
shared    — 비즈니스 무관 재사용 코드 (ui, lib, api, config)
```

### 의존 방향 규칙 (엄수)

```
app → views → widgets → features → entities → shared
                    ↗
           widgets ─
```

- 하위 레이어는 상위 레이어를 절대 import 불가
- 같은 레이어의 슬라이스 간 cross-import 불가
  - 단, entities 간에는 `@x` 표기법으로만 허용
- 모든 슬라이스는 `index.ts` public API를 통해서만 외부에 노출

---

## 목표 디렉토리 구조

### `apps/client/src/`

```
app/                              ← Next.js App Router (라우팅만)
  page.tsx                        → re-export from views/main
  callback/page.tsx               → re-export from views/callback
  check-result/
    layout.tsx
    page.tsx                      → re-export from views/check-result
  faq/page.tsx                    → re-export from views/faq
  guide/page.tsx                  → re-export from views/guide
  introduce/page.tsx              → re-export from views/introduce
  mypage/page.tsx                 → re-export from views/mypage
  oneseo/
    calculate/page.tsx            → re-export from views/oneseo-calculate
  print/page.tsx                  → re-export from views/print
  register/page.tsx               → re-export from views/register
  signup/page.tsx                 → re-export from views/signup
  layout.tsx                      ← Provider, 글로벌 설정 (FSD app 레이어)
  provider.tsx

views/                            ← FSD pages 레이어
  main/
    ui/index.tsx
    index.ts
  callback/
    ui/index.tsx
    index.ts
  check-result/
    ui/index.tsx
    index.ts
  faq/
    ui/index.tsx
    index.ts
  guide/
    ui/index.tsx
    index.ts
  introduce/
    ui/index.tsx
    index.ts
  mypage/
    ui/index.tsx
    index.ts
  oneseo-calculate/
    ui/index.tsx
    index.ts
  print/
    ui/index.tsx
    index.ts
  register/
    ui/index.tsx
    index.ts
  signup/
    ui/index.tsx
    index.ts

widgets/
  header/
    ui/index.tsx
    index.ts
  footer/
    ui/index.tsx
    index.ts
  channel-talk/
    ui/index.tsx
    index.ts
  ← main-sections 없음: Section1~5는 views/main/ui/ 직접 배치 (재사용 없음)
  ← login-notice 없음: features/auth/ui/로 이동 (인증 비즈니스 로직 포함)

features/
  auth/                           ← 인증 전체 (로그인·로그아웃·회원가입·로그인유도 통합)
    ui/
      LoginButton.tsx
      LoginDialog.tsx
      LoginDialogContent.tsx
      SignupForm.tsx
      LoginNoticeDialog.tsx       ← LoginNoticeDialog (인증 관련 인터랙션)
    model/
      signupFormSchema.ts
    api/
      useOAuthLogin.ts
      useLogout.ts
      usePostMember.ts            ← 회원가입
      useSendCode.ts              ← 인증번호 발송
      useVerifyCode.ts            ← 인증번호 확인
    index.ts
  oneseo-form/                    ← 원서 작성 (스텝 폼)
    ui/
      StepsPage.tsx
    api/
      usePostOneseoModifyRequest.ts
    index.ts
  score-calculator/               ← 모의 성적 계산기 (/oneseo/calculate)
    ui/
      CalculatePage.tsx
    api/
      usePostMockScore.ts
    index.ts
  ← result-check 없음: TQ 훅은 entities/member/api/, 다이얼로그 UI는 entities/member/ui/로

entities/
  member/
    api/
      getMyAuthInfo.ts                  ← 서버 컴포넌트용 fetch
      getMyMemberInfo.ts
      getMyFirstTestResult.ts
      getMySecondTestResult.ts
      useGetMyFirstTestResultInfo.ts    ← member 데이터 조회 훅
      useGetMySecondTestResultInfo.ts
    model/
      types.ts                          ← MemberType, AuthInfoType 등
    ui/
      TestResultDialog.tsx              ← member 시험 결과 표시 UI
      PassResultDialog.tsx
    index.ts
  oneseo/
    api/
      getMyOneseo.ts              ← 서버 컴포넌트용 fetch
      getEditability.ts
    model/
      types.ts                    ← OneseoType, PreviewOneseoType 등
      schemas.ts                  ← Zod 스키마
    index.ts
  operation/
    api/
      getDate.ts                  ← 서버 컴포넌트용 fetch
      useGetOperation.ts          ← 전형 일정 조회 훅
    model/
      types.ts                    ← OperationType, DateType 등
    index.ts

shared/
  api/
    axiosInstance.ts
    http.ts
    queryKeys.ts
    requestUrlController.ts
    serverFetch.ts                ← 서버 컴포넌트 공통 fetch 유틸 (신규)
    index.ts
  ui/
    icons/                        ← SVG 아이콘 컴포넌트들
    index.ts
  lib/
    GoogleAnalytics.tsx
    index.ts
  config/
    date.ts
    index.ts
  styles/
    globals.css
    pretendard.ts
```

### `apps/admin/src/` (동일 원칙 적용)

```
app/
  page.tsx                        → re-export from views/main
  edit/[memberId]/page.tsx        → re-export from views/edit
  print/[memberId]/page.tsx       → re-export from views/print
  print/page.tsx                  → re-export from views/print-list
  signin/page.tsx                 → re-export from views/signin
  layout.tsx
  provider.tsx

views/
  main/ui/index.tsx
  edit/ui/index.tsx
  print/ui/index.tsx
  print-list/ui/index.tsx
  signin/ui/index.tsx

widgets/
  side-menu/ui/index.tsx
  filter-bar/ui/index.tsx          ← 검색/필터 UI 블록 (순수 UI, 로직은 features/applicant-search)
  applicant-table/ui/index.tsx     ← ApplicantTH + ApplicantTR

features/
  auth/                            ← admin 로그인
  applicant-search/                ← 지원자 검색/필터 로직
  oneseo-management/               ← 점수입력 + 원서승인 + 엑셀 통합
    api/
      usePatchCompetencyScore.ts   ← 역량검사 점수
      usePatchInterviewScore.ts    ← 심층면접 점수
      usePatchOneseoApproval.ts    ← 원서 승인
      usePatchAgreeDocStatus.ts    ← 서류 제출 상태
      usePatchArrivedStatus.ts     ← 도착 상태
      usePostExcel.ts              ← 엑셀 다운로드
    index.ts
  result-announcement/             ← 1차/2차 결과 발표 (usePostFirstResult, usePostSecondResult)

entities/
  oneseo/
    api/
      getOneseoList.ts
      getOneseoById.ts
      getAdmissionTickets.ts
    model/
      types.ts
    index.ts
  member/
    api/
      getMyAuthInfo.ts
    model/
      types.ts
    index.ts
  operation/
    api/
      getDate.ts
      useGetOperation.ts
    model/
      types.ts
    index.ts

shared/
  api/
  ui/
  lib/
  config/
```

### `packages/` (현행 유지, 점진적 정리)

```
packages/
  @repo/api       ← 두 앱 공유 TQ 훅 (장기적으로 entities로 흡수)
  @repo/ui        ← 두 앱 공유 UI (shared/ui 역할)
  @repo/types     ← 두 앱 공유 타입 (entities/model로 점진적 이동)
  @repo/constants ← shared/config 역할 (현행 유지)
  @repo/store     ← 모달 스토어 (앱별 분리 후 features/model로 이동)
  @repo/hooks     ← shared/lib 역할 (현행 유지)
  @repo/utils     ← shared/lib 역할 (현행 유지)
```

---

## 마이그레이션 단계

### Phase 0 — 사전 준비 (1~2일)

- [ ] 현재 `develop` 브랜치에서 `feat/fsd-migration` 브랜치 생성
- [ ] `steiger` linter 설치 및 FSD 규칙 설정
  ```bash
  pnpm add -D steiger @feature-sliced/steiger-plugin -w
  ```
- [ ] `.steiger.ts` 설정 파일 작성 (`pages` 레이어를 `views`로 alias 처리)
- [ ] 각 앱의 `tsconfig.json`에 path alias 추가
  ```json
  {
    "paths": {
      "@/views/*": ["./src/views/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/features/*": ["./src/features/*"],
      "@/entities/*": ["./src/entities/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
  ```

---

### Phase 1 — `shared` 레이어 구성 (2~3일)

> 의존하는 레이어가 없어 가장 먼저 작업. 기존 코드 이동 중심.

#### `apps/client/src/shared/`

- [ ] `shared/api/` 구성
  - `packages/api/src/libs/` → `shared/api/` 복사 (axiosInstance, http, queryKeys, requestUrlController)
  - `serverFetch.ts` 신규 작성 (현재 `app/apis/` 파일들의 공통 패턴 추출)
    ```ts
    // shared/api/serverFetch.ts
    export async function serverFetch<T>(url: string): Promise<T | undefined> {
      const session = cookies().get('SESSION')?.value;
      try {
        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `SESSION=${session}`,
          },
          cache: 'no-store',
        });
        if (!response.ok) return undefined;
        const json = await response.json();
        return json.data as T;
      } catch {
        return undefined;
      }
    }
    ```

- [ ] `shared/ui/icons/` 구성
  - `assets/` 전체 → `shared/ui/icons/`로 이동
  - `index.ts` public API 작성

- [ ] `shared/lib/` 구성
  - `lib/GoogleAnalytics.tsx` → `shared/lib/`
  - 앱별 utils → `shared/lib/`

- [ ] `shared/config/` 구성
  - `constants/date.ts` → `shared/config/date.ts`
  - `shared/config/index.ts` 작성

- [ ] `shared/styles/` 구성
  - `styles/globals.css`, `styles/pretendard.ts` → `shared/styles/`

#### 검증

```bash
pnpm check-types
pnpm lint
```

---

### Phase 2 — `entities` 레이어 구성 (2~3일)

> `shared`만 의존. 기존 `app/apis/`와 `packages/types`의 타입 이동.

#### `apps/client/src/entities/`

- [ ] `entities/member/` 구성
  - `app/apis/member/getMyAuthInfo.ts` → `entities/member/api/`
    - `shared/api/serverFetch` 활용하여 리팩토링
  - `app/apis/member/getMyMemberInfo.ts` → `entities/member/api/`
  - `app/apis/member/getMyFirstTestResult.ts` → `entities/member/api/`
  - `app/apis/member/getMySecondTestResult.ts` → `entities/member/api/`
  - `packages/api/src/hooks/member/useGetMyFirstTestResultInfo.ts` → `entities/member/api/`
  - `packages/api/src/hooks/member/useGetMySecondTestResultInfo.ts` → `entities/member/api/`
  - `packages/ui/src/components/TestResultDialog/` → `entities/member/ui/`
  - `packages/ui/src/components/PassResultDialog/` → `entities/member/ui/`
  - `packages/types/src/member.ts` → `entities/member/model/types.ts`
  - `entities/member/index.ts` public API 작성

- [ ] `entities/oneseo/` 구성
  - `app/apis/oneseo/getMyOneseo.ts` → `entities/oneseo/api/`
  - `app/apis/oneseo/getEditability.ts` → `entities/oneseo/api/`
  - `packages/types/src/oneseo.ts` → `entities/oneseo/model/types.ts`
  - `entities/oneseo/index.ts` public API 작성

- [ ] `entities/operation/` 구성
  - `packages/api/src/apis/date/getDate.ts` → `entities/operation/api/`
  - `packages/api/src/hooks/operation/useGetOperation.ts` → `entities/operation/api/`
  - `packages/types/src/operation.ts` → `entities/operation/model/types.ts`
  - `entities/operation/index.ts` public API 작성

#### 검증

```bash
pnpm check-types
pnpm lint
```

---

### Phase 3 — `features` 레이어 구성 (3~4일)

> `entities`, `shared`를 의존. 비즈니스 기능 단위 슬라이스.

#### `apps/client/src/features/`

- [ ] `features/auth/` 구성 (로그인·로그아웃·회원가입 통합)
  - `packages/api/src/hooks/auth/useOAuthLogin.ts` → `features/auth/api/`
  - `packages/api/src/hooks/auth/useLogout.ts` → `features/auth/api/`
  - `hooks/api/auth/usePostMember.ts` → `features/auth/api/`
  - `hooks/api/auth/useSendCode.ts` → `features/auth/api/`
  - `hooks/api/auth/useVerifyCode.ts` → `features/auth/api/`
  - `packages/ui/src/components/LoginButton/` → `features/auth/ui/LoginButton.tsx`
  - `packages/ui/src/components/LoginDialog/` → `features/auth/ui/LoginDialog.tsx`
  - `packages/ui/src/components/LoginDialogContent/` → `features/auth/ui/`
  - `schemas/signupForm.ts` → `features/auth/model/signupFormSchema.ts`
    - `birthSchema` 중복 제거, `@repo/types` 재사용

- [ ] `features/oneseo-form/` 구성
  - `hooks/api/oneseo/usePostOneseoModifyRequest.ts` → `features/oneseo-form/api/`
  - `packages/ui/src/components/form/` → `features/oneseo-form/ui/`
  - `packages/ui/src/components/StepWrapper/` → `features/oneseo-form/ui/`
  - `packages/ui/src/components/LiberalSystemSwitch/` → `features/oneseo-form/ui/`

- [ ] `features/score-calculator/` 구성
  - `packages/api/src/hooks/oneseo/usePostMockScore.ts` → `features/score-calculator/api/`
    - 환경변수 직접 참조 제거, 파라미터로 주입받도록 수정

- [ ] `features/result-check/` 해소 — entities/member로 분산
  - `packages/api/src/hooks/member/useGetMyFirstTestResultInfo.ts` → `entities/member/api/` (Phase 2에서 처리)
  - `packages/api/src/hooks/member/useGetMySecondTestResultInfo.ts` → `entities/member/api/` (Phase 2에서 처리)
  - `packages/ui/src/components/TestResultDialog/` → `entities/member/ui/`
  - `packages/ui/src/components/PassResultDialog/` → `entities/member/ui/`

#### 검증

```bash
pnpm check-types
pnpm lint
```

---

### Phase 4 — `widgets` 레이어 구성 (1~2일)

> `features`, `entities`, `shared`를 의존. 대형 독립 UI 블록.

#### `apps/client/src/widgets/`

- [ ] `widgets/header/` 구성
  - `components/Header/` → `widgets/header/ui/`
  - `components/ActiveLink/` → `widgets/header/ui/`

- [ ] `widgets/footer/` 구성
  - `components/Footer/` → `widgets/footer/ui/`

- [ ] `widgets/channel-talk/` 구성
  - `components/ChannelTalk/` → `widgets/channel-talk/ui/`

- [ ] Section1~5는 widgets 미생성 — `views/main/ui/`에 직접 배치 (Phase 5에서 처리)
- [ ] `components/LoginNoticeDialog/` → `features/auth/ui/LoginNoticeDialog.tsx` (Phase 3에서 처리)

#### 검증

```bash
pnpm check-types
pnpm lint
```

---

### Phase 5 — `views` 레이어 구성 (2~3일)

> 모든 하위 레이어를 의존. 기존 `pageContainer/` 이동.

#### `apps/client/src/views/`

- [ ] 각 `pageContainer/*` → 대응하는 `views/*/ui/index.tsx`로 이동
  - `pageContainer/MainPage/` → `views/main/ui/`
  - `pageContainer/RegisterPage/` → `views/register/ui/`
  - `pageContainer/MyPage/` → `views/mypage/ui/`
  - `pageContainer/CheckResultPage/` → `views/check-result/ui/`
  - `pageContainer/SignUpPage/` → `views/signup/ui/`
  - `pageContainer/CallbackPage/` → `views/callback/ui/`
  - `pageContainer/CalculatePage/` → `views/oneseo-calculate/ui/`
  - `pageContainer/PrintPage/` → `views/print/ui/`
  - `pageContainer/FaqPage/` → `views/faq/ui/`
  - `pageContainer/GuidePage/` → `views/guide/ui/`
  - `pageContainer/IntroducePage/` → `views/introduce/ui/`
  - `pageContainer/NotFoundPage/` → `views/not-found/ui/`
- [ ] 각 `views/*/index.ts` public API 작성

#### `app/` 라우팅 파일을 얇은 re-export로 교체

```tsx
// app/page.tsx
export { MainPage as default } from '@/views/main';

// app/register/page.tsx
export { RegisterPage as default } from '@/views/register';

// app/mypage/page.tsx
export { MyPage as default } from '@/views/mypage';
```

#### 검증

```bash
pnpm check-types
pnpm lint
pnpm dev  # 실제 렌더링 확인
```

---

### Phase 6 — `apps/admin` 동일 절차 반복 (3~4일)

> client와 동일한 Phase 1~5 적용. admin 전용 슬라이스 구성.

- [ ] `shared/` 구성 (client와 동일 패턴)
- [ ] `entities/oneseo/` — `getOneseoList`, `getOneseoById`, `getAdmissionTickets`, 관련 타입
- [ ] `entities/member/` — admin용 `getMyAuthInfo`, 관련 타입
- [ ] `entities/operation/` — `getDate`, `useGetOperation`, 관련 타입
- [ ] `features/auth/` — admin 로그인 (useOAuthLogin)
- [ ] `features/applicant-search/` — 지원자 검색/필터 로직 (FilterBar 로직 부분)
- [ ] `features/oneseo-management/` — 점수입력 + 원서승인 + 엑셀 통합
  - usePatchCompetencyScore, usePatchInterviewScore (역량검사/심층면접)
  - usePatchOneseoApproval, usePatchAgreeDocStatus, usePatchArrivedStatus (승인 처리)
  - usePostExcel (엑셀 다운로드)
- [ ] `features/result-announcement/` — usePostFirstResult, usePostSecondResult
- [ ] `widgets/side-menu/` — SideMenu
- [ ] `widgets/filter-bar/` — FilterBar (순수 UI 블록)
- [ ] `widgets/applicant-table/` — ApplicantTH + ApplicantTR
- [ ] `views/` — signin, main, edit, print, print-list

---

### Phase 7 — `packages/` 정리 (1~2일)

> 앱 내부 FSD 레이어로 흡수된 코드 정리.

- [ ] `packages/api` — 앱별 entities/features api로 이동 완료된 훅 제거
  - 두 앱이 공유하는 훅(있다면)은 유지
  - `useGetExampleData.ts` 삭제
- [ ] `packages/types` — entities/model로 이동 완료된 타입 제거
  - 두 앱이 공유하는 타입은 유지 또는 `@repo/types`에 남김
- [ ] `packages/store` — 앱별 features/model로 이동 후 제거 또는 공유 모달만 유지
- [ ] `packages/ui` — `shared/ui`로 역할 재정의, 불필요 컴포넌트 정리

---

### Phase 8 — 최종 검증 및 정리 (1일)

- [ ] `steiger` linter로 FSD 규칙 위반 검사
  ```bash
  npx steiger ./src
  ```
- [ ] `pnpm check-types` 전체 통과
- [ ] `pnpm lint` 전체 통과
- [ ] `pnpm build` 전체 통과
- [ ] e2e 테스트 실행 (playwright)
  ```bash
  pnpm exec playwright test
  ```
- [ ] 구 디렉토리 (`pageContainer/`, `components/`, `assets/`, `hooks/api/`, `lib/`, `utils/`, `constants/`, `schemas/`) 삭제

---

## 공통 규칙 및 컨벤션

### Public API (index.ts)

모든 슬라이스는 반드시 `index.ts`를 통해서만 외부에 노출:

```ts
// entities/member/index.ts
export type { MemberType, AuthInfoType } from './model/types';
export { getMyAuthInfo } from './api/getMyAuthInfo';
export { getMyMemberInfo } from './api/getMyMemberInfo';
```

```ts
// 외부에서 사용 시
import { MemberType } from '@/entities/member'; // ✅
import { MemberType } from '@/entities/member/model/types'; // ❌
```

### Entities 간 cross-import (`@x` 표기법)

```ts
// entities/oneseo에서 member 타입이 필요한 경우
import type { MemberType } from '@/entities/member/@x/oneseo';

// entities/member/@x/oneseo.ts
export type { MemberType } from '../model/types';
```

### 세그먼트 구성 기준

| 세그먼트  | 포함 내용                        |
| --------- | -------------------------------- |
| `ui/`     | React 컴포넌트, CSS              |
| `api/`    | fetch 함수, TQ 훅, 타입          |
| `model/`  | Zod 스키마, 타입, Zustand 스토어 |
| `lib/`    | 슬라이스 내부 유틸               |
| `config/` | 상수, 환경변수                   |

### import 순서 컨벤션

```ts
// 1. 외부 라이브러리
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. 패키지 레이어 (packages/*)
import { cn } from '@repo/utils';

// 3. FSD 레이어 (하위 → 상위 순으로)
import { getMyAuthInfo } from '@/entities/member';
import { useOAuthLogin } from '@/features/auth';
import { Header } from '@/widgets/header';

// 4. 슬라이스 내부 (상대 경로)
import { SignupForm } from './ui/SignupForm';
```

---

## 예상 일정

| Phase    | 내용                                    | 예상 기간   |
| -------- | --------------------------------------- | ----------- |
| Phase 0  | 사전 준비, alias 설정                   | 1~2일       |
| Phase 1  | `shared` 레이어 (client)                | 2~3일       |
| Phase 2  | `entities` 레이어 (client)              | 2~3일       |
| Phase 3  | `features` 레이어 (client)              | 3~4일       |
| Phase 4  | `widgets` 레이어 (client)               | 1~2일       |
| Phase 5  | `views` 레이어 + app re-export (client) | 2~3일       |
| Phase 6  | admin 전체                              | 3~4일       |
| Phase 7  | `packages/` 정리                        | 1~2일       |
| Phase 8  | 최종 검증                               | 1일         |
| **합계** |                                         | **16~24일** |

> 각 Phase가 끝날 때마다 `pnpm check-types && pnpm lint && pnpm build`를 실행하여 회귀 방지.

---

## 주의사항

1. **Phase 순서 엄수**: `shared → entities → features → widgets → views` 순서를 지켜야 의존 방향이 깨지지 않음.
2. **파일 이동 시 import 경로 일괄 업데이트**: IDE의 자동 import 업데이트 기능 활용 또는 `sed`/`grep` 활용.
3. **`packages/`는 Phase 7 전까지 건드리지 않음**: 두 앱 공유 코드가 있어 앱별 FSD 완성 후 정리.
4. **기능 변경 없이 구조만 이동**: 각 Phase는 리팩토링만, 버그 수정은 별도 PR로 분리.
5. **steiger 검사를 CI에 추가**: 마이그레이션 완료 후 FSD 규칙 위반이 재발하지 않도록 `pnpm lint`에 포함.
