import Image from 'next/image';

import { BlurIcon } from 'client/assets';

import { Button, Dialog, DialogContent, DialogTitle } from 'shared/components';
import { NEXT_YEAR } from 'shared/constants';
import { cn } from 'shared/lib/utils';

interface TestResultProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenPassResultDialog: () => void;
  isFinishFirstTest: boolean;
}

const TestResultDialog = ({
  isOpen,
  setIsOpen,
  onOpenPassResultDialog,
  isFinishFirstTest,
}: TestResultProps) => {
  const buttonStyle = ['w-[10.625rem]', 'h-[3.25rem]', 'text-[1rem]/[1.5rem]', 'font-semibold'];
  return (
    <Dialog open={isOpen}>
      <DialogTitle />
      <DialogContent
        className={cn('w-[400px]', 'h-[460px]', 'p-0', '!rounded-[20px]')}
        onClose={() => setIsOpen(false)}
      >
        <div
          className={cn(
            'relative',
            'flex',
            'flex-col',
            'justify-center',
            'items-center',
            'gap-4',
            'mt-4',
          )}
        >
          <div className={cn('relative')}>
            <Image
              src={isFinishFirstTest ? '/images/TestResultImg1.png' : '/images/TestResultImg2.png'}
              width={156}
              height={156}
              alt="hello"
              className={cn('relative', 'z-10')}
            />
            <div className={cn('absolute', '-top-[20px]', 'left-[25px]')}>
              <BlurIcon color="#A8E3FF" />
            </div>
            <div className={cn('absolute', '-top-[50px]', 'right-0')}>
              <BlurIcon color="#FCFFAB" />
            </div>
            <div className={cn('absolute', '-bottom-[100px]', 'left-[50px]', '-translate-x-1/2')}>
              <BlurIcon color="#6BB6FF" />
            </div>
          </div>
          <div
            className={cn(
              'flex',
              'flex-col',
              'justify-center',
              'items-center',
              'gap-1',
              'mt-10',
              'mb-2',
            )}
          >
            <h1 className={cn('text-[1.5rem]/[2rem]', 'font-semibold')}>
              {isFinishFirstTest ? '1차 서류 합격자 ' : '최종 합격자 '}
              안내
            </h1>
            <p
              className={cn('text-gray-500', 'text-[1rem]/[1.5rem]', 'font-medium', 'text-center')}
            >
              {NEXT_YEAR}학년도 광주소프트웨어마이스터고등학교
              <br />
              {isFinishFirstTest === null ? '1차 서류 합격 ' : '최종 합격자 '}
              결과를 확인해보세요!
            </p>
          </div>
          <div className={cn('flex', 'justify-center', 'gap-4')}>
            <Button
              variant="reverseFill"
              className={cn([...buttonStyle])}
              onClick={() => {
                const today = new Date().toDateString();
                localStorage.setItem('hideTestResultDialog', today);
                setIsOpen(false);
              }}
            >
              오늘 하루 그만보기
            </Button>
            <Button
              variant="fill"
              className={cn([...buttonStyle])}
              onClick={() => {
                setIsOpen(false);
                onOpenPassResultDialog();
              }}
            >
              확인하러 가기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestResultDialog;
