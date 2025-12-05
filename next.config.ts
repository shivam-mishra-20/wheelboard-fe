import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wheelboardapi.addonshareware.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'wheelboardapi.addonshareware.com',
        pathname: '/logos/**',
      },
      {
        protocol: 'https',
        hostname: 'emptradocs.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
