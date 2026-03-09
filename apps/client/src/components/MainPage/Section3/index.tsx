'use client';

import Link from 'next/link';

import * as I from 'client/assets';
import { RECRUITMENT_PERIOD } from 'client/constants';

import { cn } from 'shared/lib/utils';

const buttonStyle = [
  'font-semibold',
  'rounded-3xl',
  'border',
  'border-white px-[1.125rem]',
  'py-[0.375rem]',
  'text-white',
] as const;

interface Section3Props {
  isServerHealthy: boolean;
}

const Section3 = ({ isServerHealthy }: Section3Props) => {
  return (
    <div className={cn('w-full', 'bg-white', 'relative', 'py-[11.25rem]')}>
      <div
        className={cn(
          'flex',
          'justify-between',
          'flex-col',
          'gap-8',
          'sm:gap-[3.75rem]',
          'lg:flex-row',
          'lg:gap-0',
          'px-6',
          'xs:px-[3.75rem]',
          'md:px-[8rem]',
          'xl:px-[16rem]',
          'fhd:px-[20rem]',
          'uhd:px-[32.5rem]',
        )}
      >
        <div className={cn('text-left', 'flex', 'lg:inline', 'flex-col')}>
          <h1
            className={cn(
              'font-semibold',
              'text-gray-900',
              'text-center',
              'smx:text-left',
              'text-[1.25rem]/[1.25rem]',
              'xs:text-[1.5rem]/[2rem]',
              'sm:text-[2rem]/[2.5rem]',
            )}
          >
            광주소프트웨어마이스터고등학교
            <br />
            2026 신입생 모집
          </h1>
          <p className={cn('mb-0', 'lg:mb-8', 'mt-[1rem]', 'hidden', 'smx:flex', 'text-gray-500')}>
            접수 기간: {RECRUITMENT_PERIOD.startDate} ~ {RECRUITMENT_PERIOD.endDate}
          </p>
          <Link
            href="/guide"
            className={cn([
              ...buttonStyle,
              'text-sky-900',
              'border-sky-900',
              'text-[1.25rem]',
              'px-[2rem]',
              'py-[0.625rem]',
              'hidden',
              'lg:inline',
            ])}
          >
            원서 접수 바로가기
          </Link>
        </div>
        <div
          className={cn(
            'h-full',
            'w-full',
            'lg:w-[43.5625rem]',
            'min-[600px]:w-full',
            'text-white',
          )}
        >
          <div
            className={cn(
              'grid',
              'grid-cols-1',
              'grid-rows-[repeat(3, auto)]',
              'smx:grid-cols-6',
              'smx:grid-rows-3',
              'gap-[0.75rem]',
              'min-h-[39rem]',
            )}
          >
            <div
              className={cn(
                'hidden',
                'smx:inline',
                'col-span-2',
                'row-span-1',
                'rounded-3xl',
                'bg-lime-400 p-6',
              )}
            >
              <div className={cn('flex', 'h-full', 'w-full', 'items-center', 'justify-center')}>
                <I.StarIcon />
              </div>
            </div>
            <div
              className={cn(
                'col-span-3',
                'smx:col-span-4',
                'row-span-1',
                'flex',
                'flex-col',
                'justify-between',
                'rounded-3xl',
                'p-6',
                'smx:bg-sky-800',
                'bg-[#92DA1A]',
              )}
            >
              <p
                className={cn(
                  'self-start',
                  'text-[1rem][1.75rem]',
                  'xs:text-xl',
                  'font-medium',
                  'text-white',
                )}
              >
                최종 합격하려면 중학교 내신 성적이
                <br /> 최소 몇 %가 되어야 할까?&nbsp; 🤷🏻‍♀️
              </p>
              <Link href="/faq" className={cn([...buttonStyle, 'self-end'])}>
                FAQ 바로가기
              </Link>
            </div>

            <div
              className={cn(
                'col-span-3',
                'row-span-1',
                'flex',
                'flex-col',
                'justify-between',
                'rounded-3xl',
                'bg-sky-400',
                'p-6',
              )}
            >
              <div>
                <p
                  className={cn(
                    'self-start',
                    'pt-[0.25rem]',
                    'text-[1rem][1.75rem]',
                    'xs:text-xl',
                    'font-medium',
                  )}
                >
                  여러 계정으로 로그인하는 방법 🚦
                </p>
                <p className={cn('font-400', 'self-start', 'text-sm')}>
                  여러 계정으로 로그인하는 방법을 알려드릴게요!
                </p>
              </div>
              <Link href="/faq?openIndex=0" className={cn([...buttonStyle, 'self-end'])}>
                바로가기
              </Link>
            </div>
            <div
              className={cn(
                'col-span-3',
                'row-span-1',
                'flex',
                'flex-col',
                'justify-between',
                'rounded-3xl',
                'p-6',
              )}
              style={{
                // eslint-disable-next-line quotes
                background: "url('/images/Pattern.png') center / 150% no-repeat",
              }}
            >
              <div>
                <p
                  className={cn('self-start', 'text-[1rem][1.75rem]', 'xs:text-xl', 'font-medium')}
                >
                  모의 성적 계산하기
                </p>
                <p className={cn('font-400', 'self-start', 'text-sm')}>
                  본격적인 원서 접수 전, 모의 성적을
                  <br />
                  계산해 보세요!
                </p>
              </div>
              {isServerHealthy && (
                <Link href="/oneseo/calculate" className={cn([...buttonStyle, 'self-end'])}>
                  바로가기
                </Link>
              )}
            </div>
            <div
              className={cn(
                'hidden',
                'smx:flex',
                'col-span-4',
                'row-span-1',
                'flex-col',
                'justify-between',
                'rounded-3xl',
                'bg-sky-800',
                'p-6',
              )}
            >
              <div>
                <I.Star3Icon />
                <p
                  className={cn(
                    'self-start',
                    'pt-[0.5rem]',
                    'text-xl',
                    'font-medium',
                    'text-white',
                  )}
                >
                  광주소프트웨어마이스터고등학교 🏫
                </p>
                <p
                  className={cn(
                    'font-400',
                    'self-start',
                    'pt-[1.9375rem]',
                    'text-sm',
                    'text-white',
                  )}
                >
                  인성과 감성으로 감동을 만드는 광주소프트웨어마이스터고등학교!
                  <br />
                  입학지원 서비스 Hello, GSM을 통해 지금 바로 지원해보세요!
                </p>
              </div>
            </div>
            <div
              className={cn(
                'col-span-2',
                'hidden',
                'smx:inline',
                'row-span-1',
                'rounded-3xl',
                'bg-lime-400',
                'p-6',
              )}
            >
              <div className={cn('flex', 'h-full', 'w-full', 'items-center', 'justify-center')}>
                <I.Star2Icon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section3;
