import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { MyAuthInfoType } from 'types';

import { minutesToMs } from 'shared/utils';

import { memberUrl, memberQueryKeys, get } from 'api/libs';

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
