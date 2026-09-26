import { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    localPatterns: [
      { pathname: "/products/**" },
      { pathname: "/brand/**" },
      { pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
