import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { PatchPersonalInfoType } from '@repo/types';

import { oneseoQueryKeys, oneseoUrl, patch } from '../../libs';

export const usePatchPersonalInfo = (
  options?: UseMutationOptions<unknown, AxiosError, PatchPersonalInfoType>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.patchPersonalInfo(),
    mutationFn: (data) => patch(oneseoUrl.patchPersonalInfo(), data),
    ...options,
  });
