'use client';

import { TicketType } from 'types';

import { PrintIcon } from 'shared/assets';
import { Button } from 'shared/components';
import {
  visionCampDate,
  passedMemberAnnounceDate,
  심층면접시험기간,
  역량검사시험기간,
  NEXT_YEAR,
} from 'shared/constants';
import { cn } from 'shared/lib/utils';

import { useGetAdmissionTickets } from 'api/hooks';

interface TicketPageProps {
  initialData: TicketType[];
}

const TicketPage = ({ initialData }: TicketPageProps) => {
  const { data: admissionTickets } = useGetAdmissionTickets({
    initialData: initialData,
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={cn('print:exact', 'flex', 'flex-col', 'bg-white', 'print:pt-0')}>
      {admissionTickets?.map((ticket, i) => (
        <div
          key={ticket.oneseoSubmitCode}
          className={cn(
            'mx-auto',
            'flex',
            'h-[100dvh]',
            'w-[920px]',
            'items-center',
            'font-normal',
            'text-black',
          )}
        >
          <table
            className={cn(
              'h-[350px]',
              'w-full',
              'border-collapse',
              'text-center',
              'text-[0.75rem]',
              'font-light',
              'leading-[1.25rem]',
            )}
          >
            <tbody>
              <tr>
                <td
                  className={cn('w-[55vw]', 'border', 'border-black', 'text-[20px]', 'font-normal')}
                  colSpan={2}
                >
                  수험자 안내사항
                </td>
                <td
                  className={cn('w-[45vw]', 'border', 'border-black', 'text-[20px]', 'font-normal')}
                  colSpan={3}
                >
                  수 험 표
                </td>
              </tr>
              <tr>
                <td className={cn('w-28', 'border', 'border-black', 'font-normal')}>
                  2차 전형 <br />
                  (역량검사)
                </td>
                <td
                  className={cn(
                    'border',
                    'border-black',
                    'pl-[0.625rem]',
                    'text-left',
                    'font-normal',
                  )}
                >
                  {역량검사시험기간}
                </td>

                <td rowSpan={7} className={cn('h-[200px]', 'w-[150px]', 'border', 'border-black')}>
                  {ticket.profileImg && (
                    <img
                      src={ticket.profileImg}
                      alt="증명사진 오류"
                      className={cn('block', 'h-full', 'w-full')}
                    />
                  )}
                </td>
                <td
                  rowSpan={1}
                  className={cn(
                    'w-[10%]',
                    'border',
                    'border-black',
                    'bg-[#e9e9e9]',
                    'font-medium',
                    'font-normal',
                  )}
                >
                  접수번호
                </td>
                <td rowSpan={1} className={cn('border', 'border-black', 'font-normal')}>
                  {ticket.oneseoSubmitCode}
                </td>
              </tr>
              <tr>
                <td className={cn('w-28', 'border', 'border-black', 'font-normal')}>
                  2차 전형 <br />
                  (심층면접)
                </td>
                <td
                  className={cn(
                    'border',
                    'border-black',
                    'pl-[0.625rem]',
                    'text-left',
                    'font-normal',
                  )}
                >
                  {심층면접시험기간}
                </td>
                <td
                  rowSpan={1}
                  className={cn(
                    'w-[10%]',
                    'border',
                    'border-black',
                    'bg-[#e9e9e9]',
                    'font-medium',
                    'font-normal',
                  )}
                >
                  수험번호
                </td>
                <td rowSpan={1} className={cn('border', 'border-black', 'font-normal')}>
                  {ticket.examinationNumber}
                </td>
              </tr>
              <tr>
                <td rowSpan={2} className={cn('border', 'border-black', 'font-normal')}>
                  합격자 발표
                </td>
                <td
                  className={cn(
                    'border',
                    'border-black',
                    'pl-[0.625rem]',
                    'text-left',
                    'font-normal',
                  )}
                >
                  입학지원 사이트 로그인 후 확인(hellogsm.kr)
                </td>
                <td
                  className={cn(
                    'border',
                    'border-black',
                    'bg-[#e9e9e9]',
                    'font-medium',
                    'font-normal',
                  )}
                >
                  성명
                </td>
                <td className={cn('border', 'border-black')}>{ticket.memberName}</td>
              </tr>
              <tr>
                <td
                  className={cn(
                    'border',
                    'border-black',
                    'pl-[0.625rem]',
                    'text-left',
                    'font-normal',
                  )}
                >
                  {passedMemberAnnounceDate}
                </td>
                <td
                  className={cn(
                    'border',
                    'border-black',
                    'bg-[#e9e9e9]',
                    'font-medium',
                    'font-normal',
                  )}
                  rowSpan={2}
                >
                  생년월일
                </td>
                <td className={cn('border', 'border-black', 'font-normal')} rowSpan={2}>
                  {ticket.memberBirth}
                </td>
              </tr>
              <tr>
                <td rowSpan={2} className={cn('border', 'border-black', 'font-normal')}>
                  합격자 등록 및<br /> 서류 제출
                </td>
                <td
                  className={cn(
                    'border',
                    'border-black',
                    'pl-[0.625rem]',
                    'text-left',
                    'font-normal',
                  )}
                >
                  공문 시행, 방문 제출
                </td>
              </tr>
              <tr>
                <td
                  className={cn(
                    'border',
                    'border-black',
                    'pl-[0.625rem]',
                    'text-left',
                    'font-normal',
                  )}
                >
                  (1) 입학등록동의서 1부
                  <br />
                  (2) 건강진단서 1부
                  <br />
                  2025. 11. 05.(수)~ 11. 10.(월) 16:30
                  <br />
                  (※ 휴무일과 공휴일은 서류 접수하지 않음)
                </td>
                <td
                  rowSpan={2}
                  className={cn(
                    'border',
                    'border-black',
                    'bg-[#e9e9e9]',
                    'font-medium',
                    'font-normal',
                  )}
                >
                  출신학교
                </td>
                {ticket.schoolName ? (
                  <td rowSpan={2} className={cn('border', 'border-black')}>
                    {ticket.schoolName}
                  </td>
                ) : (
                  <td
                    rowSpan={2}
                    className={cn(
                      'bg-[url(&apos;data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="100%" x2="100%" y2="0" stroke="gray" /></svg>&apos;)]',
                      'border',
                      'border-black',
                    )}
                  />
                )}
              </tr>
              <tr>
                <td className={cn('border', 'border-black', 'font-normal')}>입학등록동의서 서식</td>
                <td
                  className={cn(
                    'border',
                    'border-black',
                    'pl-[0.625rem]',
                    'text-left',
                    'font-normal',
                  )}
                >
                  본교 홈페이지에서 다운로드
                </td>
              </tr>
              <tr>
                <td className={cn('border', 'border-black', 'font-normal')}>신입생 비전캠프</td>
                <td
                  className={cn(
                    'border',
                    'border-black',
                    'pl-[0.625rem]',
                    'text-left',
                    'font-normal',
                  )}
                >
                  {visionCampDate.startDate} ~ {visionCampDate.endDate} 예정
                </td>
                <td
                  rowSpan={2}
                  colSpan={2}
                  className={cn(
                    'border',
                    'border-black',
                    'pl-2',
                    'pr-[0.625rem]',
                    'text-left',
                    'font-normal',
                  )}
                >
                  위 사람은 {NEXT_YEAR}학년도 <br /> 본교 신입생 입학전형 지원자임을 확인함.
                  <p className={cn('pr-[0.625rem]', 'text-center', 'font-normal')}>
                    2025년 10월 31일
                  </p>
                  <p>광주소프트웨어마이스터고등학교장 [직인생략]</p>
                </td>
                <td
                  className={cn(
                    'border',
                    'border-black',
                    'bg-[#e9e9e9]',
                    'font-medium',
                    'font-normal',
                  )}
                >
                  접수자
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className={cn(
                    'border',
                    'border-black',
                    'pl-[0.625rem]',
                    'text-left',
                    'font-normal',
                  )}
                >
                  * 공지 사항: 홈페이지(gsm.gen.hs.kr)-입학 안내 <br />* 문의:062-949-6842
                </td>
                <td className={cn('border', 'border-black', 'font-normal')}>(인)</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
      <Button
        className={cn(
          'fixed',
          'bottom-10',
          'right-10',
          'z-50',
          'items-center',
          'gap-2',
          'print:hidden',
        )}
        onClick={handlePrint}
      >
        <PrintIcon />
        <p className={cn('text-[2.1vh]', 'font-bold', 'hover:text-white')}>인쇄하기</p>
      </Button>
    </div>
  );
};

export default TicketPage;
