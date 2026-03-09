import { LoginButton } from 'shared/components';
import { cn } from 'shared/lib/utils';

const LoginDialogContent = () => {
  return (
    <div
      className={cn('w-fit', 'flex', 'pt-8', 'px-12', 'pb-10', 'flex-col', 'items-center', 'gap-8')}
    >
      <span className={cn('text-2xl', 'font-semibold', 'text-gray-900')}>로그인</span>
      <div className={cn('flex', 'flex-col', 'gap-3')}>
        <LoginButton variant="kakao">카카오로 시작하기</LoginButton>
        <LoginButton variant="google">Google 계정으로 시작하기</LoginButton>
      </div>
    </div>
  );
};

export default LoginDialogContent;
