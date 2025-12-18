"use client";
// 인증 Provider - 전역 인증 상태 초기화

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const initialize = useAuthStore((state) => state.initialize);
    const isInitialized = useAuthStore((state) => state.isInitialized);

    useEffect(() => {
        if (!isInitialized) {
            initialize();
        }
    }, [initialize, isInitialized]);

    return <>{children}</>;
}
