import { z } from 'zod';

export const birthSchema = z.object({
  year: z
    .string()
    .regex(/^\d{4}$/, { message: '유효한 연도를 선택해주세요.' })
    .min(1, { message: '연도를 선택해주세요.' }),
  month: z
    .string()
    .regex(/^\d{1,2}$/, { message: '유효한 월을 선택해주세요.' })
    .min(1, { message: '월을 선택해주세요.' }),
  day: z
    .string()
    .regex(/^\d{1,2}$/, { message: '유효한 일을 선택해주세요.' })
    .min(1, { message: '일을 선택해주세요.' }),
});
