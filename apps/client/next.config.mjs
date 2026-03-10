/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['shared', 'types', 'api', 'tailwind-config', 'code-style-config'],
  reactStrictMode: false,
  images: {
    domains: ['github.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_IMAGE_URL || '',
        port: '',
        pathname: '/**',
      },
    ],
  },
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
    },
  ],
  output: 'standalone',
};

export default nextConfig;
