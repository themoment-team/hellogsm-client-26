'use client';

import { useRouter } from 'next/navigation';
import { MyMemberInfoType, MyTotalTestResultType, Majors } from 'types';

import { BlurIcon, CopyIcon, HelloGSMIcon } from 'client/assets';

import { Button, Dialog, DialogContent, DialogTitle } from 'shared/components';
import { cn } from 'shared/lib/utils';

interface PassResultProps {
  isPassOpen: boolean;
  setIsPassOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resultInfo: MyTotalTestResultType | undefined;
  isFinishFirstTest: boolean;
  memberInfo: MyMemberInfoType | undefined;
  onClick?: () => void;
}

const PassResultDialog = ({
  isPassOpen,
  setIsPassOpen,
  resultInfo,
  isFinishFirstTest,
  memberInfo,
  onClick = () => setIsPassOpen(false),
}: PassResultProps) => {
  const { push } = useRouter();

  const firstTestPass = isFinishFirstTest && resultInfo?.firstTestPassYn === 'YES';
  const secondTestPass = !isFinishFirstTest && resultInfo?.secondTestPassYn === 'YES';
  const major = resultInfo?.decidedMajor;
  const MAJOR_LABELS: Record<Majors, string> = {
    SW: '소프트웨어개발과',
    IOT: '스마트IoT과',
    AI: '인공지능(AI)과',
  };
  const majorLabel = major ? MAJOR_LABELS[major] : null;
  const userName = memberInfo?.name;
  const resultMessages = {
    firstTestPassYes: {
      title: (
        <>
          축하합니다! {userName} 님은 1차 전형에 <span className={cn('text-sky-600')}>합격</span>{' '}
          하셨습니다.
        </>
      ),
      message: (
        <>
          2차 역량검사는 10월 31일 13:00 ~ 16:30에 진행될 예정입니다.
          <br />
          <div className={cn('flex', 'items-center', 'gap-1')}>
            <CopyIcon color="#2563EB" />
            <a
              href="https://www.jobda.im/acca/introduce"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              잡다 사이트
            </a>
            에서 미리 사전 연습을 진행해보시기 바랍니다.
          </div>
        </>
      ),
    },
    firstTestPassNo: {
      title: (
        <>
          {userName} 님은 1차 전형에 <span className={cn('text-red-600')}>불합격</span> 하셨습니다.
        </>
      ),
      message: (
        <>
          광주소프트웨어마이스터고등학교에 지원해 주셔서
          <br />
          진심으로 감사드립니다.
        </>
      ),
    },
    secondTestPassYes: {
      title: (
        <>
          축하합니다! {userName} 님은 <span className={cn('text-sky-600')}>최종합격</span>{' '}
          하셨습니다.
        </>
      ),
      message: (
        <>
          {userName} 님은 <span className={cn('text-sky-600', 'font-semibold')}>{majorLabel}</span>
          에 배정되셨습니다. 더 자세한 정보는
          <br /> 본 사이트에서 확인해 주시기 바랍니다.
        </>
      ),
    },
    secondTestPassNo: {
      title: (
        <>
          {userName} 님은 최종 <span className={cn('text-red-600')}>불합격</span> 하셨습니다.
        </>
      ),
      message: (
        <>
          광주소프트웨어마이스터고등학교에 지원해 주셔서
          <br />
          진심으로 감사드립니다.
        </>
      ),
    },
  };

  const resultKey = isFinishFirstTest
    ? firstTestPass
      ? 'firstTestPassYes'
      : 'firstTestPassNo'
    : secondTestPass
      ? 'secondTestPassYes'
      : 'secondTestPassNo';

  const { title, message } = resultMessages[resultKey];

  const handleInterviewClick = () => {
    window.open(
      'http://gsm.gen.hs.kr/xboard/board.php?mode=view&number=10452&tbnum=65&sCat=0&page=1&keyset=&searchword=',
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <Dialog open={isPassOpen}>
      <DialogTitle />
      <DialogContent
        className={cn(
          'h-[26.25rem]',
          'max-w-[29.9375rem]',
          'sm:h-[23.75rem]',
          'sm:max-w-[40.3125rem]',
          'p-0',
          '!rounded-[0.5rem]',
        )}
        onClose={() => setIsPassOpen(false)}
      >
        <div className={cn('absolute', 'top-[100px]', 'right-[75px]')}>
          <BlurIcon color="#A8E3FF" />
        </div>
        <div className={cn('absolute', 'top-[50px]', 'left-[100px]')}>
          <BlurIcon color="#FCFFAB" />
        </div>
        <div className={cn('absolute', 'bottom-[50px]', 'left-[100px]')}>
          <BlurIcon color="#6BB6FF" />
        </div>
        <div className={cn('flex', 'flex-col', 'gap-8', 'justify-center', 'items-center', 'z-10')}>
          <div className={cn('flex', 'flex-col', 'items-center', 'gap-10')}>
            <HelloGSMIcon />
            <div className={cn('flex', 'flex-col', 'items-center', 'gap-3')}>
              <h3
                className={cn(
                  'text-[1.5rem]/[2rem]',
                  'font-semibold',
                  'px-10',
                  'sm:px-0',
                  'text-center',
                )}
              >
                {title}
              </h3>
              <p
                className={cn(
                  'text-gray-500',
                  'text-[0.875rem]/[1.5rem]',
                  'sm:text-[1.125rem]/[1.75rem]',
                  'font-normal',
                  'sm:font-medium',
                  'text-center',
                )}
              >
                {message}
              </p>
            </div>
          </div>
          <div className={cn('flex', 'gap-3')}>
            {secondTestPass && (
              <Button
                variant="reverseFill"
                className={cn('w-[10.625rem]', 'h-[3.25rem]', 'font-semibold', 'text-base')}
                onClick={() =>
                  push(`${process.env.NEXT_PUBLIC_CDN_URL}/최종_합격자_제출_목록.hwpx`)
                }
              >
                합격자 제출서류 다운
              </Button>
            )}
            {firstTestPass === true ? (
              <>
                <Button
                  variant="reverseFill"
                  className={cn('w-[10.625rem]', 'h-[3.25rem]', 'font-semibold', 'text-base')}
                  onClick={() => handleInterviewClick()}
                >
                  심층면접 예상문제
                </Button>
                <Button
                  variant="fill"
                  className={cn('w-[10.625rem]', 'h-[3.25rem]', 'font-semibold', 'text-base')}
                  onClick={() =>
                    push(
                      `${process.env.NEXT_PUBLIC_CDN_URL}/2026학년_신입생_선발_1차_전형_합격자_안내사항.hwp`,
                    )
                  }
                >
                  합격자 유의사항
                </Button>
              </>
            ) : (
              <Button
                variant="fill"
                className={cn('w-[10.625rem]', 'h-[3.25rem]', 'font-semibold', 'text-base')}
                onClick={onClick}
              >
                확인
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PassResultDialog;
