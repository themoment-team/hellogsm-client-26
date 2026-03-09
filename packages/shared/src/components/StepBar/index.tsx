'use client';

import { useRouter } from 'next/navigation';
import { StepEnum } from 'types';

import { StepCheckIcon, ProgressBarIcon } from 'shared/assets';
import { Button } from 'shared/components';
import { cn } from 'shared/lib/utils';

const steps = [StepEnum.ONE, StepEnum.TWO, StepEnum.THREE, StepEnum.FOUR] as const;

interface StepCircleType {
  step: string;
  isActive: boolean;
  isCompleted: boolean;
}

const StepCircle = ({ step, isActive, isCompleted }: StepCircleType) => {
  const isActiveOrCompleted = isActive || isCompleted;

  return (
    <div
      className={cn([
        'flex',
        'justify-center',
        'items-center',
        'w-[2rem]',
        'h-[2rem]',
        'rounded-full',
        'font-semibold',
        'text-body2',
        'transition-all',
        'duration-500',
        'transform',
        isActiveOrCompleted ? 'bg-blue-500 text-white' : 'border-[1px] text-slate-300',
      ])}
    >
      {isCompleted ? <StepCheckIcon /> : step}
    </div>
  );
};

interface StepBarType {
  baseUrl: string;
  handleCheckScoreButtonClick: () => void;
  step: StepEnum;
  isStepSuccess: {
    '1': boolean;
    '2': boolean;
    '3': boolean;
    '4': boolean;
  };
  handleStepError: (step: StepEnum) => void;
}

const StepBar = ({
  step,
  baseUrl,
  isStepSuccess,
  handleCheckScoreButtonClick,
  handleStepError,
}: StepBarType) => {
  const { push } = useRouter();

  const handleCheckNextStep = (step: StepEnum) => {
    if (!isStepSuccess[step]) return handleStepError(step);

    push(`${baseUrl}?step=${Number(step) + 1}`);
  };

  return (
    <>
      <div
        className={cn(
          'flex',
          'h-[4.25rem]',
          'px-[1.75rem]',
          'py-[1.125rem]',
          'justify-between',
          'items-center',
          'rounded-t-[1.125rem]',
          'bg-white',
          'border-solid',
          'border-b',
          'border-gray-100',
        )}
      >
        <div className={cn('flex', 'items-center', 'gap-[0.5rem]')}>
          {steps.map((value) => (
            <div key={value} className={cn('flex', 'items-center', 'gap-[0.5rem]')}>
              <StepCircle
                step={value}
                isActive={step === value}
                isCompleted={Number(step) > Number(value)}
              />
              {value !== StepEnum.FOUR && (
                <ProgressBarIcon color={Number(step) > Number(value) ? '#2563eb' : '#CBD5E1'} />
              )}
            </div>
          ))}
        </div>
        <div className={cn('flex', 'gap-[0.5rem]')}>
          {step !== StepEnum.ONE && (
            <Button variant="ghost" onClick={() => push(`${baseUrl}?step=${Number(step) - 1}`)}>
              이전
            </Button>
          )}

          {step === StepEnum.FOUR ? (
            <Button
              variant={step === StepEnum.FOUR && isStepSuccess[step] ? 'next' : 'submit'}
              onClick={
                isStepSuccess[step] ? handleCheckScoreButtonClick : () => handleCheckNextStep(step)
              }
            >
              내 성적 계산하기
            </Button>
          ) : (
            <Button
              variant={isStepSuccess[step] ? 'next' : 'submit'}
              onClick={() => handleCheckNextStep(step)}
            >
              다음으로
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default StepBar;
