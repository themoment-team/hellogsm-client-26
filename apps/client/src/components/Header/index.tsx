'use client';

import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { memberQueryKeys } from 'api';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LoginDialog } from 'shared';

import * as I from 'client/assets';
import { ActiveLink } from 'client/components';

import { cn } from 'shared/lib/utils';

import { useGetMyAuthInfo, useGetMyMemberInfo, useLogout } from 'api/hooks';

const activeStyle = [
  'text-gray-900',
  'after:w-6',
  'after:bg-sky-300',
  'after:content-[""]',
  'after:absolute',
  'after:bottom-[-4px]',
  'after:w-5',
  'after:h-1',
  'after:left-1/2',
  'after:translate-x-[-50%]',
  'after:rounded-lg',
];

const activeTextStyle = ['relative', 'text-[0.875rem]/[1.5rem]', 'md:text-[1.125rem]/[1.75rem]'];

const loginLinkStyle = [
  'flex',
  'gap-x-1',
  'text-gray-600',
  'font-[600]',
  'text-lg',
  'items-center',
];

const modalBtnStyle = [
  'flex',
  'py-2',
  'pl-[0.75rem]',
  'justify-center',
  'items-center',
  'gap-2',
  'text-slate-700',
  ...activeTextStyle,
];

interface HeaderProps {
  isServerHealthy: boolean;
}

interface NavProps {
  links: Array<{ href: string; label: string }>;
  isRegisterPath: boolean;
}

interface MobileNavProps {
  links: Array<{ href: string; label: string; icon: React.ComponentType<any> }>;
  isRegisterPath: boolean;
  hoveredLink: string | null;
  setHoveredLink: (link: string | null) => void;
  setIsMenu: (isMenu: boolean) => void;
}

const mobileWithSize = 1024;

const PCNavigation = ({ links, isRegisterPath }: NavProps) => {
  if (isRegisterPath) {
    return (
      <nav
        className={cn(
          'gap-[2.5rem]',
          'hidden',
          'md:flex',
          'justify-between',
          'text-lg',
          'font-[600]',
          'text-gray-500',
        )}
      >
        {links.map(({ label, href }) => (
          <a key={label} href={href} className={cn([...activeTextStyle])}>
            {label}
          </a>
        ))}
      </nav>
    );
  }

  return (
    <nav
      className={cn(
        'gap-[2.5rem]',
        'hidden',
        'md:flex',
        'justify-between',
        'text-lg',
        'font-[600]',
        'text-gray-500',
      )}
    >
      {links.map(({ label, href }) => (
        <ActiveLink
          key={label}
          href={href}
          className={cn([...activeTextStyle])}
          activeClassName={cn(...activeStyle)}
        >
          {label}
        </ActiveLink>
      ))}
    </nav>
  );
};

const MobileNavigation = ({
  links,
  isRegisterPath,
  hoveredLink,
  setHoveredLink,
  setIsMenu,
}: MobileNavProps) => {
  if (isRegisterPath) {
    return (
      <div className={cn('flex', 'flex-col', 'items-start', 'gap-[2.25rem]')}>
        {links.map((link) => {
          const IconComponent = link.icon;
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenu(false)}
              className={cn(
                'flex',
                'items-center',
                'gap-4',
                'text-slate-300',
                'text-[1.5rem]',
                'leading-normal',
                'font-bold',
                'hover:text-slate-500',
                'duration-150',
              )}
              onMouseEnter={() => setHoveredLink(link.href)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <IconComponent
                size="1.75rem"
                color={hoveredLink === link.href ? '#64748B' : '#CBD5E1'}
              />
              {link.label}
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex', 'flex-col', 'items-start', 'gap-[2.25rem]')}>
      {links.map((link) => {
        const IconComponent = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsMenu(false)}
            className={cn(
              'flex',
              'items-center',
              'gap-4',
              'text-slate-300',
              'text-[1.5rem]',
              'leading-normal',
              'font-bold',
              'hover:text-slate-500',
              'duration-150',
            )}
            onMouseEnter={() => setHoveredLink(link.href)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <IconComponent
              size="1.75rem"
              color={hoveredLink === link.href ? '#64748B' : '#CBD5E1'}
            />
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};

// 로고 컴포넌트
const Logo = ({ isRegisterPath }: { isRegisterPath: boolean }) => {
  if (isRegisterPath) {
    return (
      <a href="/">
        <I.HelloGSMLogo />
      </a>
    );
  }

  return (
    <Link href="/">
      <I.HelloGSMLogo />
    </Link>
  );
};

// 드롭다운 메뉴 컴포넌트
const DropdownMenu = ({
  isRegisterPath,
  setIsDropdown,
  handleLogoutClick,
  handleLogout,
}: {
  isRegisterPath: boolean;
  setIsDropdown: (value: boolean) => void;
  handleLogoutClick: () => void;
  handleLogout: () => void;
}) => {
  if (isRegisterPath) {
    return (
      <div
        className={cn(
          'absolute',
          'top-full',
          'left-[-40%]',
          'mt-2',
          'flex',
          'w-[10rem]',
          'flex-col',
          'items-start',
          'shadow-sm',
          'rounded-md',
          'bg-white',
        )}
      >
        <a href="/mypage" className={cn([...modalBtnStyle])} onClick={() => setIsDropdown(false)}>
          <I.HomeIcon size="1.5rem" color="#475569" /> 내 정보 페이지
        </a>
        <button
          type="button"
          className={cn([...modalBtnStyle, 'text-red-600'])}
          onClick={handleLogoutClick}
        >
          <I.LogoutIcon /> 로그아웃
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'absolute',
        'top-full',
        'left-[-40%]',
        'mt-2',
        'flex',
        'w-[10rem]',
        'flex-col',
        'items-start',
        'shadow-sm',
        'rounded-md',
        'bg-white',
      )}
    >
      <Link href="/mypage" className={cn([...modalBtnStyle])} onClick={() => setIsDropdown(false)}>
        <I.HomeIcon size="1.5rem" color="#475569" /> 내 정보 페이지
      </Link>
      <Link
        href="/"
        className={cn([...modalBtnStyle, 'text-red-600'])}
        onClick={() => {
          handleLogout();
          setIsDropdown(false);
        }}
      >
        <I.LogoutIcon /> 로그아웃
      </Link>
    </div>
  );
};

const Header = ({ isServerHealthy }: HeaderProps) => {
  const { data: authInfo } = useGetMyAuthInfo();
  const { data: memberInfo } = useGetMyMemberInfo();

  const queryClient = useQueryClient();

  const logout = useLogout('client');

  const handleLogout = () => {
    logout();
    queryClient.removeQueries({ queryKey: memberQueryKeys.getMyAuthInfo() });
    queryClient.removeQueries({ queryKey: memberQueryKeys.getMyMemberInfo() });
  };

  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isDropdown, setIsDropdown] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const isLogin = authInfo?.authReferrerType && !memberInfo?.name;
  const isSignup = authInfo?.authReferrerType && memberInfo?.name;

  const pathname = usePathname();
  const isRegisterPath = pathname?.startsWith('/register');

  const router = useRouter();

  const MenuToggleButton = () => (
    <button onClick={() => setIsMenu(!isMenu)}>{isMenu ? <I.XIcon /> : <I.HamburgerIcon />}</button>
  );

  const mobileNavLinks = isServerHealthy
    ? [
        { href: '/', label: '홈', icon: I.HomeIcon },
        { href: '/guide', label: '원서 접수', icon: I.OneseoIcon },
        { href: '/faq', label: '자주 묻는 질문', icon: I.FaqIcon },
        { href: '/check-result', label: '합격자 조회', icon: I.MedalIcon },
        { href: '/mypage', label: '내 정보 페이지', icon: I.HeaderProfileIcon },
        {
          href: '/introduce',
          label: '더모먼트',
          icon: I.SparkleIcon,
        },
      ]
    : [
        { href: '/', label: '홈', icon: I.HomeIcon },
        { href: '/guide', label: '원서 접수', icon: I.OneseoIcon },
        { href: '/faq', label: '자주 묻는 질문', icon: I.FaqIcon },
        {
          href: '/introduce',
          label: '더모먼트',
          icon: I.SparkleIcon,
        },
      ];

  const pcNavLinks = isServerHealthy
    ? [
        { href: '/', label: '홈' },
        { href: '/guide', label: '원서 접수' },
        { href: '/faq', label: '자주 묻는 질문' },
        { href: '/oneseo/calculate', label: '모의 성적 계산' },
        { href: '/check-result', label: '합격자 조회' },
        {
          href: '/introduce',
          label: '더모먼트',
        },
      ]
    : [
        { href: '/', label: '홈' },
        { href: '/guide', label: '원서 접수' },
        { href: '/faq', label: '자주 묻는 질문' },
        { href: '/oneseo/calculate', label: '모의 성적 계산' },
        {
          href: '/introduce',
          label: '더모먼트',
        },
      ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= mobileWithSize) {
        setIsMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogoutClick = () => {
    if (confirm('변경사항이 저장되지 않을 수 있습니다. 로그아웃하시겠습니까?')) {
      handleLogout();
      setIsDropdown(false);
      router.push('/');
    } else {
      setIsDropdown(false);
    }
  };

  return (
    <>
      <header
        className={cn(
          'h-[4.625rem]',
          'px-[1.25rem]',
          'lg:px-[6.25rem]',
          'xl:px-[15.25rem]',
          'fhd:px-[20rem]',
          'flex',
          'justify-between',
          'items-center',
          'text-gray-900',
          'sticky',
          'top-0',
          'w-full',
          'bg-white',
          'z-20',
          'border-t-solid',
          'border-b-[0.0625rem]',
          'border-gray-100',
          'gap-8',
        )}
      >
        <Logo isRegisterPath={isRegisterPath} />

        {!isLogin && <PCNavigation links={pcNavLinks} isRegisterPath={isRegisterPath} />}

        {/* PC width 일떄 */}
        {isServerHealthy && (
          <div className={cn('hidden', 'md:flex')}>
            {isSignup ? (
              <>
                <div className={cn('relative')}>
                  <button
                    className={cn([...loginLinkStyle, 'gap-2', 'relative'])}
                    onClick={() => setIsDropdown(!isDropdown)}
                  >
                    <div
                      className={cn(['flex', 'items-center', 'gap-[0.125rem]', ...activeTextStyle])}
                    >
                      <I.HeaderProfileIcon size="1.5rem" color="#2563EB" />
                      <span className={cn('text-blue-600')}>{memberInfo.name}</span> 님
                    </div>
                    <I.ChevronIcon />
                  </button>

                  {isDropdown && (
                    <DropdownMenu
                      isRegisterPath={isRegisterPath}
                      setIsDropdown={setIsDropdown}
                      handleLogoutClick={handleLogoutClick}
                      handleLogout={handleLogout}
                    />
                  )}
                </div>
              </>
            ) : isLogin ? (
              '회원가입을 진행해주세요'
            ) : (
              <LoginDialog variant="pc" />
            )}
          </div>
        )}

        {/* Mobile width 일떄 */}
        <div className={cn('md:hidden')}>
          {isLogin ? '회원가입을 진행해주세요' : <MenuToggleButton />}
        </div>
      </header>

      {isMenu && (
        <div
          className={cn(
            'flex',
            'fixed',
            'top-[4.625rem]',
            'left-0',
            'w-full',
            'h-[calc(100vh-4.625rem)]',
            'pl-[3rem]',
            'pt-[1.5rem]',
            'pb-[3.75rem]',
            'flex-col',
            'items-start',
            'justify-between',
            'bg-white',
            'z-20',
            'overflow-y-auto',
          )}
        >
          <MobileNavigation
            links={mobileNavLinks}
            isRegisterPath={isRegisterPath}
            hoveredLink={hoveredLink}
            setHoveredLink={setHoveredLink}
            setIsMenu={setIsMenu}
          />
          {isServerHealthy &&
            (isSignup ? (
              <button
                className={cn(
                  'flex',
                  'items-center',
                  'gap-4',
                  'text-red-600',
                  'text-[1.5rem]',
                  'leading-normal',
                  'font-bold',
                )}
                onClick={() => {
                  handleLogout();
                  setIsMenu(false);
                }}
              >
                <I.LogoutIcon /> 로그아웃
              </button>
            ) : (
              <LoginDialog variant="mobile" />
            ))}
        </div>
      )}
    </>
  );
};

export default Header;
