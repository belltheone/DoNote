import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

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

// Sentry 설정
const sentryConfig = {
  // Organization and project in Sentry
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Sentry Auth Token (optional, for source maps)
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // 번들에 Sentry 포함 여부
  silent: true, // 빌드 로그 숨김

  // DSN이 없으면 Sentry 비활성화
  disableServerWebpackPlugin: !process.env.NEXT_PUBLIC_SENTRY_DSN,
  disableClientWebpackPlugin: !process.env.NEXT_PUBLIC_SENTRY_DSN,
};

// Sentry로 래핑
export default withSentryConfig(withBundleAnalyzer(nextConfig), sentryConfig);

