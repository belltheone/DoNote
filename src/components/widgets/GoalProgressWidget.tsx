"use client";
// 목표 프로그레스 바 위젯
// 크리에이터가 설정한 후원 목표 달성률 표시

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getAllDonations, type Donation } from "@/lib/supabase";

interface GoalProgressWidgetProps {
    creatorId: string;
    creatorHandle: string;
    goalAmount: number;
    goalTitle: string;
    showDonors?: boolean;
    theme?: "coral" | "yellow" | "mint" | "dark";
}

export function GoalProgressWidget({
    creatorId,
    creatorHandle,
    goalAmount,
    goalTitle,
    showDonors = true,
    theme = "coral",
}: GoalProgressWidgetProps) {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 테마별 색상
    const themeColors = {
        coral: { primary: "#FF6B6B", secondary: "#FFE4E1", text: "#333" },
        yellow: { primary: "#FFD95A", secondary: "#FFFACD", text: "#333" },
        mint: { primary: "#4ECDC4", secondary: "#E0F7F6", text: "#333" },
        dark: { primary: "#FF6B6B", secondary: "#2D2D2D", text: "#FFF" },
    };
    const colors = themeColors[theme];

    // 후원 데이터 로드
    useEffect(() => {
        const loadDonations = async () => {
            const data = await getAllDonations();
            const creatorDonations = data.filter(d => d.creatorId === creatorId);
            setDonations(creatorDonations);
            setIsLoading(false);
        };
        loadDonations();
    }, [creatorId]);

    // 현재 달성 금액
    const currentAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    const progressPercent = Math.min((currentAmount / goalAmount) * 100, 100);
    const isCompleted = currentAmount >= goalAmount;

    // 최근 후원자 (상위 5명)
    const recentDonors = donations.slice(0, 5);

    if (isLoading) {
        return (
            <div
                className="rounded-xl p-6 animate-pulse"
                style={{ backgroundColor: colors.secondary }}
            >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
            </div>
        );
    }

    return (
        <motion.div
            className="rounded-xl p-6 shadow-lg"
            style={{ backgroundColor: colors.secondary, color: colors.text }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* 목표 제목 */}
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{isCompleted ? "🎉" : "🎯"}</span>
                <h3 className="font-bold">{goalTitle}</h3>
            </div>

            {/* 프로그레스 바 */}
            <div className="relative h-8 bg-white/50 rounded-full overflow-hidden mb-2">
                <motion.div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{ backgroundColor: colors.primary }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
                <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                    {progressPercent.toFixed(0)}%
                </div>
            </div>

            {/* 금액 표시 */}
            <div className="flex justify-between text-sm mb-4">
                <span>₩{currentAmount.toLocaleString()}</span>
                <span>₩{goalAmount.toLocaleString()}</span>
            </div>

            {/* 최근 후원자 */}
            {showDonors && recentDonors.length > 0 && (
                <div className="border-t border-white/30 pt-4 mt-4">
                    <p className="text-xs opacity-70 mb-2">최근 후원자</p>
                    <div className="flex flex-wrap gap-1">
                        {recentDonors.map((donor, i) => (
                            <span
                                key={i}
                                className="text-sm px-2 py-1 rounded-full"
                                style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                            >
                                {donor.sticker} {donor.donorName}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* 후원하기 버튼 */}
            <a
                href={`https://www.donote.site/${creatorHandle}`}
                className="block text-center py-3 rounded-lg font-bold mt-4 transition-transform hover:scale-105"
                style={{ backgroundColor: colors.primary, color: "white" }}
            >
                🍩 응원하기
            </a>
        </motion.div>
    );
}
