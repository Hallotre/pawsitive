import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: 'export' to allow dynamic API routes for authentication
  // trailingSlash: true, // Not needed for dynamic apps
  images: {
    unoptimized: true // Keep this for external image handling
  }
};

export default nextConfig;
