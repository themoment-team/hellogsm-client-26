import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';

import type { AxiosError } from 'axios';

import { memberQueryKeys } from 'client/lib';

import { memberUrl, post } from 'api/libs';

import type { SendCodeType } from 'types';

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
