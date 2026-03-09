import { DesireMajorValueEnum, GraduationTypeValueEnum, ScreeningValueEnum } from 'types';
import { z } from 'zod';

import { getValuesByEnum } from 'shared/utils';

export const step2Schema = z.object({
  graduationType: z.enum(getValuesByEnum(GraduationTypeValueEnum)),
  schoolName: z.nullable(z.string().min(1)),
  schoolAddress: z.nullable(z.string().min(1)),
  studentNumber: z.nullable(
    z
      .string()
      .length(5)
      .refine((val) => /^\d{5}$/.test(val)),
  ),
  classroom: z.string().optional(),
  number: z.string().optional(),
  graduationDate: z
    .string()
    .refine((date) => date.split('-')[0] !== '0000' && date.split('-')[1] !== '00'),
  screening: z.enum(getValuesByEnum(ScreeningValueEnum)),
  firstDesiredMajor: z.enum(getValuesByEnum(DesireMajorValueEnum)),
  secondDesiredMajor: z.enum(getValuesByEnum(DesireMajorValueEnum)),
  thirdDesiredMajor: z.enum(getValuesByEnum(DesireMajorValueEnum)),
});
