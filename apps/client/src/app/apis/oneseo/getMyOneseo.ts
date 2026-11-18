import { oneseoUrl } from '@repo/api/lib';
import { GetMyOneseoType, PreviewOneseoType } from '@repo/types';

import { fetchWithSession } from '../fetchWithSession';

const fetchOneseo = async <T>(preview: boolean): Promise<T | undefined> => {
  const response = await fetchWithSession(oneseoUrl.getMyOneseo(preview));

  if (!response || response.status === 404 || !response.ok) return undefined;

  try {
    const myOneseo = await response.json();

    return myOneseo.data;
  } catch {
    return undefined;
  }
};

export const getMyOneseo = async (): Promise<GetMyOneseoType | undefined> => {
  return fetchOneseo<GetMyOneseoType>(false);
};

export const getMyOneseoPreview = async (): Promise<PreviewOneseoType | undefined> => {
  return fetchOneseo<PreviewOneseoType>(true);
};
