import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { oneseoQueryKeys, oneseoUrl, post } from 'api/libs';

export const usePostExcel = (options?: UseMutationOptions<unknown, AxiosError, FormData>) =>
  useMutation({
    mutationKey: oneseoQueryKeys.postExcel(),
    mutationFn: (formData: FormData) => {
      return post(oneseoUrl.postExcel(), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    ...options,
  });
