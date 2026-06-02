import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/HistoryRevHUM71",
  assetPrefix: "/HistoryRevHUM71/",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
