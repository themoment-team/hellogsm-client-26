'use client';

import { useState } from 'react';

import { useModalStore } from '@repo/store';
import { MyMemberInfoType, MyTotalTestResultType } from '@repo/types';
import { cn } from '@repo/utils';

import { PassResultDialog } from '@/components';

const divStyle = [
  'text-gray-900',
  'text-[1rem]/[1.5rem]',
  'font-semibold',
  'w-[12.3125rem]',
  'h-[6.5rem]',
  'bg-white',
  'rounded-xl',
  'p-5',
  'flex',
  'relative',
  'shadow-md',
  'cursor-pointer',
] as const;

const imgStyle = ['absolute', 'top-[2.75rem]', 'right-[1.12rem]'] as const;

const containerStyle = ['flex', 'flex-col', 'gap-10', 'items-center'] as const;

const h1Style = ['text-gray-900', 'text-[1.5rem]/[2rem]', 'font-semibold'] as const;

interface CheckResultPageProps {
  memberInfo: MyMemberInfoType | undefined;
  resultInfo: MyTotalTestResultType | undefined;
  isCheckFirstResult: boolean;
  isCheckFinalResult: boolean;
  isOneseoWrite: boolean;
}

const CheckResultPage = ({
  memberInfo,
  resultInfo,
  isCheckFirstResult,
  isCheckFinalResult,
  isOneseoWrite,
}: CheckResultPageProps) => {
  const {
    setResultAnnouncementPeriodModal,
    setOneseoNotSubmittedModal,
    setResultNotAnnouncedModal,
  } = useModalStore();
  const [isFirstTest, setIsFirstTest] = useState<boolean>(true);
  const [isDialog, setIsDialog] = useState(false);

  const handleDialog = (resultStatus: boolean) => {
    // 원서를 작성하지 않았을 경우
    if (isOneseoWrite) return setOneseoNotSubmittedModal(true);

    // 원서를 작성했지만 결과가 null로 오는 경우
    if (
      (resultInfo && resultInfo.firstTestPassYn === null && isCheckFirstResult && resultStatus) ||
      (resultInfo && resultInfo.secondTestPassYn === null && isCheckFinalResult && !resultStatus)
    ) {
      return setResultNotAnnouncedModal(true);
    }

    const isChecked = resultStatus ? isCheckFirstResult : isCheckFinalResult;
    if (isChecked) {
      // 합격여부모달
      return setIsDialog(true);
    } else if (!isChecked) {
      // 조회 기간이 아닐경우
      return setResultAnnouncementPeriodModal(true, resultStatus);
    }
  };

  const handleCheckTest = (resultStatus: boolean) => {
    setIsFirstTest(resultStatus);
    handleDialog(resultStatus);
  };

  const handleDialogClick = () => {
    setIsDialog(false);
  };

  return (
    <>
      <div className={cn([containerStyle, 'mt-48'])}>
        <h1 className={cn([h1Style])}>합격 유형을 선택해주세요.</h1>
        <div className={cn('flex', 'gap-5', 'xs:flex-row', 'flex-col')}>
          <div onClick={() => handleCheckTest(true)} className={cn([divStyle])}>
            1차 합격 조회
            <img src="/images/🍀.png" className={cn([imgStyle, 'w-[3.75rem]', 'h-[3.75rem]'])} />
          </div>
          <div onClick={() => handleCheckTest(false)} className={cn([divStyle])}>
            최종 합격 조회
            <img src="/images/🏆.png" className={cn([imgStyle, 'w-[3.75rem]', 'h-[3.125rem]'])} />
          </div>
        </div>
      </div>

      <PassResultDialog
        isPassOpen={isDialog}
        setIsPassOpen={setIsDialog}
        isFinishFirstTest={isFirstTest}
        resultInfo={
          isFirstTest
            ? ({
                firstTestPassYn: resultInfo?.firstTestPassYn,
              } as MyTotalTestResultType)
            : resultInfo
        }
        memberInfo={{ name: memberInfo?.name } as MyMemberInfoType}
        onClick={handleDialogClick}
      />
    </>
  );
};

export default CheckResultPage;
