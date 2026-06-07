import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { authUrl, post } from '../../libs';

interface ReturnDataType {
  status: string;
  code: number;
  message: string;
}

interface LoginPayload {
  code: string;
  redirectUri: string;
}

export const useOAuthLogin = (
  provider: 'google' | 'kakao',
  options?: UseMutationOptions<ReturnDataType, AxiosError, LoginPayload>,
) =>
  useMutation({
    mutationFn: ({ code, redirectUri }: LoginPayload) =>
      post<ReturnDataType>(authUrl.postLogin(provider), { code, redirectUri }),
    ...options,
  });
