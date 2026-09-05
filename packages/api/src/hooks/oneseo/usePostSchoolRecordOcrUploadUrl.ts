import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { SchoolRecordOcrUploadUrlResponseType } from '@repo/types';

import { oneseoQueryKeys, oneseoUrl, post } from '../../libs';

export const usePostSchoolRecordOcrUploadUrl = (
  options?: UseMutationOptions<SchoolRecordOcrUploadUrlResponseType, AxiosError, string>,
) =>
  useMutation({
    mutationKey: oneseoQueryKeys.postSchoolRecordOcrUploadUrl(),
    mutationFn: (fileExtension) =>
      post<SchoolRecordOcrUploadUrlResponseType>(
        oneseoUrl.postSchoolRecordOcrUploadUrl(fileExtension),
      ),
    ...options,
  });
