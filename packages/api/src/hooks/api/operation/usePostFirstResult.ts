import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { operationQueryKeys, operationUrl, post } from 'api/libs';

export const usePostFirstResult = (options: UseMutationOptions<unknown, AxiosError>) =>
  useMutation({
    mutationKey: operationQueryKeys.postFirstResult(),
    mutationFn: () => post(operationUrl.postFirstResult()),
    ...options,
  });
