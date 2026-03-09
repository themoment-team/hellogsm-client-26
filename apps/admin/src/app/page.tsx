import { getDate } from 'api';
import { getKoreanDate, isTimeAfter } from 'shared';

import { getOneseoList } from 'admin/app/apis/oneseo/getOneseoList';
import { MainPage } from 'admin/pageContainer';

export default async function Home() {
  const [data, dateList] = await Promise.all([
    getOneseoList({ redirectUrl: '/signin' }),
    getDate(),
  ]);

  const currentTime = getKoreanDate();

  const isAfterFirstResults =
    !!dateList?.firstResultsAnnouncement &&
    isTimeAfter({
      baseTime: new Date(dateList.firstResultsAnnouncement),
      compareTime: currentTime,
    });

  const isAfterSecondResults =
    !!dateList?.finalResultsAnnouncement &&
    isTimeAfter({
      baseTime: new Date(dateList.finalResultsAnnouncement),
      compareTime: currentTime,
    });

  const is역량검사처리기간 =
    !!dateList?.competencyEvaluation &&
    isTimeAfter({
      baseTime: new Date(dateList.competencyEvaluation),
      compareTime: currentTime,
    });

  const is심층면접처리기간 =
    !!dateList?.inDepthInterview &&
    isTimeAfter({
      baseTime: new Date(dateList.inDepthInterview),
      compareTime: currentTime,
    });

  return (
    <MainPage
      initialData={data}
      isAfterFirstResults={isAfterFirstResults}
      isAfterSecondResults={isAfterSecondResults}
      is역량검사처리기간={is역량검사처리기간}
      is심층면접처리기간={is심층면접처리기간}
    />
  );
}
