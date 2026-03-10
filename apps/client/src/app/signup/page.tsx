// import { redirect } from 'next/navigation';

import { getDate } from '@repo/api/apis';
import { getKoreanDate, isTimeAfter } from '@repo/utils';

import { SignUpPage } from '@/pageContainer';

export default async function SignUp() {
  const dateList = await getDate();

  const currentTime = getKoreanDate();
  const isPastAnnouncement =
    !!dateList?.firstResultsAnnouncement &&
    isTimeAfter({
      baseTime: new Date(dateList.firstResultsAnnouncement),
      compareTime: currentTime,
    });

  // redirect('/');
  // TODO 임시 redirect
  return <SignUpPage isPastAnnouncement={isPastAnnouncement} />;
}
