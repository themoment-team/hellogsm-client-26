import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { minutesToMs } from '@repo/utils';

import { exampleQueryKeys, exampleUrl, get } from '../libs';

interface ExampleDataType {
  id: string;
  data: string;
}

export const useGetExampleData = (options?: Omit<UseQueryOptions<ExampleDataType>, 'queryKey'>) =>
  useQuery({
    queryKey: exampleQueryKeys.getExampleData(),
    queryFn: () => get<ExampleDataType>(exampleUrl.getExampleData()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
