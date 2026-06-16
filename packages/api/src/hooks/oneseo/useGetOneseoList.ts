import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { OneseoListType } from '@repo/types';
import { minutesToMs } from '@repo/utils';

import { get, oneseoQueryKeys, oneseoUrl } from '../../libs';

interface UseGetOneseoListParams {
  page: number;
  size: number;
  testResultTag: string;
  screeningTag?: string;
  isSubmitted?: string;
  keyword?: string;
  status?: string;
}

export const useGetOneseoList = (
  { page, size, testResultTag, screeningTag, isSubmitted, keyword, status }: UseGetOneseoListParams,
  options?: Omit<UseQueryOptions<OneseoListType>, 'queryKey'>,
) =>
  useQuery({
    queryKey: oneseoQueryKeys.getSearchedOneseoList(
      page,
      size,
      testResultTag,
      screeningTag,
      isSubmitted,
      keyword,
      status,
    ),
    queryFn: () =>
      get<OneseoListType>(
        oneseoUrl.getSearchedOneseoList(
          page,
          size,
          testResultTag,
          screeningTag,
          isSubmitted,
          keyword,
          status,
        ),
      ),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
