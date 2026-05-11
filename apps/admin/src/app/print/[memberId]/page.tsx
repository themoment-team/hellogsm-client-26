import { redirect } from 'next/navigation';

import { ApplicationPrintPage } from '@repo/ui/components';

import { getOneseoByMemberId } from '@/app/apis';

interface PrintProps {
  params: { memberId: string };
}

export default async function Print({ params: { memberId } }: PrintProps) {
  const id = Number(memberId);

  if (Number.isNaN(id)) redirect('/');

  const data = await getOneseoByMemberId(id);

  return <ApplicationPrintPage oneseo={data} />;
}
