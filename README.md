## Hello, GSM | 광주소프트웨어마이스터고등학교 입학지원 서비스

이 프로젝트는 복잡하고 불편했던 기존 입학지원 절차를 웹 기반으로 전환하여, 지원 과정을 간편하게 하고 효율적으로 관리할 수 있도록 제작되었습니다.

### Structure

Turborepo 기반 모노레포로, `apps/*`는 배포 단위, `packages/*`는 앱 간에 공유하는 라이브러리입니다.

| 앱                | 역할                                                           | 실행 경로                              |
| ----------------- | -------------------------------------------------------------- | -------------------------------------- |
| `apps/client`     | 지원자용 입학지원 서비스 (Next.js)                             | `pnpm --filter client dev` (포트 3000) |
| `apps/admin`      | 관리자용 원서 심사·관리 서비스 (Next.js)                       | `pnpm --filter admin dev` (포트 3001)  |
| `apps/ocr-lambda` | 생기부 PDF OCR 처리용 AWS Lambda (Next.js 앱이 아닌 별도 빌드) | `pnpm --filter @repo/ocr-lambda build` |

| 패키지                                                                             | 역할                                 |
| ---------------------------------------------------------------------------------- | ------------------------------------ |
| `packages/api`                                                                     | 백엔드 API 요청 URL·클라이언트 정의  |
| `packages/constants`                                                               | client/admin/ocr-lambda 공용 상수    |
| `packages/hooks`                                                                   | 공용 React 훅                        |
| `packages/store`                                                                   | 공용 상태 관리(Zustand) 스토어       |
| `packages/types`                                                                   | 공용 타입 정의                       |
| `packages/ui`                                                                      | 공용 UI 컴포넌트(shadcn/ui 기반)     |
| `packages/utils`                                                                   | 공용 유틸 함수                       |
| `packages/eslint-config`, `packages/tailwind-config`, `packages/typescript-config` | ESLint/Tailwind/TypeScript 공용 설정 |

### Usage

```bash
# 1. 저장소 클론
$ git clone https://github.com/themoment-team/hellogsm-front-26.git

# 2. 의존성 설치
$ pnpm install

# 3. 개발 서버 실행 (Root에서 실행 시 모든 앱 동시 실행)
$ pnpm dev

# 특정 앱만 실행할 경우
$ pnpm --filter client dev
$ pnpm --filter admin dev

# 4. 빌드
$ pnpm build

# 5. 타입 체크 (패키지별 병렬 실행)
$ pnpm check-types

# 6. 유닛 테스트 (네트워크/외부 OCR 호출 없이 순수 로직만 검증, 패키지별 병렬 실행)
$ pnpm test

# 특정 패키지만 실행할 경우
$ pnpm --filter @repo/constants test
$ pnpm --filter @repo/ui test
$ pnpm --filter @repo/ocr-lambda test

# 7. E2E 테스트 (client/admin 두 앱 모두 사전에 `pnpm build` 필요 — Playwright webServer가
#    두 앱을 `next start`로 자동 실행함)
$ pnpm test:e2e
```

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query (v5), Zustand
- **Form**: React Hook Form, Zod
- **Build Tool**: Turborepo, pnpm
