// import { redirect } from 'next/navigation';

import { getDate } from 'api';
import { getKoreanDate, isTimeAfter } from 'shared';

import { SignUpPage } from 'client/pageContainer';

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
