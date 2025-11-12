import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wheelboardapi.addonshareware.com',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
