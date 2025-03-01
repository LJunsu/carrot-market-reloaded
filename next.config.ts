import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   dynamicIO: true
  // },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com"
      }
    ]
  }
};

export default nextConfig;
