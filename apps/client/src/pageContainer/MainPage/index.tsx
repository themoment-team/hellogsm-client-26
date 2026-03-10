'use client';

import { useEffect, useState } from 'react';

import { MyMemberInfoType, MyTotalTestResultType } from 'types';

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
} from 'client/components';

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
    const hideDialog = localStorage.getItem('hideTestResultDialog');

    if (hideDialog === today) {
      setIsOpen(false);
    } else if (resultInfo && resultInfo.firstTestPassYn !== null) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
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
