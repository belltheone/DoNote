"use client";
// 최근 후원자 목록 위젯
// 실시간으로 최근 후원자를 표시하는 위젯

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getAllDonations, type Donation } from "@/lib/supabase";

interface RecentDonorsWidgetProps {
    creatorId: string;
    creatorHandle: string;
    maxDonors?: number;
    showAmount?: boolean;
    showMessage?: boolean;
    theme?: "light" | "dark" | "transparent";
}

export function RecentDonorsWidget({
    creatorId,
    creatorHandle,
    maxDonors = 5,
    showAmount = true,
    showMessage = false,
    theme = "light",
}: RecentDonorsWidgetProps) {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 테마별 스타일
    const themeStyles = {
        light: {
            bg: "bg-white",
            text: "text-[#333]",
            subtext: "text-[#666]",
            border: "border-gray-100",
        },
        dark: {
            bg: "bg-gray-800",
            text: "text-white",
            subtext: "text-gray-400",
            border: "border-gray-700",
        },
        transparent: {
            bg: "bg-white/80 backdrop-blur-md",
            text: "text-[#333]",
            subtext: "text-[#666]",
            border: "border-white/30",
        },
    };
    const styles = themeStyles[theme];

    // 후원 데이터 로드
    useEffect(() => {
        const loadDonations = async () => {
            const data = await getAllDonations();
            const creatorDonations = data
                .filter(d => d.creatorId === creatorId)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, maxDonors);
            setDonations(creatorDonations);
            setIsLoading(false);
        };
        loadDonations();

        // 30초마다 새로고침
        const interval = setInterval(loadDonations, 30000);
        return () => clearInterval(interval);
    }, [creatorId, maxDonors]);

    // 상대 시간 계산
    const getRelativeTime = (dateStr: string) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "방금 전";
        if (diffMins < 60) return `${diffMins}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        if (diffDays < 7) return `${diffDays}일 전`;
        return date.toLocaleDateString("ko-KR");
    };

    if (isLoading) {
        return (
            <div className={`${styles.bg} rounded-xl p-4 shadow-lg`}>
                <div className="animate-pulse space-y-3">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full" />
                            <div className="flex-1">
                                <div className="h-3 bg-gray-200 rounded w-24 mb-1" />
                                <div className="h-2 bg-gray-200 rounded w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className={`${styles.bg} rounded-xl shadow-lg overflow-hidden`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* 헤더 */}
            <div className={`px-4 py-3 border-b ${styles.border}`}>
                <div className="flex items-center gap-2">
                    <span className="text-lg">🍩</span>
                    <h3 className={`font-bold ${styles.text}`}>최근 후원</h3>
                </div>
            </div>

            {/* 후원자 목록 */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <AnimatePresence mode="popLayout">
                    {donations.length > 0 ? donations.map((donation, index) => (
                        <motion.div
                            key={donation.id}
                            className="px-4 py-3 flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* 스티커 */}
                            <div className="w-10 h-10 rounded-full bg-[#FFFACD] flex items-center justify-center text-xl">
                                {donation.sticker}
                            </div>

                            {/* 정보 */}
                            <div className="flex-1 min-w-0">
                                <p className={`font-medium ${styles.text} truncate`}>
                                    {donation.donorName}
                                </p>
                                {showMessage && donation.message && (
                                    <p className={`text-xs ${styles.subtext} truncate`}>
                                        &ldquo;{donation.message}&rdquo;
                                    </p>
                                )}
                                <p className={`text-xs ${styles.subtext}`}>
                                    {getRelativeTime(donation.createdAt)}
                                </p>
                            </div>

                            {/* 금액 */}
                            {showAmount && (
                                <span className="text-[#FF6B6B] font-bold">
                                    ₩{donation.amount.toLocaleString()}
                                </span>
                            )}
                        </motion.div>
                    )) : (
                        <div className={`px-4 py-8 text-center ${styles.subtext}`}>
                            <span className="text-3xl block mb-2">🤔</span>
                            <p>아직 후원이 없어요</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* 푸터 */}
            <div className={`px-4 py-3 border-t ${styles.border}`}>
                <a
                    href={`https://www.donote.site/${creatorHandle}`}
                    className="block text-center py-2 rounded-lg bg-[#FF6B6B] text-white font-medium hover:bg-[#FF5252] transition-colors"
                >
                    나도 응원하기 💌
                </a>
            </div>
        </motion.div>
    );
}
