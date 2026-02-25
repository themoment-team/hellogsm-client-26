import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { MyFirstTestResultType } from '@repo/types';
import { minutesToMs } from '@repo/utils';

import { get, memberQueryKeys, memberUrl } from '../../libs';

export const useGetMyFirstTestResultInfo = (
  options?: Omit<UseQueryOptions<MyFirstTestResultType>, 'queryKey'>,
) =>
  useQuery({
    queryKey: memberQueryKeys.getMyFirstTestResultInfo(),
    queryFn: () => get<MyFirstTestResultType>(memberUrl.getMyFirstTestResult()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
