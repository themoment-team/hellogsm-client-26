import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { DuplicateType } from '@repo/types';
import { minutesToMs } from '@repo/utils';

import { get, memberQueryKeys, memberUrl } from '../../libs';

export const useGetDuplicateMember = (
  phoneNumber: string,
  options?: Omit<UseQueryOptions<DuplicateType>, 'queryKey'>,
) =>
  useQuery({
    queryKey: memberQueryKeys.getCheckDuplicate(phoneNumber),
    queryFn: () => get<DuplicateType>(memberUrl.getCheckDuplicate(phoneNumber)),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
