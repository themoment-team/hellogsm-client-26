import { redirect } from 'next/navigation';

import { MainPage } from '@/pageContainer';
import { getIsServerHealthy } from '@/utils';

import AdminRedirect from './AdminRedirect';
import {
  getMyAuthInfo,
  getMyFirstTestResult,
  getMyMemberInfo,
  getMySecondTestResult,
} from './apis';

export default async function Home({ searchParams }: { searchParams?: { isAdmin?: string } }) {
  const [memberInfo, authInfo, firstResultInfo, secondResultInfo, isServerHealthy] =
    await Promise.all([
      getMyMemberInfo('/'),
      getMyAuthInfo('/'),
      getMyFirstTestResult(),
      getMySecondTestResult(),
      getIsServerHealthy(),
    ]);

  const isAdminRequested = searchParams?.isAdmin === 'true';
  const isAdminRole = authInfo?.role === 'ADMIN' || authInfo?.role === 'ROOT';

  if (isAdminRequested && isAdminRole) {
    return <AdminRedirect />;
  }

  if (authInfo?.authReferrerType && !memberInfo?.name) {
    redirect('/signup');
  }

  const resultInfo = {
    firstTestPassYn: firstResultInfo?.firstTestPassYn ?? null,
    secondTestPassYn: secondResultInfo?.secondTestPassYn ?? null,
    decidedMajor: secondResultInfo?.decidedMajor ?? null,
  };

  return (
    <MainPage memberInfo={memberInfo} resultInfo={resultInfo} isServerHealthy={isServerHealthy} />
  );
}
