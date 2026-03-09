import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { EditabilityType } from 'types';

import { minutesToMs } from 'shared/utils';

import { get, oneseoQueryKeys, oneseoUrl } from 'api/libs';

export const useGetEditability = (options?: Omit<UseQueryOptions<EditabilityType>, 'queryKey'>) =>
  useQuery({
    queryKey: oneseoQueryKeys.getEditability(),
    queryFn: () => get<EditabilityType>(oneseoUrl.getEditability()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
