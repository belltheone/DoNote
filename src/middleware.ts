import { type NextRequest, NextResponse } from 'next/server';

// IP 기반 간단한 Rate Limiting (메모리 기반)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1분
const MAX_REQUESTS = 60; // 분당 60회 (기본)
const MAX_REQUESTS_API = 30; // 분당 30회 (API)

export function rateLimiter(request: NextRequest, maxRequests: number = MAX_REQUESTS) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();

    const record = rateLimit.get(ip);

    if (!record || now > record.resetTime) {
        // 새 윈도우 시작
        rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return null;
    }

    if (record.count >= maxRequests) {
        return NextResponse.json(
            { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
            { status: 429 }
        );
    }

    record.count += 1;
    return null;
}

// CSP 헤더 생성
function getCSPHeaders(): Record<string, string> {
    const csp = [
        "default-src 'self'",
        // script-src: 포트원 SDK, Google Analytics, Daum 주소 API
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.portone.io https://www.googletagmanager.com https://www.google-analytics.com https://t1.daumcdn.net https://ssl.daumcdn.net https://postcode.map.daum.net",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob: https: http:",
        // connect-src: 포트원 API, Supabase, Google Analytics, 아임포트
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://api.portone.io https://*.portone.io https://*.iamport.co",
        // frame-src: 포트원 결제창, Daum 주소 API, PG사 결제창
        "frame-src 'self' https://t1.daumcdn.net https://postcode.map.daum.net https://*.portone.io https://*.kcp.co.kr https://*.nicepay.co.kr https://*.inicis.com https://*.kakaopay.com https://*.tosspayments.com https://*.naverpay.com https://*.danal.co.kr",
        "frame-ancestors 'self'",
        "form-action 'self'",
    ].join('; ');

    return {
        'Content-Security-Policy': csp,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    };
}

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // API 라우트에 Rate Limiting 적용
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const rateLimitResponse = rateLimiter(request, MAX_REQUESTS_API);
        if (rateLimitResponse) return rateLimitResponse;
    }

    // 보안 헤더 추가
    const securityHeaders = getCSPHeaders();
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};
