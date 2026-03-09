import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { MyAuthInfoType } from '@repo/types';
import { minutesToMs } from '@repo/utils';

import { get, memberQueryKeys, memberUrl } from '../../libs';

export const useGetMyAuthInfo = (
  options?: Omit<UseQueryOptions<MyAuthInfoType | undefined>, 'queryKey'>,
) =>
  useQuery({
    queryKey: memberQueryKeys.getMyAuthInfo(),
    queryFn: () => get<MyAuthInfoType>(memberUrl.getMyAuthInfo()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
