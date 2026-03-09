'use client';

import { useRouter } from 'next/navigation';
import { StepEnum } from 'types';

import { EditCheckIcon } from 'shared/assets';
import { Button } from 'shared/index';
import { cn } from 'shared/lib/utils';

interface EditBarProps {
  isStep4: boolean;
  isStep4Success: boolean;
  handleOneseoEditButtonClick: () => void;
  handleStepError: (step: StepEnum) => void;
}

const EditBar = ({
  isStep4,
  isStep4Success,
  handleOneseoEditButtonClick,
  handleStepError,
}: EditBarProps) => {
  const { push } = useRouter();

  const handleCheckErrorStepFour = () => {
    handleStepError(StepEnum.FOUR);
  };

  return (
    <div
      className={cn(
        'w-full',
        'h-20',
        'flex',
        'justify-end',
        'px-80',
        'bg-white',
        'fixed',
        'bottom-0',
        'items-center',
        'border-t-[0.0625rem]',
        'border-gray-100',
        'gap-2',
      )}
    >
      <Button variant="outline" onClick={() => push('/')}>
        홈으로
      </Button>
      {isStep4 && (
        <Button
          variant={!isStep4Success ? 'submit' : 'fill'}
          onClick={!isStep4Success ? handleCheckErrorStepFour : handleOneseoEditButtonClick}
          className={cn(
            'px-4',
            'py-2',
            'flex',
            'gap-2',
            'text-sm',
            'font-normal',
            'font-semibold',
            'leading-3',
            'rounded-md',
            'items-center',
            'h-10',
          )}
        >
          <EditCheckIcon />
          원서 수정 완료
        </Button>
      )}
    </div>
  );
};

export default EditBar;
