import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { PatchPersonalInfoType } from '@repo/types';

import { oneseoQueryKeys, oneseoUrl, patch } from '../../libs';

export const usePatchPersonalInfoByMemberId = (
  memberId: number,
  options?: UseMutationOptions<unknown, AxiosError, PatchPersonalInfoType>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.patchPersonalInfoByMemberId(memberId),
    mutationFn: (data) => patch(oneseoUrl.patchPersonalInfoByMemberId(memberId), data),
    ...options,
  });
