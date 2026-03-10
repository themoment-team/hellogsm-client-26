import * as I from 'shared/assets';
import { Button, LoginDialogContent } from 'shared/components';
import { Dialog, DialogContent, DialogTrigger } from 'shared/components';
import { cn } from 'shared/lib/utils';

interface LoginDialogProps {
  variant?: 'pc' | 'mobile';
}

const LoginDialog = ({ variant = 'pc' }: LoginDialogProps) => {
  const isPC = variant === 'pc';

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isPC ? (
          <Button variant="blue">로그인</Button>
        ) : (
          <button
            className={cn(
              'flex',
              'items-center',
              'gap-4',
              'text-[1.5rem]',
              'font-bold',
              'leading-normal',
              'text-slate-500',
            )}
          >
            <I.LoginIcon /> 로그인
          </button>
        )}
      </DialogTrigger>
      <DialogContent className={cn('w-fit', 'p-0', '!rounded-[20px]')}>
        <LoginDialogContent />
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
