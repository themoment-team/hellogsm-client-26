import { redirect } from 'next/navigation';
import { ComputerRecommendedPage, StepWrapper } from 'shared';
import { StepEnum } from 'types';

import { getOneseoByMemberId } from 'admin/app/apis/oneseo/getOneseoById';

interface EditProps {
  params: { memberId: string };
  searchParams?: { [key: string]: string | undefined };
}

export default async function Edit({ params: { memberId }, searchParams }: EditProps) {
  const step = searchParams?.step;
  const id = Number(memberId);

  if (!step || !['1', '2', '3', '4'].includes(step)) redirect(`/register/${id}?step=1`);

  const data = await getOneseoByMemberId(id);

  return (
    <>
      <ComputerRecommendedPage type="admin" />
      <StepWrapper data={data} type="admin" step={step as StepEnum} memberId={id} />
    </>
  );
}
