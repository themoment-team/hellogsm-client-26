import type { Metadata } from 'next';

import { CalculatePage } from '@/pageContainer';

export const metadata: Metadata = {
  title: '모의 성적 계산',
};

export default async function Calculate() {
  return <CalculatePage />;
}
