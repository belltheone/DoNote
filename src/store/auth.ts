// Zustand 인증 스토어
// 전역 로그인 상태 및 역할 관리

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// 사용자 역할 타입
export type UserRole = 'admin' | 'creator' | 'user';

// 인증 상태 타입
interface AuthState {
    user: User | null;
    role: UserRole | null;
    isLoading: boolean;
    isInitialized: boolean;

    // 헬퍼
    isAdmin: boolean;
    isCreator: boolean;

    // 액션
    setUser: (user: User | null) => void;
    setRole: (role: UserRole | null) => void;
    initialize: () => Promise<void>;
    signOut: () => Promise<void>;
    fetchRole: (userId: string) => Promise<UserRole | null>;
}

// 관리자 이메일 (폴백용)
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@admin.admin';

// 인증 스토어 생성
export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    role: null,
    isLoading: true,
    isInitialized: false,
    isAdmin: false,
    isCreator: false,

    // 사용자 설정
    setUser: (user) => set({ user }),

    // 역할 설정
    setRole: (role) => set({
        role,
        isAdmin: role === 'admin',
        isCreator: role === 'creator' || role === 'admin',
    }),

    // 역할 조회 (DB에서)
    fetchRole: async (userId: string): Promise<UserRole | null> => {
        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .maybeSingle(); // 데이터가 없어도 에러 발생하지 않음

            if (error || !data) {
                // DB에 역할이 없으면 이메일로 폴백 체크
                const user = get().user;
                if (user?.email === ADMIN_EMAIL) {
                    return 'admin';
                }
                return 'user';
            }

            return data.role as UserRole;
        } catch {
            return 'user';
        }
    },

    // 초기화 (세션 확인 + 역할 조회)
    initialize: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user ?? null;

            set({
                user,
                isLoading: false,
                isInitialized: true
            });

            // 역할 조회
            if (user) {
                const role = await get().fetchRole(user.id);
                get().setRole(role);
            }

            // 인증 상태 변경 리스너
            supabase.auth.onAuthStateChange(async (_event, session) => {
                const newUser = session?.user ?? null;
                set({ user: newUser });

                if (newUser) {
                    const role = await get().fetchRole(newUser.id);
                    get().setRole(role);
                } else {
                    get().setRole(null);
                }
            });
        } catch (error) {
            console.error('인증 초기화 오류:', error);
            set({ isLoading: false, isInitialized: true });
        }
    },

    // 로그아웃
    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, role: null, isAdmin: false, isCreator: false });
    },
}));
