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

const LoginButton = ({
  className,
  variant,
  children,
  isAdmin = false,
  ...props
}: LoginButtonProps) => {
  const [redirectUri, setRedirectUri] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = isAdmin ? getClientOrigin(window.location.origin) : window.location.origin;
      // window.location은 클라이언트 전용 값 — 서버 렌더와의 hydration 불일치를 막기 위해
      // 마운트 후 effect에서 반영해야 함 (렌더 중 계산 불가)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRedirectUri(`${origin}/callback`);
    }
  }, [isAdmin]);

  // 로그인 URL은 redirectUri의 순수 파생값 — 상태·effect 대신 렌더 중 계산
  const oauthState = isAdmin ? 'admin' : variant;
  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile&state=${oauthState}`;
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${redirectUri}&response_type=code&state=${oauthState}`;

  const OAuthValues = {
    google: {
      icon: <GoogleIcon />,
      href: googleLoginUrl,
    },
    kakao: {
      icon: <KakaoIcon />,
      href: kakaoLoginUrl,
    },
  };

  if (!redirectUri || !variant) return null;

  return (
    <a href={OAuthValues[variant].href}>
      <Button className={cn(loginButtonVariants({ variant }), className)} {...props}>
        {OAuthValues[variant].icon}
        {children}
      </Button>
    </a>
  );
};
LoginButton.displayName = 'LoginButton';

export default LoginButton;
