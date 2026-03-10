import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { MyMemberInfoType } from 'types';

import { minutesToMs } from 'shared/utils';

import { memberUrl, memberQueryKeys, get } from 'api/libs';

export const useGetMyMemberInfo = (
  initialData?: MyMemberInfoType | undefined,
  options?: Omit<UseQueryOptions<MyMemberInfoType | undefined>, 'queryKey'>,
) =>
  useQuery({
    queryKey: memberQueryKeys.getMyMemberInfo(),
    queryFn: () => get<MyMemberInfoType>(memberUrl.getMyMemberInfo()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
    initialData: initialData,
  });
