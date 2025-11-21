import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'better-health.s3.amazonaws.com',
        pathname: '**'
      }
    ]
  }
}

export default nextConfig
