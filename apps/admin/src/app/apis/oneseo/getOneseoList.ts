import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { OneseoListType } from 'types';

import { oneseoUrl } from 'api/libs';

const DEFAULT_LIST_SIZE = 10;
const DEFAULT_TEST_RESULT_TAG = 'ALL';

interface GetOneseoListParams {
  redirectUrl: string;
}

/**
 * 초기 원서 리스트를 가져옵니다.
 *
 * @returns 초기 리스트를 반환합니다. 리스트가 없다면 로그인 페이지로 리다이렉트 합니다.
 */
export const getOneseoList = async ({
  redirectUrl,
}: GetOneseoListParams): Promise<OneseoListType | undefined> => {
  const session = cookies().get('SESSION')?.value;

  const response = await fetch(
    new URL(
      `${oneseoUrl.getSearchedOneseoList(0, DEFAULT_LIST_SIZE, DEFAULT_TEST_RESULT_TAG)}`,
      process.env.NEXT_PUBLIC_API_BASE_URL,
    ),
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `SESSION=${session}`,
      },
    },
  );

  const oneseoList = await response.json();

  const isNotFound = response.status === 404;

  if (isNotFound) {
    return undefined;
  }

  if (!response.ok) {
    return redirect(redirectUrl);
  }

  return oneseoList.data;
};
