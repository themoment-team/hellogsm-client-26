import { SexEnum, OneseoStatusType } from '@repo/types';
import { cn } from '@repo/utils';

import FormColgroup from '../FormColgroup';

const thStyle = 'border border-black bg-[#e9e9e9] ';
const tdStyle = 'border border-black ';

type Props = OneseoStatusType;

const PersonalInfoTable = ({ oneseo }: Props) => {
  const [year, month, day] = oneseo.privacyDetail.birth.split('-');

  return (
    <table className={cn('w-full', 'border-collapse', 'text-center', 'text-[1.2vh]')}>
      <FormColgroup />
      <thead>
        <tr>
          <td className={cn(thStyle, 'border-l-0')} rowSpan={5}>
            인적사항
          </td>

          <td className={cn(thStyle, 'leading-tight')} rowSpan={3}>
            지원자
          </td>

          <td className={cn(thStyle)}>성 명</td>
          <td className={cn(tdStyle)}>{oneseo.privacyDetail.name}</td>

          <td className={cn(thStyle, 'leading-none')}>성별</td>
          <td className={cn(tdStyle)}>{SexEnum[oneseo.privacyDetail.sex ?? 'MALE']}</td>

          <td className={cn(thStyle)}>생년월일</td>
          <td className={cn(tdStyle)} colSpan={4}>
            {year}년 {month}월 {day}일
          </td>

          <td rowSpan={5} colSpan={2} className={cn(tdStyle, 'h-[151px]')}>
            <img
              src={oneseo.privacyDetail.profileImg}
              alt="증명사진"
              className={cn('mx-auto', 'max-w-none', 'w-[113.38582677px]', 'h-[151.18110236px]')}
            />
          </td>
        </tr>

        <tr>
          <td className={cn(thStyle)}>주 소</td>
          <td className={cn(tdStyle)} colSpan={8}>
            {oneseo.privacyDetail.address} {oneseo.privacyDetail.detailAddress}
          </td>
        </tr>

        <tr>
          <td className={cn(thStyle)}>핸드폰</td>
          <td className={cn(tdStyle)} colSpan={8}>
            {oneseo.privacyDetail.phoneNumber}
          </td>
        </tr>

        <tr>
          <td className={cn(thStyle, 'leading-tight')} rowSpan={2}>
            보호자
          </td>

          <td className={cn(thStyle)}>성 명</td>
          <td className={cn(tdStyle)}>{oneseo.privacyDetail.guardianName}</td>

          <td className={cn(thStyle, 'leading-none')} colSpan={2}>
            지원자와의
            <br />
            관계
          </td>

          <td className={cn(tdStyle)} colSpan={5}>
            지원자 {oneseo.privacyDetail.name}의 {oneseo.privacyDetail.relationshipWithGuardian}
          </td>
        </tr>

        <tr>
          <td className={cn(thStyle)}>핸드폰</td>
          <td className={cn(tdStyle)} colSpan={8}>
            {oneseo.privacyDetail.guardianPhoneNumber}
          </td>
        </tr>
      </thead>
    </table>
  );
};

export default PersonalInfoTable;
