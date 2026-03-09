import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import type { AxiosError } from 'axios';

import { authUrl, post } from 'api/libs';

interface ReturnDataType {
  status: string;
  code: number;
  message: string;
}

export const useOAuthLogin = (
  provider: 'google' | 'kakao',
  options?: UseMutationOptions<ReturnDataType, AxiosError, string>,
) =>
  useMutation({
    mutationFn: (code: string) => post<ReturnDataType>(authUrl.postLogin(provider), { code }),
    ...options,
  });
