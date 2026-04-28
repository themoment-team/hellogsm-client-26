import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { PreviewOneseoType } from '@repo/types';
import { minutesToMs } from '@repo/utils';

import { get, oneseoQueryKeys, oneseoUrl } from '../../libs';

export const useGetMyOneseoPreview = (
  options?: Omit<UseQueryOptions<PreviewOneseoType>, 'queryKey'>,
) =>
  useQuery({
    queryKey: oneseoQueryKeys.getMyOneseo(true),
    queryFn: () => get<PreviewOneseoType>(oneseoUrl.getMyOneseo(true)),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
