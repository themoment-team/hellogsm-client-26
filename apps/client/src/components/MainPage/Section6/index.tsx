import { cn } from '@repo/utils';

const Section6 = () => {
  return (
    <section
      className={cn(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'pb-20',
        'pt-10',
        'px-6',
        'bg-white',
        'gap-20',
      )}
    >
      <h2
        className={cn(
          'font-bold',
          'text-[1.25rem]/[2rem]',
          'xs:text-[1.5rem]/[2.25rem]',
          'sm:text-[2rem]/[3rem]',
          'break-keep',
          '[overflow-wrap:anywhere]',
          'text-balance',
          'text-[#292B2F]',
          'text-center',
        )}
      >
        광주소프트웨어마이스터고등학교에 대해 더 알아보고 싶다면?
        <br />
        학과 체험 신청 서비스{' '}
        <span className={cn('whitespace-nowrap')}>
          <span className={cn('text-[#4A80F8]')}>Ready, GSM</span>도 있습니다
        </span>
      </h2>
      <a
        href="https://www.ready.hellogsm.kr/"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'px-5',
          'py-3',
          'bg-[#4A80F8]',
          'text-white',
          'font-semibold',
          'rounded-[6.1875rem]',
          'hover:bg-[#3a6bc8]',
          'max-w-[23.75rem]',
          'w-full',
          'text-center',
          'text-[18px]',
          'leading-[1.575rem]',
        )}
      >
        Ready, GSM으로 이동하기
      </a>
    </section>
  );
};

export default Section6;
