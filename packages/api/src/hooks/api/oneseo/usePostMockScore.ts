import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import axios, { AxiosError } from 'axios';

import {
  GEDAchievementType,
  GraduationType,
  MiddleSchoolAchievementType,
  MockScoreType,
} from 'types';

import { oneseoQueryKeys } from 'api/libs';

export const usePostMockScore = (
  type: GraduationType,
  options?: UseMutationOptions<
    MockScoreType,
    AxiosError,
    MiddleSchoolAchievementType | GEDAchievementType
  >,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.postMockScore(type),
    mutationFn: async (data: MiddleSchoolAchievementType | GEDAchievementType) => {
      const response = await axios.post<MockScoreType>(
        process.env.NEXT_PUBLIC_MOCK_SCORE_URL!,
        {
          ...data,
          graduationType: type,
        },
        {
          headers: {
            'X-HG-API-KEY': process.env.NEXT_PUBLIC_MOCK_SCORE_API_KEY!,
          },
        },
      );
      return response.data;
    },
    ...options,
  });
