import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { memberUrl, post } from '@repo/api/lib';
import { MemberRegisterType } from '@repo/types';

import { memberQueryKeys } from '@/lib';

export const usePostMemberRegister = (
  options?: UseMutationOptions<unknown, AxiosError, MemberRegisterType, unknown>,
) =>
  useMutation({
    mutationKey: memberQueryKeys.postMember(),
    mutationFn: (mentorInfo: MemberRegisterType) =>
      post(memberUrl.postMemberRegister(), mentorInfo),
    ...options,
  });
