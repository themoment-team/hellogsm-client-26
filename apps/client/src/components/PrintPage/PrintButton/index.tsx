import { Button } from 'shared';

import { PrintIcon } from 'shared/assets';
import { cn } from 'shared/lib/utils';

const PrintButton = () => {
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
      <p className={cn('text-[2.1vh]', 'font-bold', 'hover:text-white')}>인쇄하기</p>
    </Button>
  );
};

export default PrintButton;
