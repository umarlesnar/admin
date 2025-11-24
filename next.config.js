/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  images: {
    domains: ['static.kwic.in',"nekhop-kwic.s3-website.ap-south-1.amazonaws.com"], 
  },
  crossOrigin: 'anonymous',
};

module.exports = nextConfig;