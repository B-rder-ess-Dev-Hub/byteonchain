/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'byteapi-two.vercel.app',
      'byteonchain.news',
      'i.ytimg.com',
      'img.youtube.com',
      'cdn.byteonchain.news',
      'static.byteonchain.news',
      'postimg.cc',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://byteapi-two.vercel.app/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
