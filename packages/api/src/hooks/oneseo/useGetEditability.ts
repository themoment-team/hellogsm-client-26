import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { EditabilityType } from '@repo/types';
import { minutesToMs } from '@repo/utils';

import { get, oneseoQueryKeys, oneseoUrl } from '../../libs';

export const useGetEditability = (options?: Omit<UseQueryOptions<EditabilityType>, 'queryKey'>) =>
  useQuery({
    queryKey: oneseoQueryKeys.getEditability(),
    queryFn: () => get<EditabilityType>(oneseoUrl.getEditability()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
