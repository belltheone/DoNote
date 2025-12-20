// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        // 테스트 환경 설정
        environment: 'jsdom',

        // 글로벌 테스트 API 사용 (describe, it, expect 등)
        globals: true,

        // 셋업 파일
        setupFiles: ['./vitest.setup.ts'],

        // 테스트 파일 패턴
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

        // 제외 패턴
        exclude: ['node_modules', '.next', 'dist'],

        // 커버리지 설정
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                '.next/',
                'src/app/**/*.tsx',  // 페이지 컴포넌트는 E2E 테스트로
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
