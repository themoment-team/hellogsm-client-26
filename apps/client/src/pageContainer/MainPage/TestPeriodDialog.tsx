import { useEffect } from 'react';

import { useModalStore } from 'shared/stores';

const TestPeriodDialog = () => {
  const { setTestPeriodNoticeModal } = useModalStore();

  useEffect(() => {
    // 테스트 기간 조건을 확인하고 모달을 표시
    // 예시: 특정 환경 변수나 조건에 따라 모달을 표시할 수 있습니다
    const isTestPeriod = process.env.NEXT_PUBLIC_IS_TEST_PERIOD === 'true';

    if (isTestPeriod) {
      setTestPeriodNoticeModal(true);
    }
  }, [setTestPeriodNoticeModal]);

  return null;
};

export default TestPeriodDialog;
