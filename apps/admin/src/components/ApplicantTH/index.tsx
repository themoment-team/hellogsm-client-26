'use client';

import { useState } from 'react';

import { QuestionMark } from 'admin/assets';

import { Table, TableBody, TableCell, TableRow } from 'shared/components';
import { cn } from 'shared/lib/utils';

const ApplicantTH = () => {
  const defaultStyle = cn('font-semibold', 'text-zinc-500');

  const [isDocOver, setIsDocOver] = useState<boolean>(false);
  const [isAgreeOver, setIsAgreeOver] = useState<boolean>(false);

  return (
    <>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={cn([defaultStyle, 'w-[5.25rem]'])}>접수 번호</TableCell>
            <TableCell className={cn([defaultStyle, 'w-[7.5rem]'])}>
              <div className={cn('flex', 'gap-1', 'items-center')}>
                서류 제출 여부
                <div
                  onMouseOver={() => setIsDocOver(true)}
                  onMouseLeave={() => setIsDocOver(false)}
                  className={cn('cursor-pointer', 'relative')}
                >
                  <QuestionMark />
                  {isDocOver && (
                    <div
                      className={cn(
                        'px-3',
                        'py-4',
                        'rounded-lg',
                        'bg-slate-900',
                        'text-xs',
                        'font-semibold',
                        'fixed',
                        'z-[5]',
                        'text-white',
                      )}
                    >
                      지원자가 실물 서류를 제출했다면 클릭하여 상태를 변경해주세요!
                    </div>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell className={cn([defaultStyle, 'w-[7rem]'])}>성명</TableCell>
            <TableCell className={cn([defaultStyle, 'w-[7.5rem]'])}>수험 번호</TableCell>
            <TableCell className={cn([defaultStyle, 'w-[8.5rem]'])}>출신 중학교</TableCell>
            <TableCell className={cn([defaultStyle, 'w-[6.75rem]'])}>전형</TableCell>
            <TableCell className={cn([defaultStyle, 'w-[6rem]'])}>1차 결과</TableCell>
            <TableCell className={cn([defaultStyle, 'w-[10.25rem]'])}>역량검사 점수</TableCell>
            <TableCell className={cn([defaultStyle, 'w-[10rem]'])}>심층면접 점수</TableCell>
            <TableCell className={cn([defaultStyle, 'w-[5.625rem]'])}>2차 결과</TableCell>
            <TableCell className={cn([defaultStyle, 'w-[14.5rem]'])}>
              <div className={cn('flex', 'gap-1', 'items-center')}>
                입학 동의서 제출 여부
                <div
                  onMouseOver={() => setIsAgreeOver(true)}
                  onMouseLeave={() => setIsAgreeOver(false)}
                  className={cn('cursor-pointer', 'relative')}
                >
                  <QuestionMark />
                  {isAgreeOver && (
                    <div
                      className={cn(
                        'px-3',
                        'py-4',
                        'rounded-lg',
                        'bg-slate-900',
                        'text-xs',
                        'font-semibold',
                        'fixed',
                        'z-[5]',
                        'text-white',
                      )}
                    >
                      지원자가 입학 동의서 서류를 제출했다면 클릭하여 상태를 변경해주세요!
                    </div>
                  )}
                </div>
              </div>
            </TableCell>
            {/* <TableCell className={'w-[100px]'} /> */}
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default ApplicantTH;
