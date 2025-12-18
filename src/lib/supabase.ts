// Supabase 클라이언트 - 실제 연동
// 인증, 데이터베이스 연동

import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabase 클라이언트 생성
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// 사용자 타입 정의
export interface User {
    id: string;
    email: string;
    displayName: string;
    avatar: string;
    handle: string;
    bio: string;
    createdAt: string;
}

// 후원 데이터 타입
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

// 크리에이터 프로필 타입
export interface CreatorProfile {
    id: string;
    userId: string;
    handle: string;
    displayName: string;
    avatar: string;
    bio: string;
    goalTitle?: string;
    goalTarget?: number;
    socialLinks?: Record<string, string>;
    createdAt: string;
}

// 소셜 로그인 함수
export async function signInWithProvider(provider: 'kakao' | 'google' | 'github'): Promise<{ user: SupabaseUser | null; error: Error | null }> {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });

    if (error) {
        console.error('로그인 오류:', error);
        return { user: null, error };
    }

    // OAuth 리다이렉트 후 세션에서 사용자 가져옴
    const { data: { user } } = await supabase.auth.getUser();
    return { user, error: null };
}

// 로그아웃 함수
export async function signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('로그아웃 오류:', error);
}

// 현재 사용자 가져오기
export async function getCurrentUser(): Promise<SupabaseUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// 크리에이터 프로필 가져오기
export async function getCreatorProfile(handle: string): Promise<CreatorProfile | null> {
    const { data, error } = await supabase
        .from('creators')
        .select('*')
        .eq('handle', handle)
        .single();

    if (error) {
        console.error('프로필 조회 오류:', error);
        return null;
    }

    return data;
}

// 크리에이터 프로필 생성/업데이트
export async function upsertCreatorProfile(profile: Partial<CreatorProfile>): Promise<CreatorProfile | null> {
    // 카멜 케이스 -> 스네이크 케이스 변환
    const dbProfile = {
        ...(profile.userId && { user_id: profile.userId }),
        ...(profile.handle && { handle: profile.handle }),
        ...(profile.displayName && { display_name: profile.displayName }),
        ...(profile.avatar && { avatar: profile.avatar }),
        ...(profile.bio !== undefined && { bio: profile.bio }),
        ...(profile.goalTitle && { goal_title: profile.goalTitle }),
        ...(profile.goalTarget && { goal_target: profile.goalTarget }),
        ...(profile.socialLinks && { social_links: profile.socialLinks }),
    };

    const { data, error } = await supabase
        .from('creators')
        .upsert(dbProfile)
        .select()
        .single();

    if (error) {
        console.error('프로필 저장 오류:', error);
        return null;
    }

    // 스네이크 케이스 -> 카멜 케이스 변환
    return {
        id: data.id,
        userId: data.user_id,
        handle: data.handle,
        displayName: data.display_name,
        avatar: data.avatar,
        bio: data.bio,
        goalTitle: data.goal_title,
        goalTarget: data.goal_target,
        socialLinks: data.social_links,
        createdAt: data.created_at,
    };
}

// 후원 목록 가져오기
export async function getDonations(creatorId: string): Promise<Donation[]> {
    const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('creatorId', creatorId)
        .eq('status', 'paid')
        .order('createdAt', { ascending: false });

    if (error) {
        console.error('후원 목록 조회 오류:', error);
        return [];
    }

    return data || [];
}

// 후원 생성
export async function createDonation(donation: Omit<Donation, 'id' | 'createdAt' | 'status'>): Promise<Donation | null> {
    const { data, error } = await supabase
        .from('donations')
        .insert({
            ...donation,
            status: 'pending',
            createdAt: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error('후원 생성 오류:', error);
        return null;
    }

    return data;
}

// 후원 핀 토글
export async function toggleDonationPin(donationId: string, isPinned: boolean): Promise<boolean> {
    const { error } = await supabase
        .from('donations')
        .update({ isPinned })
        .eq('id', donationId);

    if (error) {
        console.error('핀 토글 오류:', error);
        return false;
    }

    return true;
}

// ===== 실제 데이터 조회 API =====

// 모든 크리에이터 목록 조회 (관리자용)
export async function getAllCreators(): Promise<CreatorProfile[]> {
    const { data, error } = await supabase
        .from('creators')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('크리에이터 목록 조회 오류:', error);
        return [];
    }

    // 스네이크 케이스를 카멜 케이스로 변환
    return (data || []).map(c => ({
        id: c.id,
        userId: c.user_id,
        handle: c.handle,
        displayName: c.display_name,
        avatar: c.avatar || '👨‍💻',
        bio: c.bio || '',
        goalTitle: c.goal_title,
        goalTarget: c.goal_target,
        socialLinks: c.social_links,
        createdAt: c.created_at,
    }));
}

// 모든 후원 목록 조회 (관리자용)
export async function getAllDonations(): Promise<Donation[]> {
    const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('후원 목록 조회 오류:', error);
        return [];
    }

    // 스네이크 케이스를 카멜 케이스로 변환
    return (data || []).map(d => ({
        id: d.id,
        creatorId: d.creator_id,
        donorName: d.donor_name,
        donorEmail: d.donor_email,
        amount: d.amount,
        message: d.message,
        sticker: d.sticker || '💌',
        isTipIncluded: d.is_tip_included || false,
        status: d.status,
        createdAt: d.created_at,
        isPinned: d.is_pinned || false,
    }));
}

// 현재 사용자의 후원 목록 조회 (크리에이터용)
export async function getMyDonations(creatorId: string): Promise<Donation[]> {
    const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('내 후원 목록 조회 오류:', error);
        return [];
    }

    return (data || []).map(d => ({
        id: d.id,
        creatorId: d.creator_id,
        donorName: d.donor_name,
        donorEmail: d.donor_email,
        amount: d.amount,
        message: d.message,
        sticker: d.sticker || '💌',
        isTipIncluded: d.is_tip_included || false,
        status: d.status,
        createdAt: d.created_at,
        isPinned: d.is_pinned || false,
    }));
}

// 실제 통계 데이터 가져오기
export async function getRealStats(donations: Donation[]) {
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    const thisMonthDonations = donations.filter(d => {
        const date = new Date(d.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    const thisMonthAmount = thisMonthDonations.reduce((sum, d) => sum + d.amount, 0);

    return {
        totalAmount,
        thisMonthAmount,
        totalNotes: donations.length,
        thisMonthNotes: thisMonthDonations.length,
    };
}

// 시간대별 후원 분석 (실제 데이터)
export function getRealHourlyAnalysis(donations: Donation[]) {
    const hours = Array(24).fill(0);
    donations.forEach(d => {
        const hour = new Date(d.createdAt).getHours();
        hours[hour]++;
    });
    return hours;
}

// 최고의 팬 (실제 데이터)
export function getRealTopFans(donations: Donation[]) {
    const fanMap = new Map<string, { name: string; amount: number; count: number }>();

    donations.forEach(d => {
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

// 정산 목록 조회
export async function getAllSettlements(): Promise<{
    id: string;
    creatorId: string;
    amount: number;
    netAmount: number;
    status: string;
    requestedAt: string;
    completedAt?: string;
}[]> {
    const { data, error } = await supabase
        .from('settlements')
        .select('*')
        .order('requested_at', { ascending: false });

    if (error) {
        console.error('정산 목록 조회 오류:', error);
        return [];
    }

    return (data || []).map(s => ({
        id: s.id,
        creatorId: s.creator_id,
        amount: s.amount,
        netAmount: s.net_amount,
        status: s.status,
        requestedAt: s.requested_at,
        completedAt: s.completed_at,
    }));
}

// ===== Mock 데이터 (개발용 - DB에 데이터가 없을 때 사용) =====

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

// 통계 데이터 가져오기 (Mock)
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

// 시간대별 후원 분석 (Mock)
export function getHourlyAnalysis() {
    const hours = Array(24).fill(0);
    mockDonations.forEach(d => {
        const hour = new Date(d.createdAt).getHours();
        hours[hour]++;
    });
    return hours;
}

// 최고의 팬 (Mock)
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
