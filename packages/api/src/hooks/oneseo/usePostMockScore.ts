import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import {
  GEDAchievementType,
  GraduationType,
  MiddleSchoolAchievementType,
  MockScoreType,
} from '@repo/types';

import { oneseoQueryKeys } from '../../libs';

const MOCK_SCORE_ROUTE_PATH = '/api/mock-score';

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
      // 같은 origin의 Route Handler(apps/*/src/app/api/mock-score)가 서버 전용 환경변수로
      // 업스트림에 전달한다. 상태 코드와 JSON 본문은 그대로 돌아온다.
      const response = await axios.post<MockScoreType>(MOCK_SCORE_ROUTE_PATH, {
        ...data,
        graduationType: type,
      });
      return response.data;
    },
    ...options,
  });
