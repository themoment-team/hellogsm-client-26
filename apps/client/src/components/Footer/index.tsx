import { FooterGSMLogo } from 'client/assets';

import { CURRENT_YEAR } from 'shared/constants';
import { cn } from 'shared/lib/utils';

const LINKS = [
  {
    text: '개인정보처리방침',
    link: 'https://official.hellogsm.kr/policy/privacy',
  },
  {
    text: '영상정보처리기기운영·관리방침',
    link: 'https://official.hellogsm.kr/policy/cctv',
  },
  {
    text: '저작권신고 및 보호규정',
    link: 'https://official.hellogsm.kr/policy/copyright',
  },
  {
    text: '찾아오시는 길',
    link: 'https://official.hellogsm.kr/about/location',
  },
] as const;

const Footer = () => {
  return (
    <footer
      className={cn(
        'bg-gray-100',
        'py-15',
        'relative',
        'flex',
        'items-center',
        'justify-center',
        'p-15',
        'lg:px-[6.25rem]',
        'xl:px-[15.25rem]',
        'fhd:px-80',
        'w-full',
      )}
    >
      <div
        className={cn(
          'flex',
          'w-full',
          'gap-10',
          'md:gap-2',
          'justify-between',
          'items-start',
          'md:flex-row',
          'flex-col',
        )}
      >
        <FooterGSMLogo />
        <div className={cn('flex', 'flex-col', 'items-start', 'gap-16')}>
          <div className={cn('flex', 'flex-col', 'items-start', 'gap-2', 'text-white')}>
            <p
              className={cn(
                'w-full',
                'text-[1.125rem]',
                'text-left',
                'text-left',
                'md:text-right',
                'font-normal',
                'text-slate-600',
              )}
            >
              ©{CURRENT_YEAR} Copyright 광주소프트웨어마이스터고등학교 &nbsp;
              <br className={cn('sm:hidden')} />
              ALL RIGHTS RESERVED.
            </p>
            <div className={cn('flex', 'gap-2', 'md:flex-row', 'flex-col', 'md:gap-6')}>
              {LINKS.map(({ text, link }) => (
                <a
                  key={text}
                  href={link}
                  className={cn('text-[1.125rem]/[1.6875rem]', 'font-bold', 'text-slate-600')}
                  target="_blank"
                  rel="noreferrer"
                >
                  {text}
                </a>
              ))}
            </div>
          </div>
          <p
            className={cn(
              'w-full',
              'text-left',
              'font-normal',
              'text-[0.875rem]/[1.25rem]',
              'text-slate-400',
              'md:block',
              'md:text-right',
            )}
          >
            우) 62423 광주광역시 광산구 상무대로 312
            <br />
            교무실 062)949-6842(08:30~16:30) 행정실 062)949-6806(08:30~16:30)
            <br />
            팩스 062)949-6877 당직실 062)949-6899(평일야간, 휴일)
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
