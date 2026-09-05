import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { SchoolRecordOcrRequestType, SchoolRecordOcrResponseType } from '@repo/types';

import { oneseoQueryKeys, oneseoUrl, post } from '../../libs';

export const usePostSchoolRecordOcr = (
  options?: UseMutationOptions<SchoolRecordOcrResponseType, AxiosError, SchoolRecordOcrRequestType>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.postSchoolRecordOcr(),
    mutationFn: (data) => post<SchoolRecordOcrResponseType>(oneseoUrl.postSchoolRecordOcr(), data),
    ...options,
  });
