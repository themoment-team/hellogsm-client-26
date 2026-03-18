import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { PostOneseoType } from '@repo/types';

import { oneseoQueryKeys, oneseoUrl, put } from '../../libs';

export const usePutOneseoByMemberId = (
  memberId: number,
  options?: UseMutationOptions<unknown, AxiosError, PostOneseoType>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.putOneseoByMemberId(memberId),
    mutationFn: (data: PostOneseoType) => put(oneseoUrl.putOneseoByMemberId(memberId), data),
    ...options,
  });
