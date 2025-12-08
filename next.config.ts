import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wheelboardapi.addonshareware.com',
        pathname: '/**',
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
