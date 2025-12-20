// Next.js 계측 파일 - Sentry 초기화
// 서버 사이드 및 클라이언트 사이드 Sentry 로드

import * as Sentry from "@sentry/nextjs";

export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        // 서버 사이드 Sentry 초기화
        await import("../sentry.server.config");
    }

    if (process.env.NEXT_RUNTIME === "edge") {
        // Edge 런타임 Sentry 초기화
        await import("../sentry.edge.config");
    }
}

export const onRequestError = Sentry.captureRequestError;
