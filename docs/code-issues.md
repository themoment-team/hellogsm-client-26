# 코드베이스 개선/수정 필요 항목

> 분석 일자: 2026-06-15  
> 대상: `apps/client`, `apps/admin`, `packages/*` 전체

---

## 심각도 기준

| 심각도 | 기준 |
|---|---|
| 🔴 Critical | 즉시 수정. 기능 버그 또는 데이터 소실 |
| 🟠 High | 빠른 수정 권고. 잠재적 런타임 오류 또는 심각한 설계 결함 |
| 🟡 Medium | 개선 권고. 코드 품질, 유지보수성, 일관성 문제 |
| 🔵 Low | 사소한 정리. 빌드/런타임에 영향 없음 |

---

## 1. 버그 / 잠재적 오류

### 🔴 `isTimeBefore` 인수 순서 불일치 — 원서 마감 판정 로직 역전

- **파일:** `apps/client/src/app/register/page.tsx:32`, `apps/client/src/app/mypage/page.tsx:20`
- **문제:** 동일한 마감일 비교 로직에서 두 파일이 `baseTime` / `compareTime` 인수 순서가 반대. 둘 중 하나는 반드시 마감 여부를 반대로 판정하고 있음.
- **수정:** `isTimeBefore` 함수 시그니처 확인 후 두 파일 중 잘못된 쪽 수정.

---

### 🔴 `QueryClient` 매 렌더링마다 재생성

- **파일:** `apps/client/src/app/provider.tsx:13`, `apps/admin/src/app/provider.tsx:9`
- **문제:** `QueryClient`를 컴포넌트 본문에서 직접 생성 → `Provider` 리렌더링마다 새 인스턴스 생성, 캐시 전체 소실.
- **수정:**
  ```tsx
  // Before
  const queryClient = new QueryClient({ ... });

  // After
  const [queryClient] = useState(() => new QueryClient({ ... }));
  ```

---

### 🟠 `getAdmissionTickets` — `response.json()` 파싱 후 상태 체크

- **파일:** `apps/admin/src/app/apis/oneseo/getAdmissionTickets.ts:33-45`
- **문제:** `response.json()` 호출 이후에 `!response.ok` 체크. 500 오류 등 비정상 응답 시 body 스트림이 이미 소비된 상태에서 redirect 시도.
- **수정:** `!response.ok` 체크를 `response.json()` 호출 이전으로 이동.

---

### 🟠 `getOneseoById` — try-catch 없이 fetch 호출

- **파일:** `apps/admin/src/app/apis/oneseo/getOneseoById.ts`
- **문제:** 네트워크 오류 발생 시 예외가 페이지로 전파. `apps/client`의 동일 패턴 함수들은 모두 try-catch로 감싸져 있어 불일치.
- **수정:** try-catch 추가.

---

### 🟠 `usePostFirstResult` / `usePostSecondResult` — `options` 파라미터 required

- **파일:** `packages/api/src/hooks/operation/usePostFirstResult.ts:6`, `usePostSecondResult.ts:6`
- **문제:** `options`가 필수값으로 선언되어 있으나 다른 모든 mutation 훅은 `options?:`로 optional 처리. 호출 측에서 타입 에러 발생 가능.
- **수정:** `options?: UseMutationOptions<...>`로 변경.

---

### 🟠 `axiosInstance` response interceptor — 도달 불가능한 조건 + 401 미처리

- **파일:** `packages/api/src/libs/axiosInstance.ts:17-29`
- **문제 1:** Axios는 기본적으로 2xx 외 상태를 error interceptor로 라우팅하므로 `status >= 200 && status <= 300` 체크는 dead code.
- **문제 2:** error interceptor에서 `Promise.reject(error)`만 실행. 401 처리, 토큰 갱신 로직 전무.
- **수정:** 불필요한 범위 체크 제거, 401 처리 로직 추가 검토.

---

### 🟠 `usePostMockScore` — 환경변수 non-null assertion

- **파일:** `packages/api/src/hooks/oneseo/usePostMockScore.ts:25,29`
- **문제:** `process.env.NEXT_PUBLIC_MOCK_SCORE_URL!`로 강제 단언. 환경변수 미설정 시 `undefined`가 URL로 전달되어 silent 오류.
- **추가 문제:** 공유 패키지(`@repo/api`)에서 앱 레벨 환경변수를 직접 참조 → 패키지가 앱에 종속됨 (아키텍처 문제 참조).
- **수정:** 환경변수 존재 여부 검증 후 사용. `.env.example`에 추가.

---

### 🟠 `CallbackPage` — `useEffect` deps 불완전

- **파일:** `apps/client/src/pageContainer/CallbackPage/index.tsx:72`
- **문제:** `useEffect` deps에 `googleLogin`, `kakaoLogin`, `router` 누락. stale closure 잠재 위험.
- **수정:** deps array에 해당 값 추가. `isCalled.current` 가드로 중복 실행 방지는 유지.

---

### 🟠 `StepWrapper` — `memberId!` non-null assertion

- **파일:** `packages/ui/src/components/StepWrapper/index.tsx:213`
- **문제:** `type === 'client'`일 때 `memberId`는 `undefined`이지만 `usePutOneseoByMemberId(memberId!, ...)` 호출. 같은 파일 194번 줄에서는 `memberId ?? 0`을 사용해 불일치.
- **수정:** 일관되게 `memberId ?? 0` 또는 조건부 렌더링으로 처리.

---

### 🟠 `formatScore` — `NaN` 문자열 반환

- **파일:** `packages/utils/src/formatScore.ts`
- **문제:** 빈 문자열 입력 시 `parseFloat('') → NaN → NaN.toFixed(2) → 'NaN'` 문자열 반환. `ApplicantTR`에서 `formattedScore !== 'NaN'`으로 우회 중이나 함수 자체의 설계 결함.
- **수정:** 함수 내부에서 `isNaN` 체크 후 적절한 기본값(예: `'0.00'`) 반환.

---

### 🟠 `check-result/page.tsx` — 변수명 의미 반전

- **파일:** `apps/client/src/app/check-result/page.tsx:14,48`
- **문제:** `getMyOneseo()` 반환값을 `isOneseoWrite`에 할당하고, `isOneseoWrite === undefined`를 "원서 미제출"로 사용. 변수명과 의미가 정반대.
- **수정:** `const oneseo = await getMyOneseo()` 등 의미를 정확히 표현하는 이름으로 변경.

---

### 🟡 `getKoreanDate` — UTC 변환 오류 가능성

- **파일:** `packages/utils/src/getKoreanDate.ts`
- **문제:** `toLocaleString`으로 얻은 로컬 시간 문자열에 `Z`(UTC)를 붙여 파싱 → 9시간 오차 발생 가능.
- **수정:** `Z` 대신 `+09:00` 사용 또는 `date-fns-tz` 등 라이브러리 활용.

---

### 🟡 `useTimer.ts` — interval 중복 생성 및 cleanup 누락

- **파일:** `apps/client/src/hooks/useTimer.ts`
- **문제:** `startTimer` 재호출 시 이전 interval을 clear하지 않아 중복 실행. unmount cleanup 없음.
- **수정:** `startTimer` 시 기존 interval clear, `useEffect` cleanup 함수에서 `clearInterval` 호출.

---

### 🟡 `dataURLtoFile` — 유효하지 않은 base64 예외 처리 없음

- **파일:** `packages/utils/src/dataURLtoFile.ts`
- **문제:** 유효하지 않은 dataURL 입력 시 `atob()`이 예외를 throw하나 catch 없음.
- **수정:** try-catch로 감싸고 `null` 반환 또는 에러를 명시적으로 throw.

---

### 🟡 `SignUpPage` — `certificationNumber` 클라이언트 검증 미흡

- **파일:** `apps/client/src/pageContainer/SignUpPage/index.tsx:194`
- **문제:** `signupFormSchema`에서 `certificationNumber: z.string().optional()` → 미입력 시 빈 문자열이 서버 전송. 최소 6자 검증 없음.
- **수정:** 스키마에서 최소 길이 및 필수 검증 추가.

---

## 2. 아키텍처

### 🟠 `packages/api`에서 앱 레벨 환경변수 직접 참조

- **파일:** `packages/api/src/hooks/oneseo/usePostMockScore.ts:25,29`
- **문제:** 공유 패키지가 `NEXT_PUBLIC_MOCK_SCORE_URL`, `NEXT_PUBLIC_MOCK_SCORE_API_KEY`를 직접 참조. 패키지의 재사용성 훼손.
- **수정:** 앱에서 훅 호출 시 파라미터로 주입하거나, 앱 레벨 래퍼 훅으로 분리.

---

### 🟠 `admin/edit/[memberId]/page.tsx` — redirect 경로 오류

- **파일:** `apps/admin/src/app/edit/[memberId]/page.tsx:17`
- **문제:** `redirect(`/register/${id}?step=1`)` — admin 앱에서 client 앱 경로로 이동. 올바른 경로는 `/edit/${id}?step=1`.
- **수정:** redirect 경로를 admin 앱 기준으로 수정.

---

### 🟠 서버 컴포넌트 fetch 패턴 7개 파일에 중복

- **파일:** `apps/client/src/app/apis/`, `apps/admin/src/app/apis/`
- **문제:** 쿠키 주입, `response.json()`, 에러 처리 패턴이 각 파일마다 미묘하게 다르게 복사됨.
  ```ts
  // 7개 파일에서 반복되는 패턴
  const session = cookies().get('SESSION')?.value;
  const response = await fetch(new URL(...), {
    headers: { Cookie: `SESSION=${session}` },
  });
  ```
- **수정:** 공통 `serverFetch(url, options?)` 유틸리티 함수로 추상화.

---

### 🟡 `useModalStore` — admin/client 모달 단일 스토어에 혼재

- **파일:** `packages/store/src/useModalStore.ts`
- **문제:** admin 전용, client 전용, 공유 모달이 하나의 Zustand 스토어에 통합. client 번들에 admin 모달 코드가 포함됨.
- **수정:** 스토어 분리 또는 앱별 모달은 각 앱 내부로 이동.

---

### 🟡 `useGetExampleData` — 예시 훅이 프로덕션 번들에 포함

- **파일:** `packages/api/src/hooks/useGetExampleData.ts`
- **문제:** 예시용 훅이 `index.ts`에서 export되어 프로덕션 번들에 포함됨.
- **수정:** 파일 삭제 또는 index에서 제거.

---

### 🟡 `packages/api/libs` 내부 구현이 외부에 노출

- **파일:** `packages/api/src/libs/index.ts`
- **문제:** `requestUrlController`, `queryKeys` 등 내부 구현이 public export되어 앱 레이어에서 직접 사용됨. 캡슐화 훼손.
- **수정:** 필요한 것만 export하거나 앱에서의 직접 참조를 제거.

---

## 3. 타입 안전성

### 🟠 `StepWrapper` — 매 렌더링마다 4개 Zod 스키마 실행

- **파일:** `packages/ui/src/components/StepWrapper/index.tsx:170-175`
- **문제:** `watch()` + `safeParse()`를 직접 객체 리터럴에서 사용 → 폼 값 변경마다 4개의 복잡한 Zod 스키마 검증 실행.
- **수정:** `useFormState`의 `isValid` 활용 또는 `useMemo`로 감싸기.

---

### 🟡 `oneseo.ts` — `RelationshipWithGuardianValueEnum | string` 느슨한 타입

- **파일:** `packages/types/src/oneseo.ts:112`
- **문제:** enum 외 임의 문자열도 허용하는 타입 정의. step3 스키마의 enum 검증과 불일치.
- **수정:** `RelationshipWithGuardianValueEnum`만 사용.

---

### 🟡 `StepWrapper` — `liberalSystem` 기본값 무조건 `FREE_SEMESTER`

- **파일:** `packages/ui/src/components/StepWrapper/index.tsx:137`
- **문제:** `liberalSystem`이 `null`인 경우에도 무조건 `FREE_SEMESTER`로 초기화. 처음 작성하는 수험생에게 의도치 않은 기본값 설정.
- **수정:** null 상태를 별도 처리하거나 UI에서 명시적으로 선택하도록 유도.

---

## 4. 코드 품질

### 🟠 한글 변수/prop명 사용

- **파일:** `apps/admin/src/app/page.tsx:30,35,42,47`, `apps/admin/src/pageContainer/MainPage/index.tsx:24,28,49,50,159,160`
- **문제:** `is역량검사처리기간`, `is심층면접처리기간` 등 한글 식별자가 컴포넌트 prop까지 전파.
- **수정:** 영문 camelCase로 통일. 예: `isCompetencyTestPeriod`, `isInterviewPeriod`.

---

### 🟠 날짜 JSX에 하드코딩

- **파일:** `apps/admin/src/pageContainer/TicketPage/index.tsx:232,305`
- **문제:** `2025. 11. 05.(수) ~ 11. 10.(월) 16:30` 등이 JSX에 직접 삽입. 매년 수동 수정 필요.
- **수정:** `packages/constants/src/date.ts`로 이동.

---

### 🟠 `SearchDialog` — 학교 검색 API 오류 처리 없음

- **파일:** `packages/ui/src/components/SearchDialog/index.tsx:39-58`
- **문제:** NEIS API 호출 실패 시 아무 처리 없음. 컴포넌트가 빈 상태로 남음.
- **수정:** 로딩/에러 상태 추가, 사용자에게 재시도 안내.

---

### 🟡 `SignUpPage` — `useTimer.ts` 미사용, 타이머 직접 구현 (497줄)

- **파일:** `apps/client/src/pageContainer/SignUpPage/index.tsx`, `apps/client/src/hooks/useTimer.ts`
- **문제:** 프로젝트 내 `useTimer.ts` 훅이 존재하나 SignUpPage에서는 직접 구현. `useTimer.ts`는 어디서도 사용되지 않음.
- **수정:** `useTimer.ts` 활용 또는 삭제.

---

### 🟡 이중 부정 패턴

- **파일:** `apps/client/src/pageContainer/MainPage/index.tsx:45`, `apps/client/src/pageContainer/MyPage/index.tsx:71`
- **문제:** `x === null ? true : false` — 불필요한 삼항식.
- **수정:** `x === null`로 단순화.

---

### 🟡 생년도 범위 하드코딩

- **파일:** `packages/ui/src/components/register/Step1Register/index.tsx:39`
- **문제:** `Array.from({ length: 20 }, (_, i) => 2015 - i)` — 2015년 고정, 매년 갱신 필요.
- **수정:** `new Date().getFullYear()` 기반으로 동적 계산.

---

### 🟡 admin `layout.tsx` metadata 미입력

- **파일:** `apps/admin/src/app/layout.tsx:13-16`
- **문제:** `title: ''`, `description: ''`으로 비어 있음.
- **수정:** 적절한 메타데이터 입력.

---

### 🟡 `UploadPhoto` — `multiple` 속성 불일치

- **파일:** `packages/ui/src/components/UploadPhoto/index.tsx:53`
- **문제:** `<input type="file" multiple>` 이지만 `files[0]`만 처리.
- **수정:** `multiple` 속성 제거.

---

## 5. 성능

### 🟡 `MainPage` — `getIsServerHealthy()` layout/page 양쪽 호출

- **파일:** `apps/client/src/app/layout.tsx:50`, `apps/client/src/app/page.tsx:22`
- **문제:** 동일 데이터를 두 곳에서 독립 요청. Next.js request deduplication 적용되나 의도 불명확.
- **수정:** 한 곳에서만 fetch 후 prop으로 전달하거나 Context 활용.

---

### 🟡 `useGetOneseoList` — staleTime 5분 + 수동 refetch 충돌

- **파일:** `packages/api/src/hooks/oneseo/useGetOneseoList.ts:53`
- **문제:** 5분 staleTime 설정이지만 필터 변경 시 `oneseoRefetch()`를 수동 호출. 설정과 사용 방식이 불일치.
- **수정:** staleTime을 0으로 줄이거나 수동 refetch 방식을 제거.

---

## 6. 설정 누락

### 🟠 `.env.example` — 실제 사용 환경변수 다수 누락

- **파일:** `apps/client/.env.example`, `apps/admin/.env.example`
- **누락된 변수:**
  ```
  NEXT_PUBLIC_MOCK_SCORE_URL
  NEXT_PUBLIC_MOCK_SCORE_API_KEY
  NEXT_PUBLIC_GOOGLE_CLIENT_ID
  NEXT_PUBLIC_KAKAO_REST_API_KEY
  NEXT_PUBLIC_NEIS_API_KEY
  NEXT_PUBLIC_GOOGLE_ANALYTICS
  NEXT_PUBLIC_CDN_URL
  NEXT_PUBLIC_IMAGE_URL
  NEXT_PUBLIC_STAGE
  NEXT_PUBLIC_IS_TEST_PERIOD
  ```
- **수정:** 실제 코드에서 사용 중인 모든 `NEXT_PUBLIC_*` 변수 추가.

---

### 🟡 `next.config.mjs` — deprecated `images.domains` 잔존

- **파일:** `apps/client/next.config.mjs:5`
- **문제:** Next.js 13+에서 deprecated된 `images.domains` 사용.
- **수정:** `remotePatterns`로 통합.

---

### 🟡 테스트 인프라 전무

- **파일:** `turbo.json`, 프로젝트 전체
- **문제:** `test` task 정의 없음, 테스트 파일 없음. 핵심 비즈니스 로직(성적 계산, 마감일 판정 등) 검증 불가.
- **수정:** 최소한 `packages/utils`의 순수 함수들부터 단위 테스트 추가 검토.

---

## 7. 중복 코드

### 🟡 `birthSchema` 중복 정의

- **파일:** `apps/client/src/schemas/signupForm.ts:19-32`, `packages/types/src/schemas/birthSchema.ts`
- **수정:** `@repo/types`의 `birthSchema`를 import하여 재사용.

---

### 🟡 `departmentLabels` / `screeningLabels` 매핑 분산

- **파일:** `apps/client/src/pageContainer/MyPage/index.tsx:79-84,99-104` 외 여러 파일
- **문제:** enum → 한국어 label 매핑이 여러 컴포넌트에 각각 정의.
- **수정:** `packages/constants`에서 통합 관리.

---

## 8. 접근성

### 🟡 `CheckResultPage` — 클릭 가능한 `div`

- **파일:** `apps/client/src/pageContainer/CheckResultPage/index.tsx:91-98`
- **문제:** `onClick` 핸들러가 `div`에 적용. 키보드 접근 불가.
- **수정:** `<button>` 태그로 교체.

---

## 9. 기타 정리

### 🔵 `.DS_Store` 파일 git 추적 중

- **파일:** `apps/client/src/.DS_Store`, `apps/client/src/pageContainer/.DS_Store`, `apps/client/src/pageContainer/FaqPage/.DS_Store`
- **수정:** `.gitignore`에 `.DS_Store` 추가 후 `git rm --cached` 로 추적 제거.

---

### 🔵 `TicketPage` — `rowSpan={1}` 불필요

- **파일:** `apps/admin/src/pageContainer/TicketPage/index.tsx:97,109,130`
- **수정:** 기본값과 동일하므로 제거.

---

### 🔵 `SearchDialog` — `new URL("완전한URL")` 불필요 래핑

- **파일:** `packages/ui/src/components/SearchDialog/index.tsx:46`
- **수정:** 문자열을 직접 `fetch()`에 전달.

---

### 🔵 `packages/constants/src/date.ts` — TODO 주석 및 형식 불일치

- **문제:** `RECRUITMENT_PERIOD.startDate`와 `endDate`가 서로 다른 형식으로 혼용, 다수의 TODO 주석 미처리.
- **수정:** 날짜 형식 통일 및 TODO 처리.

---

## 우선순위 요약

| 순위 | 항목 | 파일 |
|---|---|---|
| 1 | `isTimeBefore` 인수 순서 불일치 | `register/page.tsx`, `mypage/page.tsx` |
| 2 | admin redirect 경로 오류 | `edit/[memberId]/page.tsx` |
| 3 | `QueryClient` 재생성 | `provider.tsx` (client + admin) |
| 4 | `check-result` 변수명 반전 | `check-result/page.tsx` |
| 5 | `.env.example` 업데이트 | client + admin |
| 6 | 서버 fetch 패턴 중복 제거 | `app/apis/` 전체 |
| 7 | 한글 변수/prop명 영문화 | `admin/MainPage` |
| 8 | `.DS_Store` git 추적 제거 | 루트 `.gitignore` |
