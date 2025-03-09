import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com"
      },
      {
        hostname: "imagedelivery.net"
      }
    ]
  }
};

export default nextConfig;
