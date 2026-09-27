import { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "tavaruseere.com" },
      { protocol: "https", hostname: "www.tavaruseere.com" },
    ],
    localPatterns: [{ pathname: "/**" }],
  },
};

export default nextConfig;
