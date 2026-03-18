## Hello, GSM | 광주소프트웨어마이스터고등학교 입학지원 서비스

이 프로젝트는 복잡하고 불편했던 기존 입학지원 절차를 웹 기반으로 전환하여, 지원 과정을 간편하게 하고 효율적으로 관리할 수 있도록 제작되었습니다.

### Usage

```bash
# 1. 저장소 클론
$ git clone https://github.com/themoment-team/hellogsm-front-25.git

# 2. 의존성 설치
$ pnpm install

# 3. 개발 서버 실행 (Root에서 실행 시 모든 앱 동시 실행)
$ pnpm dev

# 특정 앱만 실행할 경우
$ pnpm --filter client dev
$ pnpm --filter admin dev

# 4. 빌드
$ pnpm build
```

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query (v5), Zustand
- **Form**: React Hook Form, Zod
- **Build Tool**: Turborepo, pnpm
