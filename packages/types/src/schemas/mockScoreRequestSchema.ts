import { z } from 'zod';

import { getValuesByEnum } from '../getValuesByEnum';
import { FreeSemesterValueEnum, GraduationTypeValueEnum, LiberalSystemValueEnum } from '../value';

/**
 * 모의 성적 계산 Route Handler(`/api/mock-score`)가 업스트림에 전달하기 전에 쓰는 최소 형식 검증.
 *
 * usePostMockScore가 보내는 본문(MiddleSchoolAchievementType | GEDAchievementType +
 * graduationType)의 필드와 타입만 확인하고, 여기 없는 필드는 제거한 뒤 전달한다. 등급 범위·배열 길이
 * 같은 계산 규칙은 업스트림(점수 계산 서비스)이 검증하므로 여기서 중복하지 않는다.
 *
 * 화면은 아직 채우지 않은 학기나 칸을 null(또는 필드 생략)로 보낼 수 있어서 배열과 배열 원소를
 * 모두 null 허용으로 둔다. 너무 엄격하게 잡으면 정상 요청이 400이 된다.
 */
const scoresSchema = z.array(z.number().nullable()).nullish();
const subjectsSchema = z.array(z.string().nullable()).nullish();

const gedMockScoreRequestSchema = z.object({
  graduationType: z.literal(GraduationTypeValueEnum.GED),
  gedAvgScore: z.number(),
});

const middleSchoolMockScoreRequestSchema = z.object({
  graduationType: z.enum([GraduationTypeValueEnum.CANDIDATE, GraduationTypeValueEnum.GRADUATE]),
  achievement1_1: scoresSchema,
  achievement1_2: scoresSchema,
  achievement2_1: scoresSchema,
  achievement2_2: scoresSchema,
  achievement3_1: scoresSchema,
  achievement3_2: scoresSchema,
  artsPhysicalAchievement: scoresSchema,
  absentDays: scoresSchema,
  attendanceDays: scoresSchema,
  volunteerTime: scoresSchema,
  generalSubjects: subjectsSchema,
  artsPhysicalSubjects: subjectsSchema,
  newSubjects: subjectsSchema,
  liberalSystem: z.enum(getValuesByEnum(LiberalSystemValueEnum)).nullish(),
  freeSemester: z.union([z.enum(getValuesByEnum(FreeSemesterValueEnum)), z.literal('')]).nullish(),
});

export const mockScoreRequestSchema = z.discriminatedUnion('graduationType', [
  gedMockScoreRequestSchema,
  middleSchoolMockScoreRequestSchema,
]);
