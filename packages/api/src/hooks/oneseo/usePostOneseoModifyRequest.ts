import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { oneseoQueryKeys, oneseoUrl, post } from '../../libs';

export const usePostOneseoModifyRequest = (
  options?: UseMutationOptions<unknown, AxiosError, void>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.postOneseoModifyRequest(),
    mutationFn: () => post(oneseoUrl.postOneseoModifyRequest(), {}),
    ...options,
  });
