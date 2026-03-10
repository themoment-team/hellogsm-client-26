'use client';

import { AdminModals, ClientModals, SharedModals } from '../modal';

interface ModalContainerProps {
  modal: 'admin' | 'client';
}

const ModalContainer = ({ modal }: ModalContainerProps) => {
  return (
    <>
      {modal === 'admin' && <AdminModals />}
      {modal === 'client' && <ClientModals />}
      <SharedModals />
    </>
  );
};

export default ModalContainer;
