import { z } from 'zod';

export const step1Schema = z.object({
  profileImg: z.string().min(1),
  name: z.string().min(1),
  birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sex: z.enum(['MALE', 'FEMALE']),
  address: z.string().min(1),
  detailAddress: z.string().min(1),
});
