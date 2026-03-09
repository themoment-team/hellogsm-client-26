/**
 * 비교 시간이 기준 시간보다 이전인지 확인합니다.
 *
 * @param baseTime 기준 시간
 * @param compareTime 비교 시간
 * @returns 비교 시간이 기준 시간보다 이전인지 여부
 */

interface IsTimeBeforeParams {
  baseTime: Date;
  compareTime: Date;
}

const isTimeBefore = ({ baseTime, compareTime }: IsTimeBeforeParams): boolean => {
  return compareTime.getTime() < baseTime.getTime();
};

export default isTimeBefore;
