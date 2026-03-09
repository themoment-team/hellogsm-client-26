import { OneseoStatusType } from 'types';

import { CURRENT_YEAR, NEXT_YEAR } from 'shared/constants';
import { cn } from 'shared/lib/utils';

const ApplicationPledge = ({ oneseo }: OneseoStatusType) => {
  return (
    <div className={cn('border-r', 'border-black', 'p-2', 'text-sm')}>
      <div className={cn('mb-4')}>
        위 학생은 {NEXT_YEAR}학년도 귀교 제1학년에 입학하고자 소정의 서류를 갖추어 지원하며, &nbsp;
        <strong>
          다른 산업수요맞춤형(마이스터)고등학교를 포함한 전기고등학교에 이중지원하지 않을 것을 서약
        </strong>
        합니다.
      </div>
      <div className={cn('mb-4', 'flex', 'justify-center')}>
        <p className={cn('mr-6')}>{CURRENT_YEAR}년</p>
        <p className={cn('mr-6')}>월</p>
        <p>일</p>
      </div>
      <div className={cn('mb-4', 'flex', 'w-full', 'justify-end', 'gap-6')}>
        <p>지원자 :</p>
        <p>{oneseo.privacyDetail.name}</p>
        <p className={cn('text-end')}>(인)</p>
      </div>
      <div className={cn('mb-4', 'flex', 'w-full', 'justify-end', 'gap-6')}>
        <p>보호자 :</p>
        <p>{oneseo.privacyDetail.guardianName}</p>
        <p className={cn('text-end')}>(인)</p>
      </div>
      <div className={cn('text-left')}>광주소프트웨어마이스터고등학교장 귀하</div>
      {oneseo.privacyDetail.graduationType !== 'GED' && (
        <>
          <div className={cn('mb-3', 'h-[0.5px]', 'w-full', 'bg-slate-400')} />
          <div className={cn('text-center')}>
            위 기재 사항이 사실과 다름이 없음을 증명하며,
            <br />위 학생이 귀교 교육과정을 성실히 이수할 수 있다고 판단되어 이에 추천합니다.
          </div>
          <div className={cn('text-right', 'text-base')}>
            {oneseo.privacyDetail.schoolName}장[직인]
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationPledge;
