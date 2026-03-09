'use client';

import { StepEnum } from 'types';

import { MouseIcon } from 'shared/assets';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  Button,
  DialogHeader,
} from 'shared/components';
import { cn } from 'shared/lib/utils';

interface ConfirmBarProps {
  handleTemporarySaveButtonClick: () => void;
  handleOneseoSubmitButtonClick: () => void;
  isStep4Success: boolean;
  isStep4: boolean;
  handleStepError: (step: StepEnum) => void;
}

interface FinalSubmitDialogProps {
  isStep4Success: boolean;
  isStep4: boolean;
  handleOneseoSubmitButtonClick: () => void;
  onInvalidClick: () => void;
}

const FinalSubmitDialog = ({
  isStep4Success,
  isStep4,
  handleOneseoSubmitButtonClick,
  onInvalidClick,
}: FinalSubmitDialogProps) => {
  const canOpen = isStep4 && isStep4Success;
  return (
    <Dialog>
      {canOpen ? (
        <DialogTrigger asChild>
          <Button variant="next" className={cn('flex', 'gap-2', 'items-center')}>
            <MouseIcon />
            <p>원서 최종 제출</p>
          </Button>
        </DialogTrigger>
      ) : (
        <Button
          variant="submit"
          className={cn('flex', 'gap-2', 'items-center')}
          onClick={onInvalidClick}
          aria-disabled
        >
          <MouseIcon />
          <p>원서 최종 제출</p>
        </Button>
      )}
      <DialogContent className={cn('bg-white')} showCloseIcon={false}>
        <DialogHeader>
          <DialogTitle>원서를 최종 제출 하시겠습니까?</DialogTitle>
          <DialogDescription>
            제출 후에는 정보를 수정할 수 없으니, 모든 정보가 맞는지 확인 후 제출해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className={cn('flex', 'justify-end', 'gap-2')}>
          <DialogClose asChild>
            <button
              className={cn(
                'bg-white',
                'px-4',
                'py-2',
                'text-[#0F172A]',
                'rounded-md',
                'border-[0.0625rem]',
                'border-slate-200',
                'font-semibold',
              )}
            >
              취소
            </button>
          </DialogClose>
          <DialogClose asChild>
            <button
              className={cn('px-4', 'py-2', 'rounded-md', 'text-white', 'bg-[#0F172A]')}
              type="submit"
              disabled={!isStep4Success}
              onClick={handleOneseoSubmitButtonClick}
            >
              최종 제출
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ConfirmBar = ({
  handleTemporarySaveButtonClick,
  handleOneseoSubmitButtonClick,
  isStep4Success,
  isStep4,
  handleStepError,
}: ConfirmBarProps) => {
  const handleCheckErrorStepFour = () => {
    handleStepError(StepEnum.FOUR);
  };
  return (
    <div
      className={cn(
        'w-full',
        'h-[5rem]',
        'bg-white',
        'border-t-solid',
        'border-t-[0.0625rem]',
        'border-gray-100',
        'px-[9rem]',
        'lg:px-[15rem]',
        'xl:px-[20rem]',
        'mdx:flex',
        'hidden',
        'justify-between',
        'items-center',
        'fixed',
        'bottom-0',
      )}
    >
      <div>
        <span className={cn('text-body1', 'text-blue-600')}>
          📎 최종 제출 후에는 정보를 수정할 수 없습니다. &nbsp;
        </span>
        <span className={cn('text-body1', 'text-slate-900')}>정확히 입력 후 제출해주세요!</span>
      </div>
      <div className={cn('flex', 'items-center', 'gap-[0.5rem]')}>
        <Button onClick={handleTemporarySaveButtonClick} variant="outline">
          임시저장
        </Button>
        <FinalSubmitDialog
          handleOneseoSubmitButtonClick={handleOneseoSubmitButtonClick}
          isStep4={isStep4}
          isStep4Success={isStep4Success}
          onInvalidClick={handleCheckErrorStepFour}
        />
      </div>
    </div>
  );
};

export default ConfirmBar;
