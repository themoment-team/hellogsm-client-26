import { UseFormSetValue } from 'react-hook-form';
import { LiberalSystemValueEnum, Step4FormType } from 'types';

import { cn } from 'shared/lib/utils';

interface LiberalSystemSwitchProps {
  isFreeGrade: boolean;
  isFreeSemester: boolean;
  setValue: UseFormSetValue<Step4FormType>;
  className?: string;
}

const buttonStyle = (isMyLiberalSystem: boolean) => [
  'px-[0.75rem]',
  'py-[0.375rem]',
  'rounded-[0.1875rem]',
  'text-sm',
  'font-medium',
  'leading-5',
  ...(isMyLiberalSystem ? ['bg-white', 'text-slate-900'] : ['bg-slate-100', 'text-slate-700']),
];

const LiberalSystemSwitch = ({
  isFreeGrade,
  isFreeSemester,
  setValue,
  className,
}: LiberalSystemSwitchProps) => (
  <div
    id="generalSubject"
    className={cn([
      'bg-slate-100',
      'subtle-medium',
      'p-[0.3125rem]',
      'flex',
      'rounded-md',
      'w-fit',
      className,
    ])}
  >
    <button
      type="button"
      onClick={() => setValue('liberalSystem', LiberalSystemValueEnum.FREE_GRADE)}
      className={cn(...buttonStyle(isFreeGrade))}
    >
      자유학년제
    </button>
    <button
      type="button"
      onClick={() => setValue('liberalSystem', LiberalSystemValueEnum.FREE_SEMESTER)}
      className={cn(...buttonStyle(isFreeSemester))}
    >
      자유학기제
    </button>
  </div>
);

export default LiberalSystemSwitch;
