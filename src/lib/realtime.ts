// Supabase Realtime 구독 및 알림 관리
import { supabase } from './supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface DonationEvent {
    id: string;
    creator_id: string;
    donor_name: string;
    amount: number;
    message: string;
    sticker: string;
    created_at: string;
}

type DonationCallback = (donation: DonationEvent) => void;

class RealtimeManager {
    private channel: RealtimeChannel | null = null;
    private callbacks: DonationCallback[] = [];

    /**
     * 크리에이터의 새 후원을 실시간으로 구독
     */
    subscribeToCreatorDonations(creatorId: string, callback: DonationCallback) {
        // 기존 채널이 있으면 제거
        if (this.channel) {
            this.unsubscribe();
        }

        // 콜백 등록
        this.callbacks.push(callback);

        // Realtime 채널 생성
        this.channel = supabase
            .channel(`creator:${creatorId}:donations`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'donations',
                    filter: `creator_id=eq.${creatorId}`,
                },
                (payload) => {
                    const donation = payload.new as DonationEvent;

                    // 모든 콜백 호출
                    this.callbacks.forEach(cb => cb(donation));
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Realtime 구독 완료:', creatorId);
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('❌ Realtime 구독 실패');
                }
            });

        return () => this.unsubscribe();
    }

    /**
     * 전체 후원 스트림 구독 (관리자용)
     */
    subscribeToAllDonations(callback: DonationCallback) {
        this.callbacks.push(callback);

        this.channel = supabase
            .channel('all:donations')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'donations',
                },
                (payload) => {
                    const donation = payload.new as DonationEvent;
                    this.callbacks.forEach(cb => cb(donation));
                }
            )
            .subscribe();

        return () => this.unsubscribe();
    }

    /**
     * 구독 해제
     */
    unsubscribe() {
        if (this.channel) {
            supabase.removeChannel(this.channel);
            this.channel = null;
            this.callbacks = [];
        }
    }
}

// 싱글톤 인스턴스
export const realtimeManager = new RealtimeManager();
