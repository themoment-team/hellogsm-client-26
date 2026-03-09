'use client';

import { useEffect, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import type { AxiosError } from 'axios';

import { memberQueryKeys, useOAuthLogin } from 'api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { cn } from 'shared/lib/utils';

interface ErrorResponse {
  message?: string;
}

const CallbackPage = ({ code, provider }: { code: string; provider: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isCalled = useRef(false);

  const handleLoginSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: memberQueryKeys.getMyMemberInfo() });

    const currentOrigin = window.location.origin;
    const isStage = currentOrigin.includes('stage');
    const clientBaseUrl = isStage ? 'https://www.stage.hellogsm.kr' : 'https://www.hellogsm.kr';
    const nextUrl = provider === 'admin' ? `${clientBaseUrl}/?isAdmin=true` : clientBaseUrl;
    router.replace(nextUrl);
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

  const { mutate: googleLogin } = useOAuthLogin('google', {
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  });

  const { mutate: kakaoLogin } = useOAuthLogin('kakao', {
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  });

  useEffect(() => {
    if (isCalled.current) return;
    isCalled.current = true;

    if (!code || !provider) {
      router.replace('/');
      toast.error('로그인에 실패했습니다.');
      return;
    }

    if (provider === 'google' || provider === 'admin') {
      googleLogin(code);
    } else if (provider === 'kakao') {
      kakaoLogin(code);
    } else {
      router.replace('/');
      toast.error('로그인에 실패했습니다.');
    }
  }, [code, provider]);

  return (
    <div className={cn('flex', 'h-[calc(100vh-4.625rem)]', 'items-center', 'justify-center')}>
      <div className={cn('text-lg', 'font-medium')}>로그인 처리 중...</div>
    </div>
  );
};

export default CallbackPage;
