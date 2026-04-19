import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { oneseoQueryKeys, oneseoUrl, patch } from '../../libs';

export const usePatchOneseoApproval = (
  memberId: number,
  options?: UseMutationOptions<unknown, AxiosError>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.patchOneseoApproval(memberId),
    mutationFn: () => patch(oneseoUrl.patchOneseoApproval(memberId)),
    ...options,
  });
