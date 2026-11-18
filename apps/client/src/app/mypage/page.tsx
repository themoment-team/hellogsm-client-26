import { getDate } from '@repo/api/apis';
import { getKoreanDate } from '@repo/utils';

import { MyPage as MyPageComponent } from '@/pageContainer';
import { isOneseoSubmissionPeriod } from '@/utils';

import { getMyOneseo } from '../apis';

export default async function MyPage() {
  const [data, dateList] = await Promise.all([getMyOneseo(), getDate()]);

  const isOneseoWrite = isOneseoSubmissionPeriod(dateList, getKoreanDate());

  return <MyPageComponent isOneseoWrite={isOneseoWrite} initialData={data} />;
}
