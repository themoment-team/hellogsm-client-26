import { redirect } from 'next/navigation';

import { PrintPage } from '@/pageContainer';

import { getMyOneseo, getMyOneseoPreview } from '../apis';

interface PrintPageProps {
  searchParams: { preview?: string };
}

export default async function Home({ searchParams }: PrintPageProps) {
  const isPreview = searchParams.preview === 'true';
  const data = isPreview ? await getMyOneseoPreview() : await getMyOneseo();

  if (!data) redirect('/');

  return <PrintPage initialData={data} isPreview={isPreview} />;
}