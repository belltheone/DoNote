"use client";
// 실시간 후원 알림 컴포넌트
// Supabase Realtime을 사용하여 새 후원 도착 시 알림

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

// 알림 타입
interface DonationNotification {
    id: string;
    donorName: string;
    amount: number;
    message: string;
    sticker: string;
    createdAt: string;
}

interface RealtimeDonationAlertProps {
    creatorId: string;
    enabled?: boolean;
    soundEnabled?: boolean;
}

export function RealtimeDonationAlert({
    creatorId,
    enabled = true,
    soundEnabled = true,
}: RealtimeDonationAlertProps) {
    const [notifications, setNotifications] = useState<DonationNotification[]>([]);

    // 알림 소리 재생
    const playNotificationSound = () => {
        if (soundEnabled && typeof window !== "undefined") {
            const audio = new Audio("/sounds/notification.mp3");
            audio.volume = 0.5;
            audio.play().catch(() => {
                // 자동 재생 차단된 경우 무시
            });
        }
    };

    // 알림 제거
    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Supabase Realtime 구독
    useEffect(() => {
        if (!enabled || !creatorId) return;

        const channel = supabase
            .channel(`donations:${creatorId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "donations",
                    filter: `creator_id=eq.${creatorId}`,
                },
                (payload) => {
                    const newDonation = payload.new as {
                        id: string;
                        donor_name: string;
                        amount: number;
                        message: string;
                        sticker: string;
                        created_at: string;
                    };

                    const notification: DonationNotification = {
                        id: newDonation.id,
                        donorName: newDonation.donor_name,
                        amount: newDonation.amount,
                        message: newDonation.message,
                        sticker: newDonation.sticker || "💌",
                        createdAt: newDonation.created_at,
                    };

                    setNotifications(prev => [notification, ...prev]);
                    playNotificationSound();

                    // 10초 후 자동 제거
                    setTimeout(() => {
                        removeNotification(notification.id);
                    }, 10000);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [creatorId, enabled, soundEnabled]);

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl border-2 border-[#FFD95A]"
                    >
                        {/* 헤더 */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{notification.sticker}</span>
                                <span className="font-bold text-[#333] dark:text-white">
                                    새 후원!
                                </span>
                            </div>
                            <button
                                onClick={() => removeNotification(notification.id)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        {/* 내용 */}
                        <div className="space-y-1">
                            <p className="text-sm text-[#666] dark:text-gray-400">
                                <span className="font-medium text-[#333] dark:text-white">
                                    {notification.donorName}
                                </span>
                                님이 후원해주셨어요!
                            </p>
                            <p className="text-xl font-bold text-[#FF6B6B]">
                                ₩{notification.amount.toLocaleString()}
                            </p>
                            {notification.message && (
                                <p className="text-sm text-[#999] dark:text-gray-500 italic line-clamp-2">
                                    &ldquo;{notification.message}&rdquo;
                                </p>
                            )}
                        </div>

                        {/* 프로그레스 바 (자동 닫힘 표시) */}
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-[#FFD95A] rounded-b-xl"
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 10, ease: "linear" }}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
