'use client';

import Image from 'next/image';

import { cn } from 'shared/lib/utils';

import type { MemberPageData } from 'types';

const GITHUB_URL = 'https://github.com';

const roleColors: Record<string, string> = {
  Server: 'text-orange-500',
  Frontend: 'text-sky-600',
  Design: 'text-pink-600',
  DevOps: 'text-teal-500',
};

interface MemberCardProps {
  githubId: string;
  name: string;
  role: string;
}

const MemberCard = ({ githubId, name, role }: MemberCardProps) => {
  return (
    <a
      href={`${GITHUB_URL}/${githubId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex',
        'items-center',
        'w-[18.4375rem]',
        'h-[7rem]',
        'rounded-xl',
        'border',
        'border-[#B2B2B2]',
        'bg-white',
        'p-5',
        'gap-1',
        'space-x-4',
        'flex-shrink-0',
        'cursor-pointer',
      )}
    >
      <Image
        src={`${GITHUB_URL}/${githubId}.png`}
        width={72}
        height={72}
        alt={name}
        className={cn('rounded-full')}
      />
      <div>
        <p className={cn('text-[1.5rem]/[2rem]', 'font-medium')}>{name}</p>
        <p className={cn(['text-[1.375rem]/[1.75rem]', 'font-normal', roleColors[role]])}>{role}</p>
      </div>
    </a>
  );
};

interface TeamSection4Props {
  data: MemberPageData[];
}

const TeamSection4 = ({ data }: TeamSection4Props) => {
  const itemWidth = 18.4375;
  const itemSpacing = 1;

  const totalItemWidth = data.length * itemWidth;
  const totalSpacingWidth = (data.length - 1) * itemSpacing;
  const totalWidth = totalItemWidth + totalSpacingWidth;

  const memberListDoubled = [...data, ...data];

  return (
    <div
      className={cn(
        'flex',
        'flex-col',
        'overflow-hidden',
        'w-full',
        'bg-white',
        'py-[15rem]',
        'items-center',
        'gap-[6.25rem]',
      )}
    >
      <h3
        className={cn(
          'text-[#0F0921]',
          'xs:text-[2.75rem]/[3.85rem]',
          'text-[1.75rem]/[2.75rem]',
          'font-bold',
          'text-center',
        )}
      >
        &quot;입학지원 서비스, <br className={cn('block', 'sm:hidden')} />
        누가 만들었을까요?&quot;
      </h3>
      <div className={cn('flex', 'flex-col', 'relative', 'w-full', 'overflow-hidden', 'gap-6')}>
        <div
          className={cn('flex', 'space-x-4', 'whitespace-nowrap')}
          style={{
            width: `${totalWidth * 2}rem`,
            animation: 'scrollRight 25s linear infinite',
          }}
        >
          {memberListDoubled.map((member, index) => (
            <MemberCard
              key={index}
              githubId={member.properties.githubId.rich_text[0].plain_text}
              name={member.properties.name.title[0].plain_text}
              role={member.properties.role.rich_text[0].plain_text}
            />
          ))}
        </div>
        <div
          className={cn('flex', 'space-x-4', 'whitespace-nowrap')}
          style={{
            width: `${totalWidth * 2}rem`,
            animation: 'scrollLeft 25s linear infinite',
          }}
        >
          {memberListDoubled.map((member, index) => (
            <MemberCard
              key={index}
              githubId={member.properties.githubId.rich_text[0]?.plain_text}
              name={member.properties.name.title[0]?.plain_text}
              role={member.properties.role.rich_text[0]?.plain_text}
            />
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes scrollRight {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${totalWidth + 1}rem);
          }
        }
        @keyframes scrollLeft {
          0% {
            transform: translateX(-${totalWidth + 1}rem);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TeamSection4;
