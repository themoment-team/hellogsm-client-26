'use client';

import { useEffect, useState } from 'react';

import { Button, Dialog, DialogContent, DialogDescription, DialogTitle } from '@repo/ui/shadcn';
import { cn } from '@repo/utils';

const HIDE_KEY = 'hideTuberculosisTestNoticeDialog';

interface TuberculosisTestNoticeDialogProps {
  isFinalPass: boolean;
  /** 다른 모달이 열려 있는 동안 true — 모달이 겹치지 않도록 그 모달이 닫힌 뒤에 연다 */
  isWaiting?: boolean;
}

const TuberculosisTestNoticeDialog = ({
  isFinalPass,
  isWaiting = false,
}: TuberculosisTestNoticeDialogProps) => {
  // 오늘 숨김 여부는 마운트 전엔 알 수 없으므로 숨김으로 시작해 깜빡임을 막는다
  const [isHiddenToday, setIsHiddenToday] = useState<boolean>(true);
  const [isClosed, setIsClosed] = useState<boolean>(false);

  useEffect(() => {
    // localStorage는 클라이언트 전용 값 — hydration 불일치를 막기 위해 마운트 후 반영
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHiddenToday(localStorage.getItem(HIDE_KEY) === new Date().toDateString());
  }, []);

  // 내 정보 페이지는 합격 결과를 클라이언트에서 받아오므로, 결과가 도착하면 그때 열린다
  const isOpen = isFinalPass && !isWaiting && !isHiddenToday && !isClosed;

  const close = () => setIsClosed(true);

  const buttonStyle = ['flex-1', 'h-[3.25rem]', 'text-[1rem]/[1.5rem]', 'font-semibold'];

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className={cn('w-[calc(100%-2rem)]', 'max-w-[440px]', 'gap-6', 'p-7', '!rounded-[20px]')}
        onClose={close}
        onEscapeKeyDown={close}
      >
        <DialogTitle className={cn('pr-8', 'text-[1.25rem]/[1.75rem]', 'font-semibold')}>
          건강검진 결핵검사 안내
        </DialogTitle>
        <DialogDescription
          asChild
          className={cn('text-gray-700', 'text-[1rem]/[1.625rem]', 'font-medium')}
        >
          <div className={cn('flex', 'flex-col', 'gap-3', 'break-keep')}>
            <p>
              건강검진 항목 중 결핵검사는{' '}
              <strong className={cn('text-sky-600', 'font-semibold')}>흉부 X-ray 검사</strong>로
              실시하시면 됩니다.
            </p>
            <p>흉부 X-ray 검사가 활동성 결핵(전염성이 있는 상태인지 여부) 검사입니다.</p>
            <p>잠복결핵 검사(혈액검사)는 해당하지 않습니다.</p>
          </div>
        </DialogDescription>
        <div className={cn('flex', 'gap-3')}>
          <Button
            variant="reverseFill"
            className={cn([...buttonStyle])}
            onClick={() => {
              localStorage.setItem(HIDE_KEY, new Date().toDateString());
              close();
            }}
          >
            오늘 하루 그만보기
          </Button>
          <Button variant="fill" className={cn([...buttonStyle])} onClick={close}>
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TuberculosisTestNoticeDialog;
