/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
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
