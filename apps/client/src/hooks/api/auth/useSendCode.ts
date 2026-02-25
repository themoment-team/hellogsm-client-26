import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { memberUrl, post } from '@repo/api/lib';
import { SendCodeType } from '@repo/types';

import { memberQueryKeys } from '@/lib';

interface ReturnDataType {
  status: string;
  code: number;
  message: string;
}

export const useSendCode = (
  options?: UseMutationOptions<ReturnDataType, AxiosError, SendCodeType>,
) =>
  useMutation({
    mutationKey: memberQueryKeys.postPhoneNumber(),
    mutationFn: (phoneNumber: SendCodeType) =>
      post<ReturnDataType>(memberUrl.postSendCode(), phoneNumber),
    ...options,
  });
