import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder sample imagery only (Phase 1). Real product photography
      // will be served from the Medusa-managed asset host in Phase 2.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
