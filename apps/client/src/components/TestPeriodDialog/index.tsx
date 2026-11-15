'use client';

import { useEffect } from 'react';

import { useModalStore } from '@repo/store';

import { isTestPeriod } from '@/utils';

const TestPeriodDialog = () => {
  const setTestPeriodNoticeModal = useModalStore((state) => state.setTestPeriodNoticeModal);

  useEffect(() => {
    if (isTestPeriod) {
      setTestPeriodNoticeModal(true);
    }
  }, [setTestPeriodNoticeModal]);

  return null;
};

export default TestPeriodDialog;
