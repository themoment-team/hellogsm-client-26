import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { oneseoQueryKeys, oneseoUrl, post } from '@repo/api/lib';

export const usePostOneseoModifyRequest = (
  options?: UseMutationOptions<unknown, AxiosError, void>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.postOneseoModifyRequest(),
    mutationFn: () => post(oneseoUrl.postOneseoModifyRequest(), {}),
    ...options,
  });
