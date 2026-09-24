import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.hellogsm.kr';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/guide', '/faq', '/oneseo/calculate', '/check-result'];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
