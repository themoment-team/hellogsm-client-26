import { LoginButton } from 'shared/components';
import { CURRENT_YEAR } from 'shared/constants';
import { cn } from 'shared/lib/utils';

const Circle = () => <div className={cn('w-1.5', 'h-1.5', 'bg-sky-300', 'rounded-full')} />;

const LoginPage = () => (
  <main className={cn('flex', 'justify-center', 'w-dvw', 'h-dvh', 'bg-white', 'items-center')}>
    <div className={cn('flex', 'flex-col', 'gap-10', 'items-center')}>
      <div className={cn('flex', 'flex-col', 'gap-3', 'items-center', 'relative')}>
        <div className={cn('absolute', 'flex', 'gap-3.5', 'top-[-6px]', 'left-[186px]')}>
          <Circle />
          <Circle />
          <Circle />
        </div>
        <h1 className={cn('text-3xl', 'font-semibold', 'text-gray-700')}>
          {CURRENT_YEAR} <span className={cn('text-[#2563EB]')}>HELLO,GSM</span> ADMIN SERVICE
        </h1>

        <p className={cn('text-base', 'text-gray-800')}>
          광주소프트웨어마이스터고등학교 입학지원 서비스
        </p>
      </div>

      <LoginButton variant="google" isAdmin={true}>
        Google 계정으로 로그인
      </LoginButton>
    </div>
  </main>
);

export default LoginPage;
