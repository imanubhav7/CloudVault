/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB", // 👈 increase as needed
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        pathname: "/v1/storage/buckets/**",  // 👈 matches all bucket/file URLs
      },
    ],
  },
};

module.exports = nextConfig;
