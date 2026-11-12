import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_IMAGE_URL || '',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // 배열로 반환한 rewrites는 afterFiles라 src/app/api 아래 자체 Route Handler
  // (mock-score, school-record-ocr)가 먼저 처리되고, 나머지 /api 요청만 백엔드로 넘어간다.
  // 이 순서를 바꾸거나(beforeFiles) Route Handler 경로를 옮기면 해당 요청이 백엔드로 흘러가므로
  // 함께 확인한다.
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
    },
  ],
  redirects: async () => [
    {
      source: '/introduce',
      destination: 'https://themoment-landing.hellogsm.kr/',
      permanent: true,
    },
  ],
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
});
