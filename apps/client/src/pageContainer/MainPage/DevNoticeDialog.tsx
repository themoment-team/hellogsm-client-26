import { useEffect } from 'react';

import { useModalStore } from 'shared/stores';

const DevNoticeDialog = () => {
  const { setDevServerNoticeModal } = useModalStore();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STAGE === 'stage') {
      setDevServerNoticeModal(true);
    }
  }, [setDevServerNoticeModal]);

  return null;
};

export default DevNoticeDialog;
