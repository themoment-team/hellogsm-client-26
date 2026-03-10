import { z } from 'zod';

export const step1Schema = z.object({
  profileImg: z.string().min(1),
  address: z.string().min(1),
  detailAddress: z.string().min(1),
});
