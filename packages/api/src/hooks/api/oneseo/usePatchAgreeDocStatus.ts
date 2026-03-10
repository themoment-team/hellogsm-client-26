import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { oneseoQueryKeys, oneseoUrl, patch } from 'api/libs';

export const usePatchAgreeDocStatus = (
  memberId: number,
  options?: UseMutationOptions<unknown, AxiosError, { entranceIntentionYn: 'YES' | 'NO' }>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.patchAgreeDocStatus(memberId),
    mutationFn: (entranceIntentionYn) =>
      patch(oneseoUrl.patchAgreeDocStatus(memberId), entranceIntentionYn),
    ...options,
  });
