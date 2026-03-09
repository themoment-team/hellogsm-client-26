import { RelationshipWithGuardianValueEnum } from 'types';
import { z } from 'zod';

import { phoneNumberRegex, teacherPhoneNumberRegex } from 'shared/constants';
import { getValuesByEnum } from 'shared/utils';

export const step3Schema = z
  .object({
    guardianName: z.string().min(1),
    guardianPhoneNumber: z.string().regex(phoneNumberRegex),
    relationshipWithGuardian: z.enum(getValuesByEnum(RelationshipWithGuardianValueEnum)),
    otherRelationshipWithGuardian: z.nullable(z.string().min(1)),
    schoolTeacherName: z.nullable(z.string().min(1)),
    schoolTeacherPhoneNumber: z.nullable(z.string().regex(teacherPhoneNumberRegex)),
  })
  .refine(
    // relationshipWithGuardian의 값이 '기타'라면 otherRelationshipWithGuardian에 값이 있어야 한다는 식
    ({ relationshipWithGuardian, otherRelationshipWithGuardian }) =>
      relationshipWithGuardian !== RelationshipWithGuardianValueEnum.OTHER ||
      otherRelationshipWithGuardian,
  );
