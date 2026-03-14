// Next.js config (placeholder)
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://sdga-api.dhakarachi.org/api/:path*',
      },
    ];
  },
};
