'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@repo/utils';

import { GoogleIcon, KakaoIcon } from '../../icons';
import { Button } from '../../shadcn';

const loginButtonVariants = cva(
  cn(
    'text-gray-700',
    'gap-4',
    'py-4',
    'h-auto',
    'text-lg',
    'border',
    'rounded-lg',
    'font-semibold',
    'pl-7',
    'pr-8',
  ),
  {
    variants: {
      variant: {
        google: cn('bg-white', 'hover:bg-white', 'border-gray-200'),
        kakao: cn('bg-[#FEE404]', 'hover:bg-[#FEE404]', 'w-full'),
      },
    },
    defaultVariants: {
      variant: 'google',
    },
  },
);

interface LoginButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof loginButtonVariants> {
  isAdmin?: boolean;
}

const getClientOrigin = (origin: string): string => {
  if (origin.includes('localhost')) return 'http://localhost:3000';
  if (origin.includes('stage')) return 'https://www.stage.hellogsm.kr';
  return 'https://www.hellogsm.kr';
};

// 클라이언트 앱의 로그인 시작 Route Handler (apps/client/src/app/api/auth/oauth/route.ts).
// state 발급과 인가 URL 생성은 이 핸들러가 맡는다.
const OAUTH_LOGIN_PATH = '/api/auth/oauth';

const OAuthIcons = {
  google: <GoogleIcon />,
  kakao: <KakaoIcon />,
};

const LoginButton = ({
  className,
  variant,
  children,
  isAdmin = false,
  ...props
}: LoginButtonProps) => {
  // 어드민도 콜백은 클라이언트 origin이므로, state 쿠키를 같은 origin에 남기도록
  // 클라이언트 origin의 핸들러에서 로그인을 시작한다.
  const [adminClientOrigin, setAdminClientOrigin] = React.useState('');

  React.useEffect(() => {
    if (!isAdmin) return;
    // window.location은 클라이언트 전용 값 — 서버 렌더와의 hydration 불일치를 막기 위해
    // 마운트 후 effect에서 반영해야 함 (렌더 중 계산 불가)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdminClientOrigin(getClientOrigin(window.location.origin));
  }, [isAdmin]);

  if (!variant || (isAdmin && !adminClientOrigin)) return null;

  const loginParams = new URLSearchParams({ provider: variant });
  if (isAdmin) loginParams.set('admin', 'true');
  const loginOrigin = isAdmin ? adminClientOrigin : '';
  const loginUrl = `${loginOrigin}${OAUTH_LOGIN_PATH}?${loginParams.toString()}`;

  return (
    <a href={loginUrl}>
      <Button className={cn(loginButtonVariants({ variant }), className)} {...props}>
        {OAuthIcons[variant]}
        {children}
      </Button>
    </a>
  );
};
LoginButton.displayName = 'LoginButton';

export default LoginButton;
