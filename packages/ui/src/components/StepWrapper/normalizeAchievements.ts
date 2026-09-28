import { AchievementFieldType, getUsedAchievementFields } from '@repo/constants';
import { GraduationTypeValueEnum, Step4FormType } from '@repo/types';

/**
 * 이번 전형에서 쓰지 않는 학기에 값이 남아 있으면 서버로 나가기 직전에 null로 지운다.
 *
 * 학기 열을 비우는 초기화는 입력 폼(FreeGradeForm/FreeSemesterForm)의 mount 시 한 번만
 * 돌기 때문에, 그 뒤에 값을 집어넣는 경로(생기부 OCR 자동입력)를 막지 못한다. 실제로
 * 자유학년제 졸업자가 OCR을 쓰면 1-1·1-2가 0('없음')으로 채워진 채 제출돼 성적 계산이
 * 틀어졌다. 입력 경로마다 막는 것과 별개로, 페이로드를 만드는 이 마지막 지점에서 한 번
 * 더 거른다.
 *
 * 아직 입력이 시작되지 않은 학기(undefined)는 undefined 그대로 둔다 — step 1~3 임시저장은
 * step 4 값이 전부 비어 있는 채로 나가는데, 이걸 null로 바꾸면 그동안 서버가 받아 오던
 * payload 모양이 달라진다.
 */
export const normalizeAchievements = (
  values: Step4FormType,
  graduationType: GraduationTypeValueEnum,
): Record<AchievementFieldType, number[] | null | undefined> => {
  const usedFields = getUsedAchievementFields({
    liberalSystem: values.liberalSystem,
    graduationType,
    freeSemester: values.freeSemester,
  });

  const normalize = (field: AchievementFieldType) => {
    // 스키마상 number[] | null이지만, 아직 기본값이 채워지지 않은 학기는 런타임에 undefined다
    const value = values[field] as number[] | null | undefined;
    if (value === undefined || usedFields.includes(field)) return value;
    return null;
  };

  return {
    achievement1_1: normalize('achievement1_1'),
    achievement1_2: normalize('achievement1_2'),
    achievement2_1: normalize('achievement2_1'),
    achievement2_2: normalize('achievement2_2'),
    achievement3_1: normalize('achievement3_1'),
    achievement3_2: normalize('achievement3_2'),
  };
};
