import { redirect } from 'next/navigation';

import { PrintPage } from '@/pageContainer';

import { getMyOneseo } from '../apis';

export default async function Home() {
  const data = await getMyOneseo();

  if (!data) redirect('/');

  return <PrintPage initialData={data} />;
}
