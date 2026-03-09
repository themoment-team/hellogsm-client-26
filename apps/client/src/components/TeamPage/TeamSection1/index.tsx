'use client';

import Image from 'next/image';

import { BottomArrow, SmallTheMomentIcon } from 'client/assets';

import { cn } from 'shared/lib/utils';
import { scrollToElement } from 'shared/utils';

const TeamSection1 = () => {
  const scrollToSection2 = () => {
    scrollToElement('#section2');
  };
  return (
    <div className={cn('relative', 'w-full', 'h-[calc(100vh-4.625rem)]')}>
      <div
        className={cn(
          'relative',
          'w-full',
          'h-full',
          'overflow-hidden',
          'bg-[rgba(0,0,0,0.80)]',
          'brightness-75',
        )}
      >
        <Image
          src={'/images/TheMomentPicture.png'}
          layout="fill"
          objectFit="cover"
          alt="hello"
          className={cn('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'blur-[12px]')}
        />
      </div>
      <div
        className={cn(
          'absolute',
          'inset-0',
          'w-full',
          'h-full',
          'flex',
          'justify-center',
          'items-center',
          'text-center',
        )}
      >
        <div
          className={cn(
            'absolute',
            'top-1/2',
            'transform',
            '-translate-y-[calc(50%+8.5rem)]',
            'flex',
            'flex-col',
            'justify-center',
            'items-center',
          )}
        >
          <div
            className={cn(
              'flex',
              'justify-center',
              'items-center',
              'w-[4.25rem]',
              'h-[4.25rem]',
              'drop-shadow-lg',
            )}
          >
            <SmallTheMomentIcon />
          </div>
          <p className={cn('text-[2.1875rem]', 'leading-normal', 'font-medium', 'text-white')}>
            the_moment
          </p>
        </div>

        <div className={cn('flex', 'flex-col', 'justify-center', 'items-center', 'gap-5')}>
          <p
            className={cn(
              'smx:text-[5.625rem]',
              'sm:text-[3.5rem]',
              'xs:text-[3rem]',
              'text-[2.35rem]',
              'leading-normal',
              'font-bold',
              'text-white',
            )}
          >
            순간의 가치를 비춰내다.
          </p>
        </div>
        <div
          className={cn(
            'absolute',
            'bottom-14',
            'gap-1',
            'z-[3]',
            'flex',
            'flex-col',
            'items-center',
          )}
        >
          <p
            onClick={scrollToSection2}
            className={cn('text-lg', 'text-2xl', 'text-white', 'cursor-pointer')}
          >
            스크롤 해서 더 알아보기
          </p>
          <div onClick={scrollToSection2} className={cn('animate-bounce', 'cursor-pointer')}>
            <BottomArrow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSection1;
