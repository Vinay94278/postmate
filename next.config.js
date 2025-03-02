// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/flask/:path*',
          destination: 'http://localhost:5000/:path*', // Proxy to Flask backend
        },
      ];
    },
  };
  
  module.exports = nextConfig;