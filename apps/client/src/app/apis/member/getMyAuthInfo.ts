import { redirect } from 'next/navigation';

import { memberUrl } from '@repo/api/lib';
import { MyAuthInfoType } from '@repo/types';

import { fetchWithSession } from '../fetchWithSession';

/**
 * 나의 인증 정보를 가져옵니다.
 *
 * @returns 나의 인증 정보를 반환합니다. 없다면 -> TODO 서버 문서 업데이트 중입니다.
 */
export const getMyAuthInfo = async (redirectUrl: string): Promise<MyAuthInfoType | undefined> => {
  const response = await fetchWithSession(memberUrl.getMyAuthInfo());

  if (!response) return undefined;

  try {
    const authInfo = await response.json();

    if (!response.ok) {
      return redirect(redirectUrl);
    }

    return authInfo.data;
  } catch {
    return undefined;
  }
};
