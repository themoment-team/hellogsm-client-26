import { memberUrl } from '@repo/api/lib';
import { MyFirstTestResultType } from '@repo/types';

import { fetchWithSession } from '../fetchWithSession';

export const getMyFirstTestResult = async (): Promise<MyFirstTestResultType | undefined> => {
  const response = await fetchWithSession(memberUrl.getMyFirstTestResult());

  if (!response) return undefined;

  try {
    const memberInfo = await response.json();

    return memberInfo.data;
  } catch {
    return undefined;
  }
};
