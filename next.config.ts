import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "hc-cdn.hel1.your-objectstorage.com", "ca.slack-edge.com"],
  }
};

export default nextConfig;
