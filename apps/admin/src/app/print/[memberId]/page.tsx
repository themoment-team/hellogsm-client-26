import { redirect } from 'next/navigation';

import { ApplicationPrintPage } from '@repo/ui/components';

import { getOneseoByMemberId } from '@/app/apis';

interface PrintProps {
  params: Promise<{ memberId: string }>;
}

export default async function Print(props: PrintProps) {
  const params = await props.params;

  const {
    memberId
  } = params;

  const id = Number(memberId);

  if (Number.isNaN(id)) redirect('/');

  const data = await getOneseoByMemberId(id);

  return <ApplicationPrintPage oneseo={data} />;
}
