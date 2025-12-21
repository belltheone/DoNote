// API Rate Limiting 미들웨어
// 악용 방지를 위한 요청 제한

import { NextRequest, NextResponse } from 'next/server';

// 메모리 기반 rate limiter (실제 프로덕션에서는 Redis 사용 권장)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

// Rate limit 설정
const RATE_LIMIT_CONFIG = {
    // 일반 API
    default: { maxRequests: 100, windowMs: 60 * 1000 }, // 분당 100회
    // 결제 API
    payment: { maxRequests: 10, windowMs: 60 * 1000 }, // 분당 10회
    // 인증 API
    auth: { maxRequests: 5, windowMs: 60 * 1000 }, // 분당 5회
};

type RateLimitType = keyof typeof RATE_LIMIT_CONFIG;

// IP 추출
function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    if (realIP) {
        return realIP;
    }
    return 'unknown';
}

// Rate limit 체크
export function checkRateLimit(
    request: NextRequest,
    type: RateLimitType = 'default'
): { allowed: boolean; remaining: number; resetAt: number } {
    const ip = getClientIP(request);
    const key = `${ip}:${type}`;
    const config = RATE_LIMIT_CONFIG[type];
    const now = Date.now();

    const record = rateLimitMap.get(key);

    // 새 요청 또는 윈도우 초과
    if (!record || now - record.timestamp > config.windowMs) {
        rateLimitMap.set(key, { count: 1, timestamp: now });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetAt: now + config.windowMs
        };
    }

    // 기존 윈도우 내
    if (record.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: record.timestamp + config.windowMs
        };
    }

    // 카운트 증가
    record.count++;
    rateLimitMap.set(key, record);

    return {
        allowed: true,
        remaining: config.maxRequests - record.count,
        resetAt: record.timestamp + config.windowMs
    };
}

// Rate limit 응답 헤더 추가
export function addRateLimitHeaders(
    response: NextResponse,
    remaining: number,
    resetAt: number
): NextResponse {
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(resetAt).toISOString());
    return response;
}

// Rate limit 초과 응답
export function rateLimitExceededResponse(resetAt: number): NextResponse {
    return NextResponse.json(
        {
            error: '요청 한도 초과',
            message: '잠시 후 다시 시도해주세요',
            resetAt: new Date(resetAt).toISOString()
        },
        {
            status: 429,
            headers: {
                'Retry-After': Math.ceil((resetAt - Date.now()) / 1000).toString()
            }
        }
    );
}

// 오래된 레코드 정리 (주기적으로 호출)
export function cleanupRateLimitMap() {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5분

    for (const [key, record] of rateLimitMap.entries()) {
        if (now - record.timestamp > maxAge) {
            rateLimitMap.delete(key);
        }
    }
}

// 5분마다 정리
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupRateLimitMap, 5 * 60 * 1000);
}
