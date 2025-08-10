// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "arada-1.onrender.com", // full domain
        pathname: "/uploads/**", // match uploaded images
      },
    ],
    domains: [], // can add extra domains here if needed
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: "asset/resource",
    });
    return config;
  },
};

module.exports = nextConfig;
