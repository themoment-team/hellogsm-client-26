import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { oneseoQueryKeys, oneseoUrl, patch } from 'api/libs';

export const usePatchCompetencyScore = (
  memberId: number,
  options?: UseMutationOptions<unknown, AxiosError, { competencyEvaluationScore: number }>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.patchCompetencyScore(memberId),
    mutationFn: (competencyEvaluationScore) =>
      patch(oneseoUrl.patchCompetencyScore(memberId), competencyEvaluationScore),
    ...options,
  });
