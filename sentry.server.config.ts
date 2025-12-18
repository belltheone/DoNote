// Sentry 설정 파일 (서버)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // 프로덕션에서만 활성화
    enabled: process.env.NODE_ENV === "production",

    // 성능 모니터링
    tracesSampleRate: 0.1,

    // 환경 구분
    environment: process.env.NODE_ENV,
});
