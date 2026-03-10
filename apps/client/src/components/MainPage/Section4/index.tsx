'use client';

import { cn } from 'shared/lib/utils';

const TITLES = [
  {
    firstText: 'AI 시대를 선도할',
    lastText: 'GSM 교육과정 운영',
    icon: '🎯',
  },
  {
    firstText: '직업군에 최적화된',
    lastText: '취업역량 강화',
    icon: '💪',
  },
  {
    firstText: '산업수요 변화에 맞춘',
    lastText: '현장실무능력 향상',
    icon: '💡',
  },
  {
    firstText: '자율성과 자기 주도성으로',
    lastText: '학습 능력 신장',
    icon: '🚀',
  },
] as const;

interface DotProps {
  color: string;
}

const textStyle = [
  'text-[#0C4A6E]',
  'font-[600]',
  'text-[1.25rem]/[1.25rem]',
  'xs:text-[1.5rem]/[2rem]',
  'sm:text-[2rem]/[2.5rem]',
];

const Dot = ({ color }: DotProps) => (
  <div
    className={cn('w-[0.25rem]', 'h-[0.25rem]', 'rounded-full', 'sm:w-[0.5rem]', 'sm:h-[0.5rem]')}
    style={{ backgroundColor: color }}
  />
);

interface DotWithTextProps {
  color: string;
  text: string;
  textColor: string;
}

const DotWithText = ({ color, text, textColor }: DotWithTextProps) => (
  <div className={cn('flex', 'flex-col', 'items-center')}>
    <div className={cn('flex', 'w-full', 'justify-around')}>
      <Dot color={color} />
      <Dot color={color} />
    </div>
    <p
      className={cn([
        textColor,
        'text-[1.25rem]/[1.25rem]',
        'xs:text-[1.5rem]/[2rem]',
        'sm:text-[2rem]/[2.5rem]',
        'font-[600]',
      ])}
    >
      {text}
    </p>
  </div>
);

interface TitleCardProps {
  firstText: string;
  lastText: string;
  icon: string;
}

const TitleCard = ({ firstText, lastText, icon }: TitleCardProps) => (
  <div
    className={cn(
      'flex',
      'pt-[2rem]',
      'pb-[1.5rem]',
      'px-[1.5rem]',
      'flex-col',
      'justify-end',
      'rounded-[1rem]',
      'shadow-lg',
      'gap-[1.8125rem]',
      'w-[30rem]',
      'sm:w-[25.1875rem]',
      'md:w-[20rem]',
      'bg-white',
    )}
  >
    <div className={cn('flex', 'w-[16.4375rem]', 'flex-col', 'items-start')}>
      <p className={cn('text-sky-800', 'font-[600]', 'text-[1.5rem]/[2.25rem]')}>
        {firstText}
        <br />
        {lastText}
      </p>
    </div>
    <p className={cn('text-right', 'text-[4.25rem]/[5.95rem]', 'font-[600]')}>{icon}</p>
  </div>
);

const Section4 = () => {
  return (
    <section
      className={cn(
        'gap-[3.75rem]',
        'flex',
        'items-center',
        'flex-col',
        'bg-[#F5F9FB]',
        'py-[11.25rem]',
        'w-full',
      )}
    >
      <div className={cn('flex', 'flex-col', 'items-center', 'w-full')}>
        <div className={cn('flex', 'items-end')}>
          <DotWithText color="#84CC16" text="인성" textColor="text-[#84CC16]" />
          <p className={cn([...textStyle])}>과 &nbsp;</p>
          <DotWithText color="#84CC16" text="감성" textColor="text-[#84CC16]" />
          <p className={cn([...textStyle])}>으로 &nbsp;</p>
          <DotWithText color="#38BDF8" text="감동" textColor="text-[#38BDF8]" />
          <p className={cn([...textStyle])}>을 만드는</p>
        </div>
        <p className={cn([...textStyle])}>광주소프트웨어마이스터고등학교</p>
      </div>
      <div
        className={cn(
          'flex',
          'flex-wrap',
          'w-full',
          'items-center',
          'gap-[0.75rem]',
          'justify-center',
          'px-4',
          'xs:px-[3.75rem]',
        )}
      >
        {TITLES.map(({ firstText, lastText, icon }) => (
          <TitleCard key={firstText} firstText={firstText} lastText={lastText} icon={icon} />
        ))}
      </div>
    </section>
  );
};

export default Section4;
