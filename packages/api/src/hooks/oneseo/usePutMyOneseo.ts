import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { PutOneseoType } from '@repo/types';

import { oneseoQueryKeys, oneseoUrl, put } from '../../libs';

export const usePutMyOneseo = (
  options?: UseMutationOptions<unknown, AxiosError, PutOneseoType>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.putMyOneseo(),
    mutationFn: (data: PutOneseoType) => put(oneseoUrl.putMyOneseo(), data),
    ...options,
  });
