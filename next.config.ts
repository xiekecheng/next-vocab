import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! 警告 !!
    // 忽略构建时的类型检查错误
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
