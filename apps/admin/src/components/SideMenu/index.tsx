'use client';

import { PropsWithChildren } from 'react';

import { useLogout } from 'api';
import { Button } from 'shared';
import { TestResultType } from 'types';

import { ChevronsLeft, Puzzle, Exit } from 'admin/assets';

import { cn } from 'shared/lib/utils';

const Item = ({ children }: PropsWithChildren) => (
  <div
    className={cn(
      'flex',
      'gap-2',
      'py-2',
      'px-3',
      'items-center',
      'text-sm',
      'font-semibold',
      'leading-5',
    )}
  >
    {children}
  </div>
);

interface SubItemProps extends PropsWithChildren {
  isSelected: boolean;
  circleClassName: string;
  textClassName: string;
  onClick: () => void;
}

const SubItem = ({
  children,
  onClick,
  isSelected,
  circleClassName,
  textClassName,
}: SubItemProps) => (
  <div
    onClick={onClick}
    className={cn('flex', 'gap-2', 'py-2', 'px-3', 'items-center', 'pl-10', 'cursor-pointer')}
  >
    <div
      className={cn(['w-2', 'h-2', 'rounded-full', 'border-solid', 'border-2', circleClassName])}
    />
    <span
      className={cn([
        'font-normal',
        'text-sm',
        'leading-5',
        'text-gray-400',
        isSelected && textClassName,
      ])}
    >
      {children}
    </span>
  </div>
);

const ManageTypeArray = [
  {
    borderStyle: 'border-blue-600',
    textStyle: 'text-blue-900',
    type: '전체 지원자 관리',
    value: 'ALL',
  },
  {
    borderStyle: 'border-amber-300',
    textStyle: 'text-amber-600',
    type: '1차 전형 합격자 관리',
    value: 'FIRST_PASS',
  },
  {
    borderStyle: 'border-green-500',
    textStyle: 'text-green-800',
    type: '최종 합격자 관리',
    value: 'FINAL_PASS',
  },
  {
    borderStyle: 'border-rose-500',
    textStyle: 'text-rose-800',
    type: '불합격자 관리',
    value: 'FALL',
  },
] as const;

interface SideMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  testResultTag: TestResultType;
  setTestResultTag: React.Dispatch<React.SetStateAction<TestResultType>>;
}

const SideMenu = ({ isOpen, setIsOpen, testResultTag, setTestResultTag }: SideMenuProps) => {
  const handleLogoutClick = useLogout('admin');

  return (
    <aside
      className={cn([
        'w-60',
        'h-dvh',
        'border-r-gray-30',
        'border-r',
        'border-solid',
        'py-8',
        'px-4',
        'bg-white',
        'flex',
        'flex-col',
        'justify-between',
        'fixed',
        !isOpen && 'translate-x-[-200px]',
        'ease-in-out',
        'duration-150',
        'transition-all',
        'left-0',
        'top-0',
      ])}
    >
      <div className={cn('flex', 'flex-col', 'gap-10')}>
        <div className={cn('flex', 'w-full', 'justify-between')}>
          <span className={cn('text-gray-80', 'text-base', 'font-semibold')}>
            HELLO <span className={cn('text-[#2563EB]')}>ADMIN!</span>
          </span>
          <div
            className={cn(['cursor-pointer', !isOpen && 'scale-x-[-1]'])}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <ChevronsLeft />
          </div>
        </div>

        <div className={cn('flex', 'flex-col', 'gap-2')}>
          <Item>
            <Puzzle />
            지원자관리
          </Item>
          <div>
            {ManageTypeArray.map(({ borderStyle, type, value, textStyle }) => (
              <SubItem
                key={type}
                isSelected={testResultTag === value}
                onClick={() => setTestResultTag(value)}
                circleClassName={borderStyle}
                textClassName={textStyle}
              >
                {type}
              </SubItem>
            ))}
          </div>
        </div>
      </div>
      <Button onClick={handleLogoutClick} variant="ghost" className={cn('justify-start', 'p-0')}>
        <Item>
          <Exit />
          로그아웃
        </Item>
      </Button>
    </aside>
  );
};

export default SideMenu;
