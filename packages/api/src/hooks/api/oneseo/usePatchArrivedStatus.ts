import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { oneseoQueryKeys, oneseoUrl, patch } from 'api/libs';

export const usePatchArrivedStatus = (
  memberId: number,
  options?: UseMutationOptions<unknown, AxiosError>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.patchArrivedStatus(memberId),
    mutationFn: () => patch(oneseoUrl.patchArrivedStatus(memberId)),
    ...options,
  });
