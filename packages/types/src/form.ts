import { step1Schema, step2Schema, step3Schema, step4Schema } from 'shared';
import { z } from 'zod';

export type Step1FormType = z.infer<typeof step1Schema>;

export type Step2FormType = z.infer<typeof step2Schema>;

export type Step3FormType = z.infer<typeof step3Schema>;

export type Step4FormType = z.infer<typeof step4Schema>;
