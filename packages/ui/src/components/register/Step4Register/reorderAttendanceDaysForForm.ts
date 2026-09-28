import { SchoolRecordExtractionAchievementType } from '@repo/types';

/**
 * 서버(MiddleSchoolRecordParser)가 내려주는 attendanceDays는 학년 단위로 묶여 있다
 * (index = (학년-1)*3 + [지각,조퇴,결과]). 그런데 이 폼(NonSubjectForm)과 제출된
 * 원서를 보여주는 ApplicationPrintPage/ExtracurricularTable은 항목 단위로 묶은
 * 배열을 쓴다(지각 3칸이 [0,1,2], 조퇴가 [3,4,5], 결과가 [6,7,8]). 이 둘을 그대로
 * 이어붙이면 학년2의 지각 자리에 학년1의 조퇴 값이 들어가는 식으로 값이 뒤섞인다.
 * 그래서 서버 배열을 폼이 기대하는 순서로 재배열한다.
 */
export const reorderAttendanceDaysForForm = (
  serverAttendanceDays: SchoolRecordExtractionAchievementType['attendanceDays'],
): SchoolRecordExtractionAchievementType['attendanceDays'] => {
  if (!serverAttendanceDays) return serverAttendanceDays;
  const reordered: (number | null)[] = new Array(9).fill(null);
  for (let grade = 1; grade <= 3; grade += 1) {
    for (let typeOffset = 0; typeOffset < 3; typeOffset += 1) {
      const serverIndex = (grade - 1) * 3 + typeOffset;
      const formIndex = typeOffset * 3 + (grade - 1);
      reordered[formIndex] = serverAttendanceDays[serverIndex] ?? null;
    }
  }
  return reordered;
};
