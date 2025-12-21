// SWR 기반 데이터 페칭 훅
// 캐싱, 재검증, 에러 처리 통합

import useSWR, { SWRConfiguration } from 'swr';
import { supabase, type Donation, type CreatorProfile } from './supabase';

// 기본 SWR 설정
export const swrConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    errorRetryCount: 3,
};

// Supabase Fetcher
async function supabaseFetcher<T>(key: string): Promise<T> {
    const [table, ...params] = key.split('/');

    if (table === 'donations') {
        const creatorId = params[0];
        const { data, error } = await supabase
            .from('donations')
            .select('*')
            .eq('creatorId', creatorId)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data as T;
    }

    if (table === 'creator') {
        const handle = params[0];
        const { data, error } = await supabase
            .from('creators')
            .select('*')
            .eq('handle', handle)
            .single();

        if (error) throw error;
        return data as T;
    }

    if (table === 'all-donations') {
        const { data, error } = await supabase
            .from('donations')
            .select('*')
            .order('createdAt', { ascending: false })
            .limit(100);

        if (error) throw error;
        return data as T;
    }

    if (table === 'all-creators') {
        const { data, error } = await supabase
            .from('creators')
            .select('*')
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return data as T;
    }

    throw new Error(`Unknown table: ${table}`);
}

// 후원 목록 훅
export function useDonations(creatorId: string | null) {
    const { data, error, isLoading, mutate } = useSWR<Donation[]>(
        creatorId ? `donations/${creatorId}` : null,
        supabaseFetcher,
        swrConfig
    );

    return {
        donations: data || [],
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
}

// 크리에이터 프로필 훅
export function useCreator(handle: string | null) {
    const { data, error, isLoading, mutate } = useSWR<CreatorProfile>(
        handle ? `creator/${handle}` : null,
        supabaseFetcher,
        swrConfig
    );

    return {
        creator: data,
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
}

// 전체 후원 훅 (관리자용)
export function useAllDonations() {
    const { data, error, isLoading, mutate } = useSWR<Donation[]>(
        'all-donations',
        supabaseFetcher,
        { ...swrConfig, refreshInterval: 30000 } // 30초마다 갱신
    );

    return {
        donations: data || [],
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
}

// 전체 크리에이터 훅 (관리자용)
export function useAllCreators() {
    const { data, error, isLoading, mutate } = useSWR<CreatorProfile[]>(
        'all-creators',
        supabaseFetcher,
        swrConfig
    );

    return {
        creators: data || [],
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
}

// 통계 훅
export function useStats(creatorId: string | null) {
    const { donations, isLoading } = useDonations(creatorId);

    const stats = {
        totalAmount: donations.reduce((sum: number, d: Donation) => sum + d.amount, 0),
        totalCount: donations.length,
        thisMonthAmount: donations
            .filter((d: Donation) => {
                const donationDate = new Date(d.createdAt);
                const now = new Date();
                return donationDate.getMonth() === now.getMonth() &&
                    donationDate.getFullYear() === now.getFullYear();
            })
            .reduce((sum: number, d: Donation) => sum + d.amount, 0),
        avgAmount: donations.length > 0
            ? Math.round(donations.reduce((sum: number, d: Donation) => sum + d.amount, 0) / donations.length)
            : 0,
    };

    return { stats, isLoading };
}
