import { PrintPage } from '@/pageContainer';

import { getMyOneseo, getMyOneseoPreview } from '../apis';

interface PrintPageProps {
  searchParams: { preview?: string };
}

export default async function Home({ searchParams }: PrintPageProps) {
  const isPreview = searchParams.preview === 'true';
  const data = isPreview ? await getMyOneseoPreview() : await getMyOneseo();

  return <PrintPage initialData={data} isPreview={isPreview} />;
}