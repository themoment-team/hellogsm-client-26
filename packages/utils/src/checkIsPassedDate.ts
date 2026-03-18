// 현재 시각을 기점으로 targetDate가 지났는지 확인합니다.

export const checkIsPassedDate = (targetDate: Date): boolean => {
  const today = new Date();

  return today.getTime() >= targetDate.getTime();
};
