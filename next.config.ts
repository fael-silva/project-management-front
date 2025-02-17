import { NextConfig } from "next";
import type { Configuration as WebpackConfig } from "webpack"; 

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  webpack: (config: WebpackConfig): WebpackConfig => {
    return config;
  },
};

export default nextConfig;
