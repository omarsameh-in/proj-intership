/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/Notifications/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://2lmcv6z8-5022.euw.devtunnels.ms'}/api/Notifications/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://2lmcv6z8-5022.euw.devtunnels.ms'}/:path*`,
      },
    ]
  }
}

module.exports = nextConfig


