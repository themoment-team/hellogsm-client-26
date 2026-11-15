import { cn } from '@repo/utils';

import { LoginButton } from '../';

// 클라이언트 앱의 로그인 시작 Route Handler(apps/client/src/app/api/auth/oauth/route.ts).
// 이 다이얼로그는 클라이언트 앱에서만 쓰이므로(어드민은 카카오 로그인 미지원) 현재 origin 기준 경로를 쓴다.
const getClientLoginHref = (provider: 'google' | 'kakao') =>
  `/api/auth/oauth?${new URLSearchParams({ provider }).toString()}`;

const LoginDialogContent = () => {
  return (
    <div
      className={cn('w-fit', 'flex', 'pt-8', 'px-12', 'pb-10', 'flex-col', 'items-center', 'gap-8')}
    >
      <span className={cn('text-2xl', 'font-semibold', 'text-gray-900')}>로그인</span>
      <div className={cn('flex', 'flex-col', 'gap-3')}>
        <LoginButton variant="kakao" href={getClientLoginHref('kakao')}>
          카카오로 시작하기
        </LoginButton>
        <LoginButton variant="google" href={getClientLoginHref('google')}>
          Google 계정으로 시작하기
        </LoginButton>
      </div>
    </div>
  );
};

export default LoginDialogContent;
