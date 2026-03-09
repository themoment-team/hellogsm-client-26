'use client';

import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import {
  memberQueryKeys,
  useGetMyFirstTestResultInfo,
  useGetMySecondTestResultInfo,
  useGetMyMemberInfo,
  useGetMyOneseo,
  useLogout,
} from 'api';
import { useRouter } from 'next/navigation';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'shared';
import { GetMyOneseoType } from 'types';

import { AlertIcon, DocumentIcon, ParticleIcon, PrintIcon, ProfileIcon } from 'client/assets';
import { PassResultDialog } from 'client/components';

import { cn } from 'shared/lib/utils';

interface MyInfoProps {
  initialData: GetMyOneseoType | undefined;
  isOneseoWrite: boolean;
}

const MyPage = ({ initialData, isOneseoWrite }: MyInfoProps) => {
  const [isPassOpen, setIsPassOpen] = useState<boolean>(false);

  const { push } = useRouter();

  const queryClient = useQueryClient();

  const { data: oneseoInfo } = useGetMyOneseo({
    initialData: initialData,
  });

  const { data: memberInfo } = useGetMyMemberInfo();

  const { data: firstResultInfo } = useGetMyFirstTestResultInfo();

  const { data: secondResultInfo } = useGetMySecondTestResultInfo();

  const resultInfo = {
    firstTestPassYn: firstResultInfo?.firstTestPassYn ?? null,
    secondTestPassYn: secondResultInfo?.secondTestPassYn ?? null,
    decidedMajor: secondResultInfo?.decidedMajor ?? null,
  };

  const logout = useLogout('client');

  const handleLogout = () => {
    queryClient.removeQueries({ queryKey: memberQueryKeys.getMyAuthInfo() });
    queryClient.removeQueries({ queryKey: memberQueryKeys.getMyMemberInfo() });
    logout();
  };
  const submitCode = oneseoInfo?.submitCode;
  const wantedScreening = oneseoInfo?.wantedScreening;
  const desiredMajors = oneseoInfo?.desiredMajors;
  const name = memberInfo?.name;

  const isFinishFirstTest = resultInfo?.secondTestPassYn === null ? true : false;

  const departments = [
    desiredMajors?.firstDesiredMajor,
    desiredMajors?.secondDesiredMajor,
    desiredMajors?.thirdDesiredMajor,
  ];

  const departmentLabels: Record<string, string> = {
    SW: 'SW개발과',
    IOT: '스마트IoT과',
    AI: '인공지능과',
  };

  const relatedDocuments = [
    {
      icon: <DocumentIcon />,
      text: '유형별 제출서류 안내 파일',
      path: `${process.env.NEXT_PUBLIC_CDN_URL}/지원자_제출_서류_목록_안내.hwpx`,
    },
    { icon: <PrintIcon />, text: '입학원서', path: 'print' },
    {
      icon: <PrintIcon />,
      text: '제출서류',
      path: `${process.env.NEXT_PUBLIC_CDN_URL}/입학_제출_서류.hwp`,
    },
  ];

  const screeningLabels: Record<string, string> = {
    GENERAL: '일반전형',
    SPECIAL: '특별전형',
    EXTRA_VETERANS: '국가보훈대상자',
    EXTRA_ADMISSION: '특례입학대상자',
  };

  const screeningLabel = wantedScreening ? screeningLabels[wantedScreening] : '전형 없음';

  const buttonStyle = ['px-[0.75rem]', 'py-[0.375rem]', 'text-[0.75rem]/[1.25rem]', 'h-8'];

  return (
    <div className={cn('flex', 'w-full', 'min-h-screen', 'justify-center', 'bg-white', 'pb-10')}>
      <div
        className={cn(
          'flex',
          'flex-col',
          '33.5rem',
          'gap-10',
          'justify-center',
          'items-center',
          'mx-4',
          'pt-10',
        )}
      >
        <div className={cn('flex', 'w-fit', 'flex-col', 'items-center', 'gap-5')}>
          <div
            className={cn(
              'flex',
              'w-[5.5rem]',
              'h-[5.5rem]',
              'items-center',
              'justify-center',
              'rounded-3xl',
              'bg-slate-100',
            )}
          >
            <ProfileIcon />
          </div>
          <div className={cn('flex', 'flex-col', 'gap-3', 'items-center')}>
            <p className={cn('text-slate-800', 'text-h3', 'font-semibold')}>{name} 님</p>
            {oneseoInfo === undefined || (oneseoInfo && oneseoInfo.step) ? (
              isOneseoWrite && (
                <p className={cn('text-slate-500', 'text-[1.25rem]/[1.75rem]', 'font-normal')}>
                  원서를 아직 작성하지 않았습니다.
                </p>
              )
            ) : (
              <div className={cn('flex', 'items-center', 'gap-2')}>
                <div
                  className={cn(
                    'flex',
                    'px-3',
                    'py-1',
                    'items-center',
                    'justify-center',
                    'rounded-[3.5rem]',
                    'bg-slate-100',
                  )}
                >
                  <p className={cn('text-slate-500', 'text-[0.875rem]/[1.25rem]', 'font-normal')}>
                    접수번호 {submitCode}
                  </p>
                </div>
                <div
                  className={cn(
                    'flex',
                    'px-3',
                    'py-1',
                    'items-center',
                    'justify-center',
                    'rounded-[3.5rem]',
                    'bg-slate-100',
                  )}
                >
                  <p className={cn('text-slate-500', 'text-[0.875rem]/[1.25rem]', 'font-normal')}>
                    {screeningLabel}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {oneseoInfo === undefined || (oneseoInfo && oneseoInfo.step) ? (
          <div className={cn('flex', 'items-center', 'gap-2')}>
            {isOneseoWrite && (
              <Button variant="outline" onClick={() => push('/register?step=1')}>
                원서 작성하기
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className={cn('text-red-600')}>
                  로그아웃
                </Button>
              </DialogTrigger>
              <DialogContent className={cn('sm:max-w-md')} showCloseIcon={false}>
                <DialogHeader>
                  <DialogTitle>Hello,GSM에 로그아웃 하시겠습니까?</DialogTitle>
                </DialogHeader>

                <DialogFooter className={cn('sm:justify-end')}>
                  <DialogClose asChild>
                    <Button variant="outline">취소</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="button" onClick={handleLogout}>
                      로그아웃
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <>
            <div className={cn('flex', 'flex-col', 'w-full', 'gap-2')}>
              <p className={cn('text-slate-600', 'text-body1', 'font-semibold')}>지원학과 조회</p>
              <div className={cn('w-full', 'flex', 'items-center', 'justify-between', 'gap-2')}>
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex',
                      'flex-col',
                      'py-4',
                      'justify-center',
                      'items-center',
                      'rounded-[0.375rem]',
                      'border',
                      'border-solid',
                      'border-slate-300',
                      'w-full',
                    )}
                  >
                    <p className={cn('text-slate-600', 'text-[1rem]/[1.75rem]', 'font-normal')}>
                      {index + 1}지망 : {dept ? departmentLabels[dept] : '미지정'}
                    </p>
                  </div>
                ))}
              </div>
              {resultInfo && resultInfo.firstTestPassYn !== null && (
                <div className={cn('flex', 'flex-col', 'w-full')}>
                  <div className={cn('flex', 'flex-col', 'gap-2')}>
                    <div
                      className={cn(
                        'flex',
                        'p-4',
                        'items-center',
                        'justify-between',
                        'rounded-[0.375rem]',
                        'border',
                        'border-solid',
                        'border-slate-300',
                      )}
                    >
                      <div className={cn('flex', 'items-center', 'gap-3')}>
                        <ParticleIcon />
                        <p className={cn('text-slate-900', 'text-[1rem]/[1.75rem]', 'font-normal')}>
                          {isFinishFirstTest
                            ? '1차 서류전형 합격자 확인하기'
                            : '최종 합격자 확인하기'}
                        </p>
                      </div>

                      <Button
                        onClick={() => setIsPassOpen(true)}
                        variant="download"
                        className={cn([...buttonStyle])}
                      >
                        바로가기
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <PassResultDialog
                isPassOpen={isPassOpen}
                setIsPassOpen={setIsPassOpen}
                resultInfo={resultInfo}
                isFinishFirstTest={isFinishFirstTest}
                memberInfo={memberInfo}
              />
            </div>

            <div className={cn('w-full', 'flex', 'flex-col', 'gap-3')}>
              <div className={cn('flex', 'flex-col', 'w-full', 'gap-2')}>
                <p className={cn('text-slate-600', 'text-body1', 'font-semibold')}>
                  관련서류 다운로드
                </p>
                <div className={cn('flex', 'flex-col', 'gap-2')}>
                  {relatedDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex',
                        'p-4',
                        'items-center',
                        'justify-between',
                        'rounded-[0.375rem]',
                        'border',
                        'border-solid',
                        'border-slate-300',
                      )}
                    >
                      <div className={cn('flex', 'items-center', 'gap-3')}>
                        {doc.icon}
                        <p className={cn('text-slate-900', 'text-[1rem]/[1.75rem]', 'font-normal')}>
                          {doc.text}
                        </p>
                      </div>

                      <Button
                        onClick={() => push(doc.path)}
                        variant="download"
                        className={cn([...buttonStyle])}
                      >
                        다운로드
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={cn(
                  'flex',
                  'px-3',
                  'py-4',
                  'items-start',
                  'gap-2',
                  'rounded-[0.375rem]',
                  'bg-slate-100',
                )}
              >
                <AlertIcon />
                <span className={cn('text-slate-500', 'text-[0.875rem]/[1.5rem]', 'font-normal')}>
                  <strong>
                    입학원서, 입학 전형성적 입력 확인서, 개인정보 수집활용동의서,
                    <br />
                    개인정보 제3자 제공 동의서, 보호자 확인서
                  </strong>
                  를 출력하여 입학원서 접수처에
                  <br />
                  제출해 주세요.
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPage;
