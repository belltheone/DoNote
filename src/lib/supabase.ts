// Mock Supabase 클라이언트
// 실제 Supabase 연동 시 이 파일을 수정합니다

// Mock 사용자 데이터 타입
export interface User {
    id: string;
    email: string;
    displayName: string;
    avatar: string;
    handle: string;
    bio: string;
    createdAt: string;
}

// Mock 후원 데이터 타입
export interface Donation {
    id: string;
    creatorId: string;
    donorName: string;
    donorEmail?: string;
    amount: number;
    message: string;
    sticker: string;
    isTipIncluded: boolean;
    status: 'pending' | 'paid' | 'cancelled';
    createdAt: string;
    isPinned?: boolean;
}

// Mock 현재 사용자 (로그인 시뮬레이션)
let currentUser: User | null = null;

// Mock 로그인 함수
export async function signInWithProvider(provider: 'kakao' | 'google' | 'github'): Promise<User> {
    // 실제로는 Supabase Auth 사용
    const mockUser: User = {
        id: 'mock-user-123',
        email: `user@${provider}.com`,
        displayName: '개발하는 민수',
        avatar: '👨‍💻',
        handle: 'devminsu',
        bio: '프론트엔드 개발자 | 오픈소스 기여자',
        createdAt: new Date().toISOString(),
    };

    currentUser = mockUser;

    // 로컬 스토리지에 저장 (Mock)
    if (typeof window !== 'undefined') {
        localStorage.setItem('donote_user', JSON.stringify(mockUser));
    }

    return mockUser;
}

// Mock 로그아웃 함수
export async function signOut(): Promise<void> {
    currentUser = null;
    if (typeof window !== 'undefined') {
        localStorage.removeItem('donote_user');
    }
}

// 현재 사용자 가져오기
export function getCurrentUser(): User | null {
    if (currentUser) return currentUser;

    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('donote_user');
        if (stored) {
            currentUser = JSON.parse(stored);
            return currentUser;
        }
    }

    return null;
}

// Mock 후원 데이터
export const mockDonations: Donation[] = [
    { id: '1', creatorId: 'mock-user-123', donorName: '익명의 팬', message: '항상 좋은 글 감사합니다! ☕', amount: 5000, sticker: '☕', isTipIncluded: true, status: 'paid', createdAt: '2024-12-14T10:30:00Z', isPinned: true },
    { id: '2', creatorId: 'mock-user-123', donorName: '코딩초보', message: '덕분에 리액트 배웠어요 💜', amount: 3000, sticker: '🔥', isTipIncluded: false, status: 'paid', createdAt: '2024-12-13T15:20:00Z' },
    { id: '3', creatorId: 'mock-user-123', donorName: '개발자김씨', message: '오픈소스 응원합니다! 최고의 개발자가 되세요!', amount: 10000, sticker: '💪', isTipIncluded: true, status: 'paid', createdAt: '2024-12-12T09:15:00Z' },
    { id: '4', creatorId: 'mock-user-123', donorName: '감사해요', message: '최고!', amount: 5000, sticker: '⭐', isTipIncluded: false, status: 'paid', createdAt: '2024-12-11T18:45:00Z' },
    { id: '5', creatorId: 'mock-user-123', donorName: '열정맨', message: '화이팅하세요 🔥', amount: 3000, sticker: '🎉', isTipIncluded: true, status: 'paid', createdAt: '2024-12-10T12:00:00Z' },
    { id: '6', creatorId: 'mock-user-123', donorName: '후원자A', message: '좋은 컨텐츠 감사합니다', amount: 5000, sticker: '💌', isTipIncluded: false, status: 'paid', createdAt: '2024-12-09T20:30:00Z' },
    { id: '7', creatorId: 'mock-user-123', donorName: '새벽코딩', message: '새벽에 영감 받고 갑니다!', amount: 3000, sticker: '🌙', isTipIncluded: true, status: 'paid', createdAt: '2024-12-08T03:15:00Z' },
    { id: '8', creatorId: 'mock-user-123', donorName: '프론트러버', message: 'CSS 팁 감사해요~', amount: 5000, sticker: '❤️', isTipIncluded: false, status: 'paid', createdAt: '2024-12-07T14:20:00Z' },
];

// 통계 데이터 가져오기
export function getStats() {
    const totalAmount = mockDonations.reduce((sum, d) => sum + d.amount, 0);
    const thisMonthDonations = mockDonations.filter(d => {
        const date = new Date(d.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    const thisMonthAmount = thisMonthDonations.reduce((sum, d) => sum + d.amount, 0);

    return {
        totalAmount,
        thisMonthAmount,
        totalNotes: mockDonations.length,
        thisMonthNotes: thisMonthDonations.length,
    };
}

// 시간대별 후원 분석
export function getHourlyAnalysis() {
    const hours = Array(24).fill(0);
    mockDonations.forEach(d => {
        const hour = new Date(d.createdAt).getHours();
        hours[hour]++;
    });
    return hours;
}

// 최고의 팬 (가장 많이 후원한 사람)
export function getTopFans() {
    const fanMap = new Map<string, { name: string; amount: number; count: number }>();

    mockDonations.forEach(d => {
        const existing = fanMap.get(d.donorName) || { name: d.donorName, amount: 0, count: 0 };
        fanMap.set(d.donorName, {
            name: d.donorName,
            amount: existing.amount + d.amount,
            count: existing.count + 1,
        });
    });

    return Array.from(fanMap.values())
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
}
