'use client';

import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { GoogleIcon, KakaoIcon } from 'shared/assets';
import { Button } from 'shared/components';
import { cn } from 'shared/lib/utils';

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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof loginButtonVariants> {
  isAdmin?: boolean;
}

const LoginButton = React.forwardRef<HTMLButtonElement, LoginButtonProps>(
  ({ className, variant, children, isAdmin = false, ...props }, ref) => {
    const [redirectUri, setRedirectUri] = React.useState('');
    const [googleLoginUrl, setGoogleLoginUrl] = React.useState('');
    const [kakaoLoginUrl, setKakaoLoginUrl] = React.useState('');

    React.useEffect(() => {
      if (typeof window !== 'undefined') {
        const currentOrigin = window.location.origin;

        const stageOrigins = [
          'http://localhost:3000',
          'http://localhost:3001',
          'https://www.stage.hellogsm.kr',
          'https://admin.stage.hellogsm.kr',
        ];

        const productionOrigins = ['https://www.hellogsm.kr', 'https://admin.hellogsm.kr'];

        if (stageOrigins.includes(currentOrigin)) {
          setRedirectUri('https://www.stage.hellogsm.kr/callback');
        } else if (productionOrigins.includes(currentOrigin)) {
          setRedirectUri('https://www.hellogsm.kr/callback');
        }
      }
    }, []);

    React.useEffect(() => {
      if (redirectUri) {
        const state = isAdmin ? 'admin' : variant;

        setGoogleLoginUrl(
          `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile&state=${state}`,
        );
        setKakaoLoginUrl(
          `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${redirectUri}&response_type=code&state=${state}`,
        );
      }
    }, [redirectUri, isAdmin, variant]);

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
        <Button ref={ref} className={cn(loginButtonVariants({ variant }), className)} {...props}>
          {OAuthValues[variant].icon}
          {children}
        </Button>
      </a>
    );
  },
);
LoginButton.displayName = 'LoginButton';

export { LoginButton };
