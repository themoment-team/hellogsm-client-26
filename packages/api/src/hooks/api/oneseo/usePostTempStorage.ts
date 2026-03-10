import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { PostOneseoType } from 'types';

import { oneseoQueryKeys, oneseoUrl, post } from 'api/libs';

export const usePostTempStorage = (
  step: number,
  options?: UseMutationOptions<unknown, AxiosError, PostOneseoType>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.postTempStorage(),
    mutationFn: (data: PostOneseoType) => post(oneseoUrl.postTempStorage(step), data),
    ...options,
  });
