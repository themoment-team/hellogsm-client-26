import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { oneseoQueryKeys, oneseoUrl, post } from 'api/libs';

interface ResponseType {
  url: string;
}

export const usePostImage = (options?: UseMutationOptions<ResponseType, AxiosError, FormData>) =>
  useMutation({
    mutationKey: oneseoQueryKeys.postImage(),
    mutationFn: (data) =>
      post<ResponseType>(oneseoUrl.postImage(), data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    ...options,
  });
