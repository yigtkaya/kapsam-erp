import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ["en-US", "tr-TR"],
    defaultLocale: "tr-TR",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
