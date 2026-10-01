import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.hellogsm.kr';

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_STAGE === 'stage') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/mypage',
        '/register',
        '/print',
        '/callback',
        '/signup',
        '/check-result',
        '/api/',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
