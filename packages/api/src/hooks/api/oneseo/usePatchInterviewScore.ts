import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { oneseoQueryKeys, oneseoUrl, patch } from 'api/libs';

export const usePatchInterviewScore = (
  memberId: number,
  options?: UseMutationOptions<unknown, AxiosError, { interviewScore: number }>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.patchInterviewScore(memberId),
    mutationFn: (interviewScore) => patch(oneseoUrl.patchInterviewScore(memberId), interviewScore),
    ...options,
  });
