import { AchievementValueEnum } from 'types';

export const GENERAL_SCORE_VALUES = [
  { name: 'A', value: AchievementValueEnum.A },
  { name: 'B', value: AchievementValueEnum.B },
  { name: 'C', value: AchievementValueEnum.C },
  { name: 'D', value: AchievementValueEnum.D },
  { name: 'E', value: AchievementValueEnum.E },
  { name: '없음', value: AchievementValueEnum.NONE },
] as const;

export const ART_PHYSICAL_SCORE_VALUES = [
  { name: 'A', value: AchievementValueEnum.A },
  { name: 'B', value: AchievementValueEnum.B },
  { name: 'C', value: AchievementValueEnum.C },
  { name: '없음', value: AchievementValueEnum.NONE },
] as const;

export const MAX_SCORE = 5;
export const MIN_SCORE = 0;

export const GED_MAX_SCORE = 100;
export const GED_MIN_SCORE = 60;
