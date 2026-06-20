/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/Notifications/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://internway2.runasp.net'}/api/Notifications/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://internway2.runasp.net'}/:path*`,
      },
    ]
  }
}

module.exports = nextConfig


