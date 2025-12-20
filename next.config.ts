import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

// 번들 분석기 설정 (ANALYZE=true npm run build 로 실행)
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // React 컴파일러 활성화
  reactCompiler: true,

  // 이미지 최적화 설정
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // 실험적 기능
  experimental: {
    // 패키지 최적화 (번들 크기 감소)
    optimizePackageImports: ["framer-motion", "@heroicons/react", "recharts"],
  },
};

export default withBundleAnalyzer(nextConfig);
