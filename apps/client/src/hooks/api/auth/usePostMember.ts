import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';

import type { AxiosError } from 'axios';

import { memberQueryKeys } from 'client/lib';

import { memberUrl, post } from 'api/libs';

import type { MemberRegisterType } from 'types';

export const usePostMemberRegister = (
  options?: UseMutationOptions<unknown, AxiosError, MemberRegisterType, unknown>,
) =>
  useMutation({
    mutationKey: memberQueryKeys.postMember(),
    mutationFn: (mentorInfo: MemberRegisterType) =>
      post(memberUrl.postMemberRegister(), mentorInfo),
    ...options,
  });
