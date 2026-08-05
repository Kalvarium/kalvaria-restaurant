import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Consume the workspace packages as source (no separate build step).
  transpilePackages: ["@kalvaria/ui", "@kalvaria/types"],
};

export default nextConfig;
