import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { PostOneseoType } from 'types';

import { oneseoQueryKeys, oneseoUrl, put } from 'api/libs';

export const usePutOneseoByMemberId = (
  memberId: number,
  options?: UseMutationOptions<unknown, AxiosError, PostOneseoType>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.putOneseoByMemberId(memberId),
    mutationFn: (data: PostOneseoType) => put(oneseoUrl.putOneseoByMemberId(memberId), data),
    ...options,
  });
