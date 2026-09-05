import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import {
  SchoolRecordExtractionRequestType,
  SchoolRecordExtractionResponseType,
} from '@repo/types';

import { oneseoQueryKeys, oneseoUrl, post } from '../../libs';

export const usePostSchoolRecordExtraction = (
  options?: UseMutationOptions<
    SchoolRecordExtractionResponseType,
    AxiosError,
    SchoolRecordExtractionRequestType
  >,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.postSchoolRecordExtraction(),
    mutationFn: (data) =>
      post<SchoolRecordExtractionResponseType>(oneseoUrl.postSchoolRecordExtraction(), data),
    ...options,
  });
