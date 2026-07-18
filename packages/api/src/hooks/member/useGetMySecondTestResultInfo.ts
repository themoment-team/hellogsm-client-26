import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { MySecondTestResultType } from '@repo/types';
import { minutesToMs } from '@repo/utils';

import { get, memberQueryKeys, memberUrl } from '../../libs';

export const useGetMySecondTestResultInfo = (
  options?: Omit<UseQueryOptions<MySecondTestResultType | null>, 'queryKey'>,
) =>
  useQuery({
    queryKey: memberQueryKeys.getMySecondTestResultInfo(),
    // 결과 미공개 시 서버가 빈 응답을 주면 undefined가 되는데, react-query는
    // queryFn의 undefined 반환을 허용하지 않으므로 null로 정규화
    queryFn: async () =>
      (await get<MySecondTestResultType>(memberUrl.getMySecondTestResult())) ?? null,
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(5),
    ...options,
  });
