/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/Notifications/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://63gh3zjs-5022.uks1.devtunnels.ms'}/api/Notifications/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5022'}/:path*`,
      },
    ]
  }
}

module.exports = nextConfig


