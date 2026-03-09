import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { memberUrl, post } from '@repo/api/lib';

import { memberQueryKeys } from '@/lib';

interface ReturnDataType {
  status: string;
  code: number;
  message: string;
}

interface VerifyCodeType {
  code: string;
}

export const useVerifyCode = (
  options?: UseMutationOptions<ReturnDataType, AxiosError, VerifyCodeType>,
) =>
  useMutation({
    mutationKey: memberQueryKeys.postCode(),
    mutationFn: (code: VerifyCodeType) => post<ReturnDataType>(memberUrl.postVerifyCode(), code),
    ...options,
  });
