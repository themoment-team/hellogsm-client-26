'use client';

import { useRouter } from 'next/navigation';

import { BottomArrow } from 'client/assets';
import { RECRUITMENT_PERIOD } from 'client/constants';

import { cn } from 'shared/lib/utils';
import { scrollToElement } from 'shared/utils';

import Video from './Video';

const flexColStyle = ['flex', 'flex-col', 'items-center'];

const Section1 = ({ isServerCurrentActive }: { isServerCurrentActive: boolean }) => {
  const { push } = useRouter();

  const scrollToSection2 = () => {
    scrollToElement('#section2');
  };

  return (
    <section
      className={cn(
        'h-[calc(100vh-4.625rem)]',
        'w-full',
        'relative',
        'top-0',
        'z-0',
        'flex',
        'justify-center',
        'bg-black',
      )}
    >
      <Video />
      <div
        className={cn(
          'w-full',
          'h-full',
          'bg-[rgb(0_0_0_/_0.40)]',
          'absolute',
          'top-0',
          'z-[2]',
          'flex',
          'items-center',
          'justify-center',
        )}
      >
        <div className={cn([...flexColStyle, 'gap-14'])}>
          <div className={cn([...flexColStyle, 'gap-6'])}>
            <h1
              className={cn(
                'w-full',
                'text-center',
                'font-bold',
                'text-white',
                'text-[1.25rem]',
                'xs:text-[1.75rem]',
                'sm:text-[2.75rem]',
                'lg:text-[3.25rem]',
              )}
            >
              꿈🌟과 끼🤘🏻를 마음껏{' '}
              <span
                className={cn(
                  'relative',
                  'before:absolute',
                  'before:text-lime-400',
                  'text-sky-300',
                  // eslint-disable-next-line quotes
                  "before:content-['••']",
                  'before:tracking-[0.5rem]',
                  'before:-top-[1.275rem]',
                  'before:left-[0.35rem]',
                  'before:text-[1.25rem]',
                  'sm:before:tracking-[0.75rem]',
                  'sm:before:-top-[2.15rem]',
                  'sm:before:text-[2rem]',
                  'sm:before:left-2',
                  'lg:before:left-[0.675rem]',
                  'lg:before:tracking-[1.15rem]',
                )}
              >
                UP
              </span>{' '}
              시킬 수 있는
              <br />
              광주소프트웨어마이스터고등학교
            </h1>

            {isServerCurrentActive && (
              <p
                className={cn(
                  'text-[0.75rem]/[1.25rem]',
                  'font-normal',
                  'text-white',
                  'sm:text-[1.25rem]/[1.75rem]',
                )}
              >
                접수기간 : {RECRUITMENT_PERIOD.startDate} ~ {RECRUITMENT_PERIOD.endDate}
              </p>
            )}
          </div>

          <button
            onClick={() => push('/guide')}
            className={cn(
              'text-[#F7F7F7]',
              'text-[1rem]/[1.5rem]',
              'sm:text-2xl',
              'font-bold',
              'px-5',
              'sm:px-10',
              'py-2',
              'sm:py-4',
              'rounded-full',
              'border',
              'border-white',
              'border-solid',
            )}
          >
            원서 접수하러 가기
          </button>
        </div>
      </div>

      <div className={cn(['absolute', 'bottom-14', ...flexColStyle, 'gap-[0.75rem]', 'z-[3]'])}>
        <p
          onClick={scrollToSection2}
          className={cn(
            'text-[1.125rem]/[1.75rem]',
            'font-semibold',
            'text-white',
            'cursor-pointer',
            'text-center',
          )}
        >
          GSM 더 알아보기 <br /> 문제 발생 시 채널톡으로 문의해주세요
        </p>
        <div onClick={scrollToSection2} className={cn('animate-bounce', 'cursor-pointer')}>
          <BottomArrow />
        </div>
      </div>
    </section>
  );
};

export default Section1;
