'use client';

import { useEffect, useState } from 'react';

import { MyMemberInfoType, MyTotalTestResultType } from '@repo/types';

import {
  Footer,
  LoginNoticeDialog,
  PassResultDialog,
  Section1,
  Section2,
  Section3,
  Section4,
  Section5,
  TestResultDialog,
} from '@/components';

import DevNoticeDialog from './DevNoticeDialog';
import TestPeriodDialog from './TestPeriodDialog';

interface MainPageProps {
  memberInfo: MyMemberInfoType | undefined;
  resultInfo: MyTotalTestResultType | undefined;
  isServerHealthy: boolean;
}

const MainPage = ({ memberInfo, resultInfo, isServerHealthy }: MainPageProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPassOpen, setIsPassOpen] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date().toDateString();
    // localStorage는 클라이언트 전용 값 — 서버 렌더와의 hydration 불일치를 막기 위해
    // 마운트 후 effect에서 반영해야 함 (렌더 중 계산 불가)
    const hideDialog = localStorage.getItem('hideTestResultDialog');

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(hideDialog !== today && !!resultInfo && resultInfo.firstTestPassYn !== null);
  }, []);

  const isFinishFirstTest = resultInfo?.secondTestPassYn === null ? true : false;

  return (
    <>
      <LoginNoticeDialog userName={memberInfo?.name} usedPath={'main'} />
      <Section1 isServerCurrentActive={isServerHealthy} />
      <Section2 />
      <Section3 isServerHealthy={isServerHealthy} />
      <Section4 />
      
      <Section5 />
      <Footer />
      <TestResultDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onOpenPassResultDialog={() => setIsPassOpen(true)}
        isFinishFirstTest={isFinishFirstTest}
      />
      <PassResultDialog
        isPassOpen={isPassOpen}
        setIsPassOpen={setIsPassOpen}
        resultInfo={resultInfo}
        isFinishFirstTest={isFinishFirstTest}
        memberInfo={memberInfo}
      />

      <DevNoticeDialog />
      <TestPeriodDialog />
    </>
  );
};

export default MainPage;
