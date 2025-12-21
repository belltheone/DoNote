// 환경변수 검증 유틸리티
// 필수 환경변수 체크 및 에러 핸들링

// 필수 환경변수 목록
const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

// 선택적 환경변수 (없으면 기능 비활성화)
const optionalEnvVars = [
    'RESEND_API_KEY',
    'NEXT_PUBLIC_ADMIN_EMAIL',
    'TOSS_CLIENT_KEY',
    'TOSS_SECRET_KEY',
] as const;

// 환경변수 검증 결과
interface EnvValidationResult {
    isValid: boolean;
    missing: string[];
    optional: string[];
}

// 환경변수 검증
export function validateEnv(): EnvValidationResult {
    const missing: string[] = [];
    const optional: string[] = [];

    // 필수 환경변수 체크
    requiredEnvVars.forEach(key => {
        if (!process.env[key]) {
            missing.push(key);
        }
    });

    // 선택적 환경변수 체크
    optionalEnvVars.forEach(key => {
        if (!process.env[key]) {
            optional.push(key);
        }
    });

    return {
        isValid: missing.length === 0,
        missing,
        optional
    };
}

// 환경변수 가져오기 (필수)
export function getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`필수 환경변수 ${key}가 설정되지 않았습니다.`);
    }
    return value;
}

// 환경변수 가져오기 (선택적)
export function getOptionalEnv(key: string, defaultValue: string = ''): string {
    return process.env[key] || defaultValue;
}

// 서비스 활성화 상태 체크
export function getServiceStatus(): Record<string, boolean> {
    return {
        supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        resend: !!process.env.RESEND_API_KEY,
        toss: !!process.env.TOSS_CLIENT_KEY && !!process.env.TOSS_SECRET_KEY,
        sentry: !!process.env.SENTRY_DSN,
    };
}

// 개발 환경 여부
export function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
}

// 프로덕션 환경 여부
export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}
