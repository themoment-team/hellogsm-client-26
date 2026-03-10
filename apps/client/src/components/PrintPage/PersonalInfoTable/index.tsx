import { OneseoStatusType, SexEnum } from 'types';

import { cn } from 'shared/lib/utils';
const thStyle = 'border border-black bg-[#e9e9e9] ';
const tdStyle = 'border border-black ';

const PersonalInfoTable = ({ oneseo }: OneseoStatusType) => {
  const [year, month, day] = oneseo.privacyDetail.birth.split('-');
  return (
    <table className={cn('w-full', 'border-collapse', 'text-center', 'text-[1.2vh]')}>
      <thead>
        <tr>
          <td className={cn(thStyle, 'w-[3%]', 'border-l-0')} rowSpan={8}>
            인적사항
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle, 'w-[3%]', 'leading-tight')} rowSpan={3}>
            지원자
          </td>
          <td className={cn(thStyle)}>성 명</td>
          <td className={cn(tdStyle)}>{oneseo.privacyDetail.name}</td>
          <td className={cn(thStyle, 'w-[3%]', 'leading-none')}>성별</td>
          <td className={cn(tdStyle)}>{SexEnum[oneseo.privacyDetail.sex ?? 'MALE']}</td>
          <td className={cn(thStyle)}>생년월일</td>
          <td className={cn(tdStyle)}>
            {year}년 {month}월 {day}일
          </td>
          <td rowSpan={6} className={cn(tdStyle, 'h-[151px]', 'w-[113px]')}>
            <img
              src={oneseo.privacyDetail.profileImg}
              alt="증명사진"
              className={cn('w-[113.38582677px]', 'h-[151.18110236px]')}
            />
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle)}>주 소</td>
          <td className={cn(tdStyle)} colSpan={5}>
            {oneseo.privacyDetail.address} {oneseo.privacyDetail.detailAddress}
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle)}>핸드폰</td>
          <td className={cn(tdStyle)} colSpan={5}>
            {oneseo.privacyDetail.phoneNumber}
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle, 'w-[3%]', 'leading-tight')} rowSpan={2}>
            보호자
          </td>
          <td className={cn(thStyle)}>성 명</td>
          <td className={cn(tdStyle)} colSpan={1}>
            {oneseo.privacyDetail.guardianName}
          </td>
          <td className={cn(thStyle, 'leading-none')} colSpan={2}>
            지원자와의
            <br />
            관계
          </td>
          <td className={cn(tdStyle)} colSpan={2}>
            지원자 {oneseo.privacyDetail.name}의 {oneseo.privacyDetail.relationshipWithGuardian}
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle)}>핸드폰</td>
          <td className={cn(tdStyle)} colSpan={5}>
            {oneseo.privacyDetail.guardianPhoneNumber}
          </td>
        </tr>
        <tr>
          <td className={cn(thStyle)} colSpan={3} rowSpan={6}>
            원서작성자(담임) 성명
          </td>
          <td
            colSpan={2}
            className={cn([
              tdStyle,
              'relative',
              'text-center',
              'w-[20%]',
              oneseo.privacyDetail.graduationType !== 'CANDIDATE' && [
                'bg-slash',
                'bg-contain',
                'bg-no-repeat',
              ],
            ])}
            rowSpan={3}
          >
            {oneseo.privacyDetail.graduationType === 'CANDIDATE' && (
              <>
                {oneseo.privacyDetail.schoolTeacherName}
                <span className="absolute right-1 top-1/2 -translate-y-1/2">(인)</span>
              </>
            )}
          </td>
          <td className={cn(thStyle)}>연락처</td>
          {oneseo.privacyDetail.graduationType === 'CANDIDATE' ? (
            <td className={cn('border-b', 'border-black')}>
              {oneseo.privacyDetail.schoolTeacherPhoneNumber}
            </td>
          ) : (
            <td className={cn([tdStyle, 'bg-slash', 'bg-contain', 'bg-no-repeat'])} />
          )}
        </tr>
      </thead>
    </table>
  );
};

export default PersonalInfoTable;
