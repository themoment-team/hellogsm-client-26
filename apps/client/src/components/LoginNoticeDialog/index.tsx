'use client';

import { useEffect } from 'react';

import { useModalStore } from 'shared/stores';

import { useGetMyAuthInfo } from 'api/hooks';

interface LoginNoticeDialogProps {
  userName: string | undefined;
  usedPath: 'main' | 'check-result';
}

const LoginNoticeDialog = ({ userName, usedPath }: LoginNoticeDialogProps) => {
  const { setLoginRequiredModal } = useModalStore();
  const { data: authInfo, isLoading } = useGetMyAuthInfo();

  const isMain = usedPath === 'main' ? true : false;

  useEffect(() => {
    if (isLoading) return;

    const isShowModalFF = process.env.NEXT_PUBLIC_SHOW_LOGIN_MODAL_FF === 'true' && isMain;

    const isNotLoggedIn = !authInfo?.authReferrerType || !userName;

    if (isNotLoggedIn && (isShowModalFF || !isMain)) {
      setLoginRequiredModal(true, isMain);
    }
  }, [isLoading, authInfo, userName, isMain, setLoginRequiredModal]);

  return null;
};

export default LoginNoticeDialog;
