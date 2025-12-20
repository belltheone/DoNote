// 유틸리티 함수 테스트
// 금액 포맷팅, 날짜 처리 등

import { describe, it, expect } from 'vitest';

// 금액 포맷팅 함수
const formatAmount = (amount: number): string => {
    return `₩${amount.toLocaleString()}`;
};

// 상대 시간 계산 함수
const getRelativeTime = (dateStr: string): string => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
};

describe('formatAmount', () => {
    it('천 단위 구분자로 금액을 포맷팅해야 함', () => {
        expect(formatAmount(1000)).toBe('₩1,000');
        expect(formatAmount(10000)).toBe('₩10,000');
        expect(formatAmount(1234567)).toBe('₩1,234,567');
    });

    it('0원을 올바르게 포맷팅해야 함', () => {
        expect(formatAmount(0)).toBe('₩0');
    });
});

describe('getRelativeTime', () => {
    it('1분 이내는 "방금 전"을 반환해야 함', () => {
        const now = new Date();
        const result = getRelativeTime(now.toISOString());
        expect(result).toBe('방금 전');
    });

    it('1시간 이내는 분 단위로 반환해야 함', () => {
        const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
        const result = getRelativeTime(thirtyMinsAgo.toISOString());
        expect(result).toContain('분 전');
    });

    it('24시간 이내는 시간 단위로 반환해야 함', () => {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const result = getRelativeTime(twoHoursAgo.toISOString());
        expect(result).toBe('2시간 전');
    });
});
