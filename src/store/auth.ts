// Zustand 인증 스토어
// 전역 로그인 상태 관리

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// 인증 상태 타입
interface AuthState {
    user: User | null;
    isLoading: boolean;
    isInitialized: boolean;

    // 액션
    setUser: (user: User | null) => void;
    initialize: () => Promise<void>;
    signOut: () => Promise<void>;
}

// 인증 스토어 생성
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    isInitialized: false,

    // 사용자 설정
    setUser: (user) => set({ user }),

    // 초기화 (세션 확인)
    initialize: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            set({
                user: session?.user ?? null,
                isLoading: false,
                isInitialized: true
            });

            // 인증 상태 변경 리스너
            supabase.auth.onAuthStateChange((_event, session) => {
                set({ user: session?.user ?? null });
            });
        } catch (error) {
            console.error('인증 초기화 오류:', error);
            set({ isLoading: false, isInitialized: true });
        }
    },

    // 로그아웃
    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null });
    },
}));
