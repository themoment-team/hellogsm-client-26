import { TheMomentIcon } from 'client/assets';

import { cn } from 'shared/lib/utils';

const TeamSection2 = () => {
  return (
    <div
      id="section2"
      className={cn(
        'flex',
        'flex-col-reverse',
        'md:flex-row',
        'justify-between',
        'items-center',
        'w-full',
        'bg-white',
        'py-[15rem]',
        'px-[1.5rem]',
        'md:px-[6.25rem]',
        'xl:px-[12.5rem]',
        'fhd:px-[20rem]',
        'uhd:px-[22.5rem]',
        'gap-[5rem]',
        'md:gap-0',
      )}
    >
      <div className={cn('flex', 'w-fit', 'flex-col', 'gap-6')}>
        <h1
          className={cn(
            'text-[#473B6B]',
            'sm:text-[4.25rem]/[5.525rem]',
            'xs:text-[2.75rem]/[3.85rem]',
            'text-[1.75rem]/[2.75rem]',
            'font-bold',
            'text-center',
            'md:text-left',
          )}
        >
          <span className={cn('text-[#7C58E9]')}>더모먼트</span>는
          <br />
          어떤 팀 인가요?
        </h1>
        <span
          className={cn(
            'text-[#5D5B64]',
            'sm:text-[1.25rem]/[2rem]',
            'text-[1rem]/[1.75rem]',
            'font-normal',
            'text-center',
            'md:text-left',
          )}
        >
          더모먼트는 광주소프트웨어마이스터고등학교의 전공 동아리입니다. <br />
          약 30명의 재학생, 졸업생들이 모여서 활동하고, <br
            className={cn('sm:hidden', 'block')}
          />{' '}
          주로 학교에 필요한 서비스를 개발합니다.
          <br />
          학교에 필요한 서비스를 함께 개발하고 싶나요?{' '}
          <br className={cn('md:block', 'sm:hidden', 'block')} />
          지금 바로 SW 마이스터고에 지원하세요!
        </span>
      </div>
      <div
        className={cn(
          'flex',
          'justify-center',
          'items-center',
          'w-[17.875rem]',
          'h-[17.875rem]',
          'shadow-[0px_8.171px_44.5px_rgba(59,48,126,0.10)]',
          'rounded-[3rem]',
          'relative',
        )}
      >
        <div
          className={cn(
            'absolute',
            'inset-0',
            'rounded-[3rem]',
            'shadow-[10px_-10px_20px_#C8B6FF, -10px_10px_20px_#B6C2FF]',
          )}
        />
        <TheMomentIcon />
      </div>
    </div>
  );
};

export default TeamSection2;
