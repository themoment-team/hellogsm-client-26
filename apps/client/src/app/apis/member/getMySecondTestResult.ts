import { memberUrl } from '@repo/api/lib';
import { MySecondTestResultType } from '@repo/types';

import { fetchWithSession } from '../fetchWithSession';

export const getMySecondTestResult = async (): Promise<MySecondTestResultType | undefined> => {
  const response = await fetchWithSession(memberUrl.getMySecondTestResult());

  if (!response) return undefined;

  try {
    const memberInfo = await response.json();

    return memberInfo.data;
  } catch {
    return undefined;
  }
};
