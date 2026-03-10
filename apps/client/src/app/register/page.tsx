import { redirect } from 'next/navigation';

import { getDate } from '@repo/api/apis';
import { StepEnum } from '@repo/types';
import { getKoreanDate, isTimeAfter, isTimeBefore } from '@repo/utils';

import { RegisterStepsPage } from '@/pageContainer';

import { getMyMemberInfo, getMyOneseo } from '../apis';

interface RegisterProps {
  searchParams?: { [key: string]: string | undefined };
}

export default async function Register({ searchParams }: RegisterProps) {
  const step = searchParams?.step;

  const [data, info, dateList] = await Promise.all([
    getMyOneseo(),
    getMyMemberInfo('/'),
    getDate(),
  ]);

  const currentTime = getKoreanDate();
  const isOneseoWrite =
    !!dateList?.oneseoSubmissionStart &&
    !!dateList?.oneseoSubmissionEnd &&
    isTimeAfter({
      baseTime: new Date(dateList.oneseoSubmissionStart),
      compareTime: currentTime,
    }) &&
    isTimeBefore({ baseTime: new Date(dateList.oneseoSubmissionEnd), compareTime: currentTime });

  if (!info || (data && !data.step) || !isOneseoWrite) redirect('/');

  if (!step || !['1', '2', '3', '4'].includes(step)) redirect('/register?step=1');

  return <RegisterStepsPage data={data} info={info} step={step as StepEnum} />;
}
