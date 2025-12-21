"use client";
// 후원자 랭킹 컴포넌트
// TOP 후원자 표시

import { motion } from "framer-motion";

interface DonorRanking {
    rank: number;
    name: string;
    amount: number;
    count: number;
}

interface DonorRankingProps {
    donors: DonorRanking[];
    title?: string;
    limit?: number;
    className?: string;
}

// 순위별 메달/배지
const rankBadges: Record<number, { emoji: string; color: string }> = {
    1: { emoji: '🥇', color: 'from-yellow-400 to-yellow-500' },
    2: { emoji: '🥈', color: 'from-gray-300 to-gray-400' },
    3: { emoji: '🥉', color: 'from-amber-600 to-amber-700' },
};

export function DonorRanking({
    donors,
    title = "이번 달 TOP 후원자",
    limit = 5,
    className = ""
}: DonorRankingProps) {
    const displayDonors = donors.slice(0, limit);

    if (displayDonors.length === 0) {
        return (
            <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
                <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                    🏆 {title}
                </h3>
                <div className="text-center py-8 text-[#666] dark:text-gray-400">
                    아직 후원 내역이 없습니다
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
            <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                🏆 {title}
            </h3>
            <div className="space-y-3">
                {displayDonors.map((donor, index) => {
                    const badge = rankBadges[donor.rank];

                    return (
                        <motion.div
                            key={donor.name}
                            className={`flex items-center gap-3 p-3 rounded-xl ${donor.rank <= 3
                                    ? 'bg-gradient-to-r from-[#FFFACD]/50 to-transparent'
                                    : 'bg-gray-50 dark:bg-gray-700/50'
                                }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* 순위 */}
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                                {badge ? (
                                    <span className="text-2xl">{badge.emoji}</span>
                                ) : (
                                    <span className="text-lg font-bold text-[#666] dark:text-gray-400">
                                        {donor.rank}
                                    </span>
                                )}
                            </div>

                            {/* 이름 */}
                            <div className="flex-1">
                                <p className="font-medium text-[#333] dark:text-white">
                                    {donor.name}
                                </p>
                                <p className="text-xs text-[#666] dark:text-gray-400">
                                    {donor.count}회 후원
                                </p>
                            </div>

                            {/* 금액 */}
                            <div className="text-right">
                                <p className="font-bold text-[#FF6B6B]">
                                    ₩{donor.amount.toLocaleString()}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

// 크리에이터 랭킹 (관리자용)
interface CreatorRanking {
    rank: number;
    name: string;
    handle: string;
    avatar: string;
    totalDonations: number;
    donationCount: number;
}

interface CreatorRankingProps {
    creators: CreatorRanking[];
    title?: string;
    className?: string;
}

export function CreatorRanking({
    creators,
    title = "TOP 크리에이터",
    className = ""
}: CreatorRankingProps) {
    if (creators.length === 0) {
        return (
            <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
                <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4">
                    👑 {title}
                </h3>
                <div className="text-center py-8 text-[#666] dark:text-gray-400">
                    데이터가 없습니다
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
            <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                👑 {title}
            </h3>
            <div className="space-y-3">
                {creators.map((creator, index) => {
                    const badge = rankBadges[creator.rank];

                    return (
                        <motion.div
                            key={creator.handle}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            {/* 순위 */}
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                {badge ? (
                                    <span className="text-xl">{badge.emoji}</span>
                                ) : (
                                    <span className="font-bold text-[#666] dark:text-gray-400">
                                        {creator.rank}
                                    </span>
                                )}
                            </div>

                            {/* 아바타 */}
                            <span className="text-2xl">{creator.avatar}</span>

                            {/* 정보 */}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-[#333] dark:text-white truncate">
                                    {creator.name}
                                </p>
                                <p className="text-xs text-[#666] dark:text-gray-400">
                                    @{creator.handle} · {creator.donationCount}건
                                </p>
                            </div>

                            {/* 금액 */}
                            <div className="text-right">
                                <p className="font-bold text-[#FF6B6B]">
                                    ₩{creator.totalDonations.toLocaleString()}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
