/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    crossOrigin: 'anonymous',
    images: {
      domains: [
        "static.kwic.in"
      ],
    },
  };
  
  module.exports = nextConfig;