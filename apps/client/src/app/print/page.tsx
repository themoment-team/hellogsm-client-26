// import { redirect } from 'next/navigation';

import { redirect } from 'next/navigation';

import { getMyOneseo } from 'client/app/apis/oneseo/getMyOneseo';
import { PrintPage } from 'client/pageContainer';

export default async function Home() {
  const data = await getMyOneseo();

  if (!data) redirect('/');

  return <PrintPage initialData={data} />;
}
