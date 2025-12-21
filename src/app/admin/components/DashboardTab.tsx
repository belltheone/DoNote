"use client";
// 대시보드 탭 - 홈 화면 (오늘 요약, 실시간 피드, 추이 차트)

import { motion } from "framer-motion";
import type { CreatorProfile, Donation } from "@/lib/supabase";

// Props 타입
interface DashboardTabProps {
    creators: CreatorProfile[];
    donations: Donation[];
    settlements: { id: string; status: string; amount: number }[];
    isLoading: boolean;
}

// 수수료율
const FEE_RATE = 0.05;

export function DashboardTab({ creators, donations, settlements, isLoading }: DashboardTabProps) {
    // 통계 계산
    const totalDonationsAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    const totalFee = Math.floor(totalDonationsAmount * FEE_RATE);
    const pendingSettlements = settlements.filter(s => s.status === 'pending').length;

    // 오늘 통계
    const today = new Date().toISOString().split('T')[0];
    const todayDonations = donations.filter(d => d.createdAt.startsWith(today));
    const todayAmount = todayDonations.reduce((sum, d) => sum + d.amount, 0);

    // 최근 7일 추이 (Mock - 고정값)
    const weeklyData = Array.from({ length: 7 }, (_, i) => ({
        day: ['일', '월', '화', '수', '목', '금', '토'][(new Date().getDay() - 6 + i + 7) % 7],
        amount: 30000 + (i * 12000) + ((i % 2) * 8000),
    }));

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-[#FF6B6B] border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 오늘의 요약 */}
            <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A] rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">📅 오늘의 요약</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold">{todayDonations.length}</p>
                        <p className="text-sm opacity-80">오늘 후원</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold">₩{todayAmount.toLocaleString()}</p>
                        <p className="text-sm opacity-80">오늘 금액</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold">{creators.length}</p>
                        <p className="text-sm opacity-80">총 크리에이터</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold">{pendingSettlements}</p>
                        <p className="text-sm opacity-80">정산 대기</p>
                    </div>
                </div>
            </div>

            {/* 통계 카드 */}
            <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FFFACD] rounded-xl flex items-center justify-center text-2xl">💰</div>
                        <div>
                            <p className="text-sm text-[#666]">총 후원금</p>
                            <p className="text-2xl font-bold text-[#333]">₩{totalDonationsAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FFE4E1] rounded-xl flex items-center justify-center text-2xl">🍩</div>
                        <div>
                            <p className="text-sm text-[#666]">도노트 수수료 ({FEE_RATE * 100}%)</p>
                            <p className="text-2xl font-bold text-[#FF6B6B]">₩{totalFee.toLocaleString()}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center text-2xl">📊</div>
                        <div>
                            <p className="text-sm text-[#666]">총 후원 건수</p>
                            <p className="text-2xl font-bold text-[#333]">{donations.length}건</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 7일 추이 차트 (간단 바 차트) */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#333] mb-4">📈 최근 7일 후원 추이</h3>
                <div className="flex items-end justify-between h-40 gap-2">
                    {weeklyData.map((data, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <motion.div
                                className="w-full bg-gradient-to-t from-[#FF6B6B] to-[#FFD95A] rounded-t-lg"
                                initial={{ height: 0 }}
                                animate={{ height: `${(data.amount / 100000) * 100}%` }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            />
                            <span className="text-xs text-[#666]">{data.day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 최근 활동 피드 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#333] mb-4">🔔 최근 활동</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {donations.slice(0, 10).map((donation, i) => (
                        <motion.div
                            key={donation.id}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <span className="text-xl">{donation.sticker}</span>
                            <div className="flex-1">
                                <p className="text-sm text-[#333]">
                                    <strong>{donation.donorName}</strong>님이 후원
                                </p>
                                <p className="text-xs text-[#666]">{donation.message?.slice(0, 30)}...</p>
                            </div>
                            <span className="text-sm font-bold text-[#FF6B6B]">
                                ₩{donation.amount.toLocaleString()}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
