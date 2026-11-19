import { redirect } from 'next/navigation';

import { memberUrl } from '@repo/api/lib';
import { MyMemberInfoType } from '@repo/types';

import { fetchWithSession } from '../fetchWithSession';

/**
 * 나의 멤버 정보를 가져옵니다.
 *
 * @returns 나의 멤버 정보를 반환합니다. 없다면 -> TODO 서버 문서 업데이트 중입니다.
 */
export const getMyMemberInfo = async (
  redirectUrl: string,
): Promise<MyMemberInfoType | undefined> => {
  const response = await fetchWithSession(memberUrl.getMyMemberInfo());

  if (!response) return undefined;

  try {
    const memberInfo = await response.json();

    if (!response.ok) {
      return redirect(redirectUrl);
    }

    return memberInfo.data;
  } catch {
    return undefined;
  }
};
