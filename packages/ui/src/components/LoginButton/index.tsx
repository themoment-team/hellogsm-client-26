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
  // 로그인 시작 URL. 로그인 경로와 origin 규칙은 사용하는 앱이 정한다.
  href: string;
}

const OAuthIcons = {
  google: <GoogleIcon />,
  kakao: <KakaoIcon />,
};

const LoginButton = ({ className, variant, children, href, ...props }: LoginButtonProps) => {
  if (!variant) return null;

  return (
    <a href={href}>
      <Button className={cn(loginButtonVariants({ variant }), className)} {...props}>
        {OAuthIcons[variant]}
        {children}
      </Button>
    </a>
  );
};
LoginButton.displayName = 'LoginButton';

export default LoginButton;
