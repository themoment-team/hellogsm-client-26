import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { TicketType } from 'types';

import { minutesToMs } from 'shared/utils';

import { get, oneseoQueryKeys, oneseoUrl } from 'api/libs';

export const useGetAdmissionTickets = (options?: Omit<UseQueryOptions<TicketType[]>, 'queryKey'>) =>
  useQuery({
    queryKey: oneseoQueryKeys.getAdmissionTickets(),
    queryFn: () => get<TicketType[]>(oneseoUrl.getAdmissionTickets()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
