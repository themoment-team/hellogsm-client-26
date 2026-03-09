import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { OperationType } from 'types';

import { minutesToMs } from 'shared/utils';

import { get, operationQueryKeys, operationUrl } from 'api/libs';

export const useGetOperation = (options?: Omit<UseQueryOptions<OperationType>, 'queryKey'>) =>
  useQuery({
    queryKey: operationQueryKeys.getOperation(),
    queryFn: () => get<OperationType>(operationUrl.getOperation()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
