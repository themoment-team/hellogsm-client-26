import { FreeSemesterValueEnum, LiberalSystemValueEnum } from 'types';
import { z } from 'zod';

import {
  ARTS_PHYSICAL_SUBJECTS,
  GED_MAX_SCORE,
  GED_MIN_SCORE,
  GENERAL_SUBJECTS,
  MAX_SCORE,
  MIN_SCORE,
} from 'shared/constants';
import { getValuesByEnum } from 'shared/utils';

const FORBIDDEN_SUBJECTS: string[] = [...ARTS_PHYSICAL_SUBJECTS, ...GENERAL_SUBJECTS];

const achievementSchema = (minLength: number) =>
  z.nullable(
    z.array(z.number().refine((value) => MAX_SCORE >= value && value >= MIN_SCORE)).min(minLength),
  );

const nonSubjectSchema = z.nullable(
  z.array(z.number().refine((value) => !isNaN(value) && value >= 0)),
);

export const step4Schema = z
  .object({
    liberalSystem: z.nullable(z.enum(getValuesByEnum(LiberalSystemValueEnum))),
    achievement1_1: achievementSchema(GENERAL_SUBJECTS.length),
    achievement1_2: achievementSchema(GENERAL_SUBJECTS.length),
    achievement2_1: achievementSchema(GENERAL_SUBJECTS.length),
    achievement2_2: achievementSchema(GENERAL_SUBJECTS.length),
    achievement3_1: achievementSchema(GENERAL_SUBJECTS.length),
    achievement3_2: achievementSchema(GENERAL_SUBJECTS.length),
    newSubjects: z.optional(
      z
        .array(
          z
            .string()
            .transform((val) => val.trim())
            .refine((val) => val.length > 0, {
              message: '과목명을 입력해주세요.',
            })
            .refine((item) => !FORBIDDEN_SUBJECTS.includes(item), {
              message: '기본 과목이 작성되어 있습니다.',
            }),
        )
        .superRefine((items, ctx) => {
          const valueToIndexesMap = new Map<string, number[]>();

          items.forEach((value, index) => {
            const indexes = valueToIndexesMap.get(value) || [];
            indexes.push(index);
            valueToIndexesMap.set(value, indexes);
          });

          valueToIndexesMap.forEach((indexes) => {
            if (indexes.length <= 1) return;
            const duplicateIndexesExcludingFirst = indexes.slice(1);
            duplicateIndexesExcludingFirst.forEach((dupIndex) => {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [dupIndex],
                message: '과목이 중복되어 작성되어 있습니다.',
              });
            });
          });
        }),
    ),
    artsPhysicalAchievement: achievementSchema(ARTS_PHYSICAL_SUBJECTS.length * 3),
    absentDays: nonSubjectSchema,
    attendanceDays: nonSubjectSchema,
    volunteerTime: nonSubjectSchema,
    freeSemester: z.nullable(z.enum(getValuesByEnum(FreeSemesterValueEnum))),
    gedAvgScore: z.nullable(
      z
        .number()
        .refine((value) => !isNaN(value) && value <= GED_MAX_SCORE && value >= GED_MIN_SCORE),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.liberalSystem === LiberalSystemValueEnum.FREE_SEMESTER) {
      const hasAchievement11 =
        data.achievement1_1 &&
        data.achievement1_1.some((score) => score !== null && score !== undefined);
      const hasAchievement12 =
        data.achievement1_2 &&
        data.achievement1_2.some((score) => score !== null && score !== undefined);

      if ((hasAchievement11 || hasAchievement12) && !data.freeSemester) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['freeSemester'],
        });
      }
    }
  });
