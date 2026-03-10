/**
 * 비교 시간이 기준 시간보다 이후인지 확인합니다.
 *
 * @param baseTime 기준 시간
 * @param compareTime 비교 시간
 * @returns 비교 시간이 기준 시간보다 이후인지 여부
 */

interface IsTimeAfterParams {
  baseTime: Date;
  compareTime: Date;
}

const isTimeAfter = ({ baseTime, compareTime }: IsTimeAfterParams): boolean => {
  return compareTime.getTime() > baseTime.getTime();
};

export default isTimeAfter;
