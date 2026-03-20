/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'picsum.photos', 'images.unsplash.com', 'www.google.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/extsys/:path*',
        destination: 'https://ambikaexch.in/extsys/:path*',
      },
    ];
  },
}

module.exports = nextConfig
