import { Button } from '@repo/ui/shadcn';
import { cn } from '@repo/utils';

import { PrintIcon } from '@/assets';

interface PrintButtonProps {
  isPreview?: boolean;
}

const PrintButton = ({ isPreview = false }: PrintButtonProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      className={cn(
        'fixed',
        'bottom-10',
        'right-24',
        'z-10',
        'items-center',
        'gap-2',
        'print:hidden',
      )}
      onClick={handlePrint}
    >
      <PrintIcon />
      <p className={cn('text-[2.1vh]', 'font-bold', 'hover:text-white')}>
        {isPreview ? '미리보기 출력' : '인쇄하기'}
      </p>
    </Button>
  );
};

export default PrintButton;