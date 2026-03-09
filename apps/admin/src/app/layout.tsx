import { ModalContainer } from 'shared';

import { pretendardFont } from 'shared/fonts';

import Provider from './provider';

import type { Metadata } from 'next';

import 'shared/styles/globals.css';

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
