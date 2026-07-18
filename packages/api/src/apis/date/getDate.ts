/// <reference types="next" />
import { DateType } from '@repo/types';

import { dateUrl } from '../../libs';

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
      // 전형 일정은 공개 데이터라 캐싱하되, 접수 마감·발표 시각 판별에 쓰이므로 60초로 짧게 재검증
      next: { revalidate: 60 },
    });

    const dateList = await response.json();

    return dateList.data;
  } catch {
    return undefined;
  }
};
