import '@repo/ui/styles.css';

import '@/styles/globals.css';

import type { Metadata } from 'next';

import { ModalContainer } from '@repo/ui/components';

import { pretendardFont } from '@/styles/pretendard';

import Provider from './provider';

export const metadata: Metadata = {
  title: '',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={pretendardFont.className}>
        <Provider>
          {children}
          <ModalContainer modal="admin" />
        </Provider>
      </body>
    </html>
  );
}
