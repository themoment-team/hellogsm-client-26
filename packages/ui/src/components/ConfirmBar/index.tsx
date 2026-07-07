'use client';

import { StepEnum } from '@repo/types';
import { cn } from '@repo/utils';

import { MouseIcon } from '../../icons';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../shadcn';

interface ConfirmBarProps {
  handleTemporarySaveButtonClick: () => void;
  handleOneseoSubmitButtonClick: () => void;
  isStep4Success: boolean;
  isStep4: boolean;
  handleStepError: (step: StepEnum) => void;
  isModifyApproved?: boolean;
}

interface FinalSubmitDialogProps {
  isStep4Success: boolean;
  isStep4: boolean;
  handleOneseoSubmitButtonClick: () => void;
  onInvalidClick: () => void;
  isModifyApproved?: boolean;
}

const FinalSubmitDialog = ({
  isStep4Success,
  isStep4,
  handleOneseoSubmitButtonClick,
  onInvalidClick,
  isModifyApproved,
}: FinalSubmitDialogProps) => {
  const canOpen = isStep4 && isStep4Success;
  const buttonText = isModifyApproved ? '원서 수정' : '원서 최종 제출';

  return (
    <Dialog>
      {canOpen ? (
        <DialogTrigger asChild>
          <Button variant="next" className={cn('flex', 'gap-2', 'items-center')}>
            <MouseIcon />
            <p>{buttonText}</p>
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
          <p>{buttonText}</p>
        </Button>
      )}
      <DialogContent className={cn('bg-white')} showCloseIcon={false}>
        <DialogHeader>
          <DialogTitle>
            {isModifyApproved ? '원서를 수정 하시겠습니까?' : '원서를 최종 제출 하시겠습니까?'}
          </DialogTitle>
          <DialogDescription>
            {isModifyApproved
              ? '원서 수정은 관리자 승인 후에만 가능합니다. 추후에 다시 수정하기 어려울 수 있으니, 모든 정보가 맞는지 확인하신 후 수정해주세요.'
              : '제출 후에는 정보를 수정할 수 없으니, 모든 정보가 맞는지 확인 후 제출해주세요.'}
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
              {isModifyApproved ? '수정 완료' : '최종 제출'}
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
  isModifyApproved,
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
          📎{' '}
          {isModifyApproved
            ? '원서 제출 기간 이후에는 정보를 수정할 수 없습니다.'
            : '최종 제출 후에는 정보를 수정할 수 없습니다.'}
          &nbsp;
        </span>
        <span className={cn('text-body1', 'text-slate-900')}>
          정확히 입력 후 {isModifyApproved ? '수정' : '제출'}해주세요!
        </span>
      </div>
      <div className={cn('flex', 'items-center', 'gap-[0.5rem]')}>
        <Button onClick={handleTemporarySaveButtonClick} variant="prev">
          임시저장
        </Button>
        <FinalSubmitDialog
          handleOneseoSubmitButtonClick={handleOneseoSubmitButtonClick}
          isStep4={isStep4}
          isStep4Success={isStep4Success}
          onInvalidClick={handleCheckErrorStepFour}
          isModifyApproved={isModifyApproved}
        />
      </div>
    </div>
  );
};

export default ConfirmBar;
