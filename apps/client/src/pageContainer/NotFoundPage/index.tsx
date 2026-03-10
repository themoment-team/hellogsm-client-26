'use client';

import { useRouter } from 'next/navigation';

import { BackIcon, NotFoundFourIcon, NotFoundZeroIcon } from 'client/assets';
import { Footer } from 'client/components';

import { cn } from 'shared/lib/utils';

const NotFoundPage = () => {
  const { back } = useRouter();
  const squares = [
    { bgColor: 'bg-sky-300', rotate: 'rotate-[125deg]' },
    { bgColor: 'bg-sky-800', rotate: 'rotate-[-24.201deg]' },
    { bgColor: 'bg-lime-400', rotate: 'rotate-[22.536deg]' },
  ];

  return (
    <>
      <div
        className={cn(
          'flex',
          'h-[calc(100vh-4.625rem)]',
          'align-center',
          'justify-center',
          'bg-white',
          'flex-col',
          'gap-10',
        )}
      >
        <div className={cn('flex', 'justify-center', 'items-center', 'relative')}>
          <div>
            <NotFoundFourIcon color="#A3E635" />
          </div>

          <div className={cn('-ml-2')}>
            <NotFoundZeroIcon />
          </div>

          <div className={cn('-ml-2', 'relative')}>
            <NotFoundFourIcon color="#075985" />

            <div className={cn('absolute', 'flex', 'gap-5', 'bottom-[1px]', 'left-full')}>
              {squares.map((square, index) => (
                <div
                  key={index}
                  className={cn([
                    'w-[0.9375rem]',
                    'h-[0.9375rem]',
                    'rounded',
                    square.bgColor,
                    square.rotate,
                  ])}
                />
              ))}
            </div>
          </div>
        </div>
        <div className={cn('flex', 'justify-center', 'items-center')}>
          <div className={cn('flex', 'flex-col', 'items-center', 'gap-[1.5rem]')}>
            <div className={cn('flex', 'flex-col', 'items-center', 'gap-3')}>
              <p className={cn('text-gray-900', 'text-[1.875rem]/[2.25rem]', 'font-semibold')}>
                페이지를 찾을 수 없음
              </p>
              <p className={cn('text-gray-500', 'text-[1.25rem]/[1.75rem]', 'font-normal')}>
                입력하신 페이지의 주소가 정확한지 다시 한번 확인해 주세요.
              </p>
            </div>
            <button
              className={cn(
                'flex',
                'px-5',
                'py-2',
                'justify-center',
                'items-center',
                'gap-2',
                'rounded-[3rem]',
                'border',
                'border-slate-500',
                'text-slate-500',
                'text-[1rem]/[1.75rem]',
                'font-normal',
              )}
              onClick={() => back()}
            >
              <BackIcon />
              돌아가기
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFoundPage;
