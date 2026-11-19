import type { Metadata } from 'next';

import { getDate } from '@repo/api/apis';
import { getKoreanDate } from '@repo/utils';

import { GuidePage } from '@/pageContainer';
import { isOneseoSubmissionPeriod } from '@/utils';

import { getEditability, getMyOneseo } from '../apis';

export const metadata: Metadata = {
  title: '원서 접수',
};

export default async function Guide() {
  const [data, dateList, editability] = await Promise.all([
    getMyOneseo(),
    getDate(),
    getEditability(),
  ]);

  const isOneseoWrite = isOneseoSubmissionPeriod(dateList, getKoreanDate());

  return (
    <GuidePage initialData={data} isOneseoWrite={isOneseoWrite} initialEditability={editability} />
  );
}
