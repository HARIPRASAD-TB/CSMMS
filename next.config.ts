import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = "CSMMS";
const basePath = isGithubPages ? `/${repo}` : "";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_DEMO_MODE: isGithubPages ? "true" : "",
  },
  ...(isGithubPages
    ? {
        output: "export" as const,
        basePath,
        assetPrefix: `${basePath}/`,
        trailingSlash: true,
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
