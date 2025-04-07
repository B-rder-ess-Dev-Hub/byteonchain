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
 
  exportPathMap: async function (defaultPathMap) {
    const pathMap = { ...defaultPathMap };
    delete pathMap['/quizzes'];
    delete pathMap['/chat'];
    delete pathMap['/classroom'];
    return pathMap;
  },
  // Handle server-side rendering issues
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'react', 'react-dom'];
    }
    return config;
  },
};

module.exports = nextConfig;
