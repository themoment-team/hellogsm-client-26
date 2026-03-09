import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { minutesToMs } from 'shared';

import { get, exampleQueryKeys, exampleUrl } from 'api/libs';

interface ExampleDataType {
  id: string;
  data: string;
}

export const useGetMyMenteeInfo = (options?: Omit<UseQueryOptions<ExampleDataType>, 'queryKey'>) =>
  useQuery({
    queryKey: exampleQueryKeys.getExampleData(),
    queryFn: () => get<ExampleDataType>(exampleUrl.getExampleData()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
