import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { OperationType } from '@repo/types';
import { minutesToMs } from '@repo/utils';

import { get, operationQueryKeys, operationUrl } from '../../libs';

export const useGetOperation = (options?: Omit<UseQueryOptions<OperationType>, 'queryKey'>) =>
  useQuery({
    queryKey: operationQueryKeys.getOperation(),
    queryFn: () => get<OperationType>(operationUrl.getOperation()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
