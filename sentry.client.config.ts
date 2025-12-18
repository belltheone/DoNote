// Sentry 설정 파일 (클라이언트)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // 프로덕션에서만 활성화
    enabled: process.env.NODE_ENV === "production",

    // 성능 모니터링 샘플 레이트
    tracesSampleRate: 0.1,

    // 세션 리플레이
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // 개발 환경에서 디버그
    debug: false,

    // 환경 구분
    environment: process.env.NODE_ENV,

    // 무시할 에러
    ignoreErrors: [
        "ResizeObserver loop limit exceeded",
        "ChunkLoadError",
        "Loading chunk",
    ],
});
