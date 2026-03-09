import { dateUrl } from 'api/libs';

import type { DateType } from 'types';

/**
 * 접근을 막는 특정 날짜를 가져옵니다
 *
 * @returns 특적 날짜들을 반환합니다
 */
export const getDate = async (): Promise<DateType | undefined> => {
  try {
    const response = await fetch(new URL(dateUrl.getDate(), process.env.NEXT_PUBLIC_API_BASE_URL), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const dateList = await response.json();

    return dateList.data;
  } catch {
    return undefined;
  }
};
