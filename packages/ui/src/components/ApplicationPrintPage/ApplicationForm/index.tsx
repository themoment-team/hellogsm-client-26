 
import { NEXT_YEAR } from '@repo/constants';
import { OneseoStatusType } from '@repo/types';
import { cn } from '@repo/utils';

import ApplicationPledge from '../ApplicationPledge';
import OneseoStatus from '../OneseoStatus';
import PersonalInfoTable from '../PersonalInfoTable';
 

interface ApplicationFormProps extends OneseoStatusType {
  isPreview?: boolean;
}

const ApplicationForm = ({ oneseo, isPreview }: ApplicationFormProps) => {
  return (
    <div
      className={cn(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'overflow-hidden',
        'bg-white',
        'p-2',
        'text-[1vh]',

        'print:w-[210mm]',
        'print:h-[297mm]',
        'print:flex',
        'print:items-center',
        'print:justify-center',
        'print:p-0',
        'print:m-0',
      )}
    >
      <div className={cn('relative', 'z-[2]', 'w-[63vh]', 'py-20')}>
        {isPreview && (
          <p
            className={cn(
              'absolute',
              'print:fixed',
              'top-6',
              'left-4',
              'z-10',
              'text-red-600',
              'text-sm',
              'font-normal',
              'leading-normal',
            )}
          >
            * 해당 원서는 미리보기 용입니다
          </p>
        )}
        <div className={cn('relative', 'z-[2]', 'w-[63vh]', 'overflow-hidden')}>
          <div
            id="sample"
            className={cn(
              'absolute',
              'top-[-60px]',
              'z-[-1]',
              'rotate-[-30deg]',
              'select-none',
              'text-center',
              'text-[40vh]',
              'text-gray-200',
            )}
          >
            견본
          </div>

          <p>[서식 1]</p>
          <div className={cn('text-center', 'text-[3vh]', 'font-bold')}>
            광주소프트웨어마이스터고등학교 입학원서
          </div>

          <div className={cn('flex', 'items-end', 'justify-between')}>
            <div className={cn('mt-[1.5vh]', 'text-lg', 'font-bold', 'leading-[2vh]')}>
              {NEXT_YEAR}학년도 신입생 입학전형
            </div>
            <div>
              <table>
                <tr>
                  <th
                    className={cn(
                      'w-14',
                      'border',
                      'border-b-0',
                      'border-black',
                      'bg-[#e9e9e9]',
                      'p-[0.2vh]',
                      'align-middle',
                      'font-medium',
                    )}
                  >
                    접수번호
                  </th>
                  <td
                    className={cn(
                      'w-[113px]',
                      'border',
                      'border-b-0',
                      'border-black',
                      'text-center',
                    )}
                  >
                    {oneseo.submitCode}
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div className={cn('border', 'border-r-0', 'border-t-0', 'border-black')}>
            <PersonalInfoTable oneseo={oneseo} />
            <OneseoStatus oneseo={oneseo} />
            <ApplicationPledge oneseo={oneseo} />
          </div>

          <div className={cn('my-4', 'text-center')}>
            ** 2차 전형 응시 준비물: 신분증(학생증), 필기구
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
