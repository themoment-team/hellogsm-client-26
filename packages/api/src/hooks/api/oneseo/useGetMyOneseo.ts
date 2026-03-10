import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { GetMyOneseoType } from 'types';

import { minutesToMs } from 'shared/utils';

import { get, oneseoQueryKeys, oneseoUrl } from 'api/libs';

export const useGetMyOneseo = (options?: Omit<UseQueryOptions<GetMyOneseoType>, 'queryKey'>) =>
  useQuery({
    queryKey: oneseoQueryKeys.getMyOneseo(),
    queryFn: () => get<GetMyOneseoType>(oneseoUrl.getMyOneseo()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
