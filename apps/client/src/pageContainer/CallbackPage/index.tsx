'use client';

import { useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { useOAuthLogin } from '@repo/api/hooks';
import { memberQueryKeys } from '@repo/api/lib';
import { cn } from '@repo/utils';

import type { OAuthFlow } from '@/app/api/auth/oauth/oauthState';
import { consumeOAuthState } from '@/app/callback/actions';

interface ErrorResponse {
  message?: string;
}

interface CallbackPageProps {
  code: string | undefined;
  state: string | undefined;
}

const CallbackPage = ({ code, state }: CallbackPageProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isCalled = useRef(false);

  const handleLoginSuccess = async (flow: OAuthFlow) => {
    await queryClient.invalidateQueries({ queryKey: memberQueryKeys.getMyMemberInfo() });

    const nextUrl =
      flow === 'admin' ? `${window.location.origin}/?isAdmin=true` : window.location.origin;
    router.replace(nextUrl);
  };

  const handleLoginFailure = () => {
    router.replace('/');
    toast.error('로그인에 실패했습니다.');
  };

  const handleLoginError = (error: AxiosError) => {
    router.replace('/');
    const errorMessage = (error.response?.data as ErrorResponse)?.message;
    if (errorMessage === '학교 이메일로 가입해주세요.') {
      toast.error('테스트 기간에는 로그인할 수 없습니다.');
    } else {
      toast.error('로그인에 실패했습니다.');
    }
  };

  const { mutate: googleLogin } = useOAuthLogin('google', { onError: handleLoginError });

  const { mutate: kakaoLogin } = useOAuthLogin('kakao', { onError: handleLoginError });

  useEffect(() => {
    if (isCalled.current) return;
    isCalled.current = true;

    if (!code || !state) {
      handleLoginFailure();
      return;
    }

    // state 검증에 실패하면 로그인 요청 없이 실패 처리한다.
    consumeOAuthState(state)
      .then((result) => {
        if (!result) {
          handleLoginFailure();
          return;
        }

        const { flow, redirectUri } = result;
        const login = flow === 'kakao' ? kakaoLogin : googleLogin;
        login({ code, redirectUri }, { onSuccess: () => handleLoginSuccess(flow) });
      })
      .catch(handleLoginFailure);
  }, [code, state]);

  return (
    <div className={cn('flex', 'h-[calc(100vh-4.625rem)]', 'items-center', 'justify-center')}>
      <div className={cn('text-lg', 'font-medium')}>로그인 처리 중...</div>
    </div>
  );
};

export default CallbackPage;
