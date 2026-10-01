import {
  AchievementFieldType,
  ACHIEVEMENT_FIELD_LIST,
  getUsedAchievementFields,
} from '@repo/constants';
import {
  FreeSemesterValueEnum,
  GraduationTypeValueEnum,
  LiberalSystemValueEnum,
  SchoolRecordExtractionAchievementType,
} from '@repo/types';

interface MapOcrAchievementFieldsContext {
  liberalSystem: LiberalSystemValueEnum | null;
  graduationType: GraduationTypeValueEnum;
  freeSemester: FreeSemesterValueEnum | null;
}

/**
 * handleApplyOcrAchievement가 achievement1_1~3_2에 setValue할 값을 계산하는 부분만
 * 떼어낸 순수 함수. OCR 결과는 이번 전형에서 쓰지 않는 학기까지 값을 채워 보낼 수 있어
 * (예: 자유학년제 1학년이 P(이수)를 0('없음')으로 내려옴), 여기서 먼저 걸러낸다.
 * setValue/getValues 등 RHF 호출은 이 함수를 쓰는 쪽(handleApplyOcrAchievement)에 남는다.
 */
export const mapOcrAchievementFields = (
  achievement: SchoolRecordExtractionAchievementType,
  context: MapOcrAchievementFieldsContext,
): Record<AchievementFieldType, SchoolRecordExtractionAchievementType[AchievementFieldType]> => {
  const usedAchievementFields = getUsedAchievementFields(context);

  return Object.fromEntries(
    ACHIEVEMENT_FIELD_LIST.map((field) => [
      field,
      usedAchievementFields.includes(field) ? (achievement[field] ?? null) : null,
    ]),
  ) as Record<AchievementFieldType, SchoolRecordExtractionAchievementType[AchievementFieldType]>;
};
