import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { MySecondTestResultType } from 'types';

import { minutesToMs } from 'shared/utils';

import { get, memberQueryKeys, memberUrl } from 'api/libs';

export const useGetMySecondTestResultInfo = (
  options?: Omit<UseQueryOptions<MySecondTestResultType>, 'queryKey'>,
) =>
  useQuery({
    queryKey: memberQueryKeys.getMySecondTestResultInfo(),
    queryFn: () => get<MySecondTestResultType>(memberUrl.getMySecondTestResult()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
