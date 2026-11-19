import type { DateType } from '@repo/types';

type OneseoSubmissionDate = Pick<DateType, 'oneseoSubmissionStart' | 'oneseoSubmissionEnd'>;

/**
 * 현재가 원서 접수 기간(시작 < 현재 < 마감)인지 판별합니다.
 *
 * `/date` 응답은 백엔드의 KST `LocalDateTime`에 `'Z'`를 문자 그대로 붙인 값이라,
 * `new Date()`로 파싱하면 KST 벽시각이 UTC epoch에 담깁니다. `currentTime`도 같은 방식으로
 * KST 벽시각을 담은 `getKoreanDate()` 값을 넘겨야 두 값을 그대로 비교할 수 있습니다.
 * 시작·마감 시각을 포함하지 않는 것은 백엔드 `TimeBasedFilter`의 `isAfter(start) && isBefore(end)`와
 * 맞춘 것입니다.
 *
 * @param dateList `/date` 응답. 없거나 접수 일정이 비어 있으면 접수 기간이 아닌 것으로 봅니다.
 * @param currentTime 비교 기준 시각. 페이지에서는 `getKoreanDate()`를 넘깁니다.
 */
const isOneseoSubmissionPeriod = (
  dateList: OneseoSubmissionDate | undefined,
  currentTime: Date,
): boolean => {
  if (!dateList?.oneseoSubmissionStart || !dateList?.oneseoSubmissionEnd) return false;

  const now = currentTime.getTime();

  return (
    new Date(dateList.oneseoSubmissionStart).getTime() < now &&
    now < new Date(dateList.oneseoSubmissionEnd).getTime()
  );
};

export default isOneseoSubmissionPeriod;
