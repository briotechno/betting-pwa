/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' removed — incompatible with async rewrites() and dynamic routes
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.google.com' },
    ],
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
