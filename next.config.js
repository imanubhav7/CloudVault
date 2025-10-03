/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // 👈 increase as needed
    },
  },
};

module.exports = nextConfig;
