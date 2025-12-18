import { type NextRequest, NextResponse } from 'next/server';

// IP 기반 간단한 Rate Limiting (메모리 기반)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1분
const MAX_REQUESTS = 10; // 분당 10회

export function rateLimiter(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();

    const record = rateLimit.get(ip);

    if (!record || now > record.resetTime) {
        // 새 윈도우 시작
        rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return null;
    }

    if (record.count >= MAX_REQUESTS) {
        return NextResponse.json(
            { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
            { status: 429 }
        );
    }

    record.count += 1;
    return null;
}

export function middleware(request: NextRequest) {
    // API 라우트에만 Rate Limiting 적용
    if (request.nextUrl.pathname.startsWith('/api/')) {
        const rateLimitResponse = rateLimiter(request);
        if (rateLimitResponse) return rateLimitResponse;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};
