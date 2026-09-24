import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.hellogsm.kr';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/mypage', '/register', '/print', '/callback', '/signup', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
