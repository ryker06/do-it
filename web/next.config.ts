import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === "production" ? "/do-it" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/do-it/" : "",
  devIndicators: false,
};

export default nextConfig;
