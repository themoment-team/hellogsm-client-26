import { ModalContainer } from 'shared';

import { Header } from 'client/components';
import { GoogleAnalytics } from 'client/lib';
import { getIsServerHealthy } from 'client/utils';

import { pretendardFont } from 'shared/fonts';

import Provider from './provider';

import type { Metadata } from 'next';

import 'shared/styles/globals.css';

export const metadata: Metadata = {
  title: '광주소프트웨어마이스터고등학교 입학지원 서비스',
  description: '광주소프트웨어마이스터고등학교 입학지원 서비스 홈페이지입니다.',
  applicationName: 'Hello, GSM',
  keywords: [
    '광주소프트웨어마이스터고등학교',
    '광주소프트웨어마이스터고',
    '광소마',
    '광주',
    '소프트웨어',
    '마이스터고',
    '마이스터고등학교',
    'GSM',
    'GwangjuSoftwareMeisterHighSchool',
    'SoftWare',
    'Gwangju',
    'MeisterHighSchool',
  ],
  creator: 'the-moment',
  publisher: 'the-moment',
  icons: {
    icon: '/images/favicon.png',
  },
  openGraph: {
    siteName: 'Hello, GSM',
    title: '광주소프트웨어마이스터고등학교 입학지원 서비스',
    description: '광주소프트웨어마이스터고등학교 입학지원 서비스 홈페이지입니다.',
    images: 'https://www.hellogsm.kr/images/opengraph-image.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isServerHealthy = await getIsServerHealthy();

  return (
    <html lang="ko">
      {process.env.NEXT_PUBLIC_STAGE === 'stage' && (
        <>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="msvalidate.01" content="14471419A8701E4145F89E3ADCCFB1D6" />
        </>
      )}
      <body className={pretendardFont.className}>
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        )}
        <Provider>
          <Header isServerHealthy={isServerHealthy} />
          {children}
          <ModalContainer modal="client" />
        </Provider>
      </body>
    </html>
  );
}
