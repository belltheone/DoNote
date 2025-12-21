// XSS 방지 및 입력 정제 유틸리티

// HTML 엔티티 이스케이프
export function escapeHtml(str: string): string {
    const htmlEscapes: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return str.replace(/[&<>"'`=/]/g, char => htmlEscapes[char] || char);
}

// 스크립트 태그 제거
export function stripScripts(str: string): string {
    return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/javascript:/gi, '');
}

// 사용자 입력 정제 (메시지, 닉네임 등)
export function sanitizeUserInput(input: string, maxLength: number = 500): string {
    if (!input) return '';

    // 길이 제한
    let sanitized = input.slice(0, maxLength);

    // 위험한 문자 제거
    sanitized = stripScripts(sanitized);

    // 앞뒤 공백 제거
    sanitized = sanitized.trim();

    // 연속 공백 정리
    sanitized = sanitized.replace(/\s+/g, ' ');

    return sanitized;
}

// URL 검증
export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

// 이메일 검증
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 핸들 검증 (알파벳, 숫자, 언더스코어만)
export function isValidHandle(handle: string): boolean {
    const handleRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
    return handleRegex.test(handle);
}

// 금액 검증
export function isValidAmount(amount: number): boolean {
    return Number.isInteger(amount) && amount >= 1000 && amount <= 10000000;
}

// SQL Injection 방지를 위한 검증
export function containsSqlInjection(str: string): boolean {
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
        /(--|#|\/\*|\*\/)/,
        /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
        /('\s*(OR|AND)\s+')/i
    ];
    return sqlPatterns.some(pattern => pattern.test(str));
}

// 안전한 JSON 파싱
export function safeJsonParse<T>(json: string, defaultValue: T): T {
    try {
        return JSON.parse(json) as T;
    } catch {
        return defaultValue;
    }
}
