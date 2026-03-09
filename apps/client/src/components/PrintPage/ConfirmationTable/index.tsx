import { OneseoStatusType } from 'types';

import { cn } from 'shared/lib/utils';

const ConfirmationTable = ({ oneseo }: OneseoStatusType) => {
  return (
    <>
      <table
        className={cn(
          'mx-auto',
          'mt-[1.5vh]',
          'w-[80%]',
          'border-collapse',
          'border',
          'text-[1vh]',
        )}
      >
        <thead>
          <tr>
            <td
              className={cn('border', 'border-black', 'bg-gray-200', 'p-[0.3vh]', 'text-center')}
              colSpan={4}
            >
              입력자 확인
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={cn('border', 'border-black', 'bg-gray-200', 'p-[0.3vh]', 'text-center')}>
              담임교사
            </td>
            <td
              className={cn(
                'border',
                'border-black',
                'p-[0.3vh]',
                'relative',
                'text-center',
                'w-[25%]',
                oneseo.privacyDetail.graduationType !== 'CANDIDATE' && [
                  'bg-slash',
                  'bg-contain',
                  'bg-no-repeat',
                ],
              )}
            >
              {oneseo.privacyDetail.graduationType === 'CANDIDATE' && (
                <>
                  {oneseo.privacyDetail.schoolTeacherName}
                  <span className="absolute right-1 top-1/2 -translate-y-1/2">(인)</span>
                </>
              )}
            </td>

            <td className={cn('border', 'border-black', 'bg-gray-200', 'p-[0.3vh]', 'text-center')}>
              지원자
            </td>
            <td
              className={cn(
                'border',
                'border-black',
                'p-[0.3vh]',
                'relative',
                'text-center',
                'w-[25%]',
              )}
            >
              {oneseo.privacyDetail.name}
              <span className="absolute right-1 top-1/2 -translate-y-1/2">(인)</span>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        className={cn(
          'mx-auto',
          'mt-[1.5vh]',
          'w-[80%]',
          'border-collapse',
          'border',
          'text-[1vh]',
        )}
      >
        <thead>
          <tr>
            <td
              className={cn(
                'border',
                'border-black',
                'bg-gray-200',
                'p-[0.3vh]',
                'w-[50%]',
                'text-center',
              )}
              rowSpan={2}
            >
              광주소프트웨어마이스터고 접수자 확인
            </td>
            <td className={cn('border', 'border-black', 'bg-gray-200', 'p-[0.3vh]', 'text-center')}>
              1차
            </td>
            <td className={cn('border', 'border-black', 'p-[0.3vh]', 'text-right')}>(인)</td>
          </tr>
          <tr>
            <td className={cn('border', 'border-black', 'bg-gray-200', 'p-[0.3vh]', 'text-center')}>
              2차
            </td>
            <td className={cn('border', 'border-black', 'p-[0.3vh]', 'text-right')}>(인)</td>
          </tr>
        </thead>
      </table>
    </>
  );
};

export default ConfirmationTable;
