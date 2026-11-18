import { oneseoUrl } from '@repo/api/lib';
import { EditabilityType } from '@repo/types';

import { fetchWithSession } from '../fetchWithSession';

export const getEditability = async (): Promise<EditabilityType | undefined> => {
  const response = await fetchWithSession(oneseoUrl.getEditability());

  if (!response || response.status === 404 || !response.ok) return undefined;

  try {
    const data = await response.json();

    return data.data;
  } catch {
    return undefined;
  }
};
