'use client';

import { useEffect } from 'react';

import { GetMyOneseoType, MyMemberInfoType, StepEnum } from '@repo/types';
import { ComputerRecommendedPage, StepWrapper } from '@repo/ui/components';

interface RegisterStepsPageProps {
  data: GetMyOneseoType | undefined;
  info: MyMemberInfoType;
  step: StepEnum;
}

const RegisterStepsPage = ({ data, step, info }: RegisterStepsPageProps) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
      return '변경사항이 저장되지 않을 수 있습니다. 사이트에서 나가시겠습니까?';
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <ComputerRecommendedPage type="register" />
      <StepWrapper data={data} info={info} step={step} type="client" />
    </>
  );
};

export default RegisterStepsPage;
