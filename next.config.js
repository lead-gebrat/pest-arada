// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
    ],
    domains: [],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: "asset/resource",
    });
    return config;
  },
};
