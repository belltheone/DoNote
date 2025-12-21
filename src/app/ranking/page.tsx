"use client";
// 크리에이터 순위 페이지 - 인기 크리에이터 랭킹
// 후원 받은 금액 기준 순위 표시

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllCreators, getAllDonations, type CreatorProfile } from "@/lib/supabase";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// 순위별 메달 이모지
const MEDALS = ["🥇", "🥈", "🥉"];

// 뱃지 시스템
const BADGES = {
    supporter: { emoji: "💝", name: "서포터", desc: "첫 후원 받음", threshold: 1 },
    rising: { emoji: "🌟", name: "라이징", desc: "10회 이상 후원", threshold: 10 },
    popular: { emoji: "🔥", name: "인기", desc: "50회 이상 후원", threshold: 50 },
    legendary: { emoji: "👑", name: "레전드", desc: "100회 이상 후원", threshold: 100 },
};

// 크리에이터 순위 데이터 타입
interface CreatorRanking extends CreatorProfile {
    totalAmount: number;
    donationCount: number;
    badges: string[];
}

export default function RankingPage() {
    const [rankings, setRankings] = useState<CreatorRanking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'all' | 'month' | 'week'>('all');

    // 데이터 로드 및 순위 계산
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            const [creators, donations] = await Promise.all([
                getAllCreators(),
                getAllDonations(),
            ]);

            // 기간 필터링
            const now = new Date();
            const filteredDonations = donations.filter(d => {
                if (period === 'all') return true;
                const dDate = new Date(d.createdAt);
                if (period === 'week') {
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return dDate >= weekAgo;
                }
                if (period === 'month') {
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return dDate >= monthAgo;
                }
                return true;
            });

            // 크리에이터별 통계 계산
            const creatorStats = new Map<string, { amount: number; count: number }>();
            filteredDonations.forEach(d => {
                const stats = creatorStats.get(d.creatorId) || { amount: 0, count: 0 };
                creatorStats.set(d.creatorId, {
                    amount: stats.amount + d.amount,
                    count: stats.count + 1,
                });
            });

            // 순위 데이터 생성
            const rankedCreators: CreatorRanking[] = creators.map(creator => {
                const stats = creatorStats.get(creator.id) || { amount: 0, count: 0 };

                // 뱃지 계산
                const badges: string[] = [];
                if (stats.count >= BADGES.legendary.threshold) badges.push("legendary");
                else if (stats.count >= BADGES.popular.threshold) badges.push("popular");
                else if (stats.count >= BADGES.rising.threshold) badges.push("rising");
                else if (stats.count >= BADGES.supporter.threshold) badges.push("supporter");

                return {
                    ...creator,
                    totalAmount: stats.amount,
                    donationCount: stats.count,
                    badges,
                };
            })
                .filter(c => c.donationCount > 0)
                .sort((a, b) => b.totalAmount - a.totalAmount);

            setRankings(rankedCreators);
            setIsLoading(false);
        };
        loadData();
    }, [period]);

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex flex-col">
            <Header />

            <main className="flex-1 py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* 페이지 헤더 */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-[#333] dark:text-white mb-4">
                            🏆 크리에이터 순위
                        </h1>
                        <p className="text-[#666] dark:text-gray-400">
                            팬들의 사랑을 많이 받은 크리에이터들을 확인해보세요!
                        </p>
                    </motion.div>

                    {/* 기간 필터 */}
                    <div className="flex justify-center gap-2 mb-8">
                        {([
                            { value: 'all', label: '전체' },
                            { value: 'month', label: '이번 달' },
                            { value: 'week', label: '이번 주' },
                        ] as const).map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setPeriod(value)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${period === value
                                    ? 'bg-[#FF6B6B] text-white'
                                    : 'bg-white dark:bg-gray-800 text-[#666] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* 로딩 */}
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <motion.div
                                className="text-4xl"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                🍩
                            </motion.div>
                        </div>
                    ) : rankings.length === 0 ? (
                        <div className="text-center py-20">
                            <span className="text-6xl mb-4 block">🤔</span>
                            <p className="text-[#666] dark:text-gray-400">
                                아직 순위 데이터가 없습니다.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {rankings.map((creator, index) => (
                                <motion.div
                                    key={creator.id}
                                    className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border ${index < 3
                                        ? 'border-[#FFD95A] dark:border-yellow-600'
                                        : 'border-gray-100 dark:border-gray-700'
                                        }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* 순위 */}
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                                                index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                                                    'bg-gray-100 dark:bg-gray-700 text-[#666] dark:text-gray-400'
                                            }`}>
                                            {index < 3 ? MEDALS[index] : index + 1}
                                        </div>

                                        {/* 프로필 */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-2xl">{creator.avatar}</span>
                                                <Link
                                                    href={`/${creator.handle}`}
                                                    className="font-bold text-[#333] dark:text-white hover:text-[#FF6B6B] transition-colors"
                                                >
                                                    {creator.displayName}
                                                </Link>
                                                {/* 뱃지 */}
                                                {creator.badges.map(badge => (
                                                    <span
                                                        key={badge}
                                                        className="text-sm"
                                                        title={BADGES[badge as keyof typeof BADGES]?.name}
                                                    >
                                                        {BADGES[badge as keyof typeof BADGES]?.emoji}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-sm text-[#666] dark:text-gray-400">
                                                @{creator.handle} · {creator.donationCount}회 후원
                                            </p>
                                        </div>

                                        {/* 금액 */}
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-[#FF6B6B]">
                                                ₩{creator.totalAmount.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-[#999] dark:text-gray-500">
                                                누적 후원금
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
