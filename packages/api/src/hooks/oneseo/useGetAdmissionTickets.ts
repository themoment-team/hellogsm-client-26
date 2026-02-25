import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { TicketType } from '@repo/types';
import { minutesToMs } from '@repo/utils';

import { get, oneseoQueryKeys, oneseoUrl } from '../../libs';

export const useGetAdmissionTickets = (options?: Omit<UseQueryOptions<TicketType[]>, 'queryKey'>) =>
  useQuery({
    queryKey: oneseoQueryKeys.getAdmissionTickets(),
    queryFn: () => get<TicketType[]>(oneseoUrl.getAdmissionTickets()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
