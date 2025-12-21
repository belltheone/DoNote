"use client";
// 분석/통계 탭 - 방문자, 인기 크리에이터, 차트

import { motion } from "framer-motion";
import type { CreatorProfile, Donation } from "@/lib/supabase";

// Props 타입
interface AnalyticsTabProps {
    creators: CreatorProfile[];
    donations: Donation[];
}

export function AnalyticsTab({ creators, donations }: AnalyticsTabProps) {
    // 크리에이터별 통계
    const creatorStats = creators.map(creator => {
        const creatorDonations = donations.filter(d => d.creatorId === creator.id);
        return {
            ...creator,
            totalAmount: creatorDonations.reduce((sum, d) => sum + d.amount, 0),
            count: creatorDonations.length,
        };
    }).sort((a, b) => b.totalAmount - a.totalAmount);

    // 일별 후원 데이터 (최근 14일, Mock - 고정값)
    const dailyData = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (13 - i));
        // 인덱스 기반 고정값 생성
        const baseAmount = 50000 + (i * 7000) + ((i % 3) * 15000);
        const baseCount = 5 + (i % 7) + ((i % 4) * 2);
        return {
            date: `${date.getMonth() + 1}/${date.getDate()}`,
            amount: baseAmount,
            count: baseCount,
        };
    });

    // 방문자 통계 (Mock - GA4 연동 시 실제 데이터, 고정값)
    const visitorStats = {
        today: 342,
        week: 1847,
        month: 6523,
        avgSessionDuration: "2:34",
        bounceRate: "42.3%",
    };

    return (
        <div className="space-y-6">
            {/* 방문자 개요 */}
            <div className="grid md:grid-cols-5 gap-4">
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-sm text-[#666]">오늘 방문자</p>
                    <p className="text-2xl font-bold text-[#333] mt-1">{visitorStats.today}</p>
                </motion.div>
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <p className="text-sm text-[#666]">주간 방문자</p>
                    <p className="text-2xl font-bold text-[#333] mt-1">{visitorStats.week}</p>
                </motion.div>
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <p className="text-sm text-[#666]">월간 방문자</p>
                    <p className="text-2xl font-bold text-[#333] mt-1">{visitorStats.month}</p>
                </motion.div>
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <p className="text-sm text-[#666]">평균 체류시간</p>
                    <p className="text-2xl font-bold text-[#333] mt-1">{visitorStats.avgSessionDuration}</p>
                </motion.div>
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <p className="text-sm text-[#666]">이탈률</p>
                    <p className="text-2xl font-bold text-[#333] mt-1">{visitorStats.bounceRate}</p>
                </motion.div>
            </div>

            {/* 14일 후원 추이 차트 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#333] mb-4">📈 최근 14일 후원 추이</h3>
                <div className="h-48 flex items-end justify-between gap-1">
                    {dailyData.map((data, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-xs text-[#999]">₩{Math.floor(data.amount / 1000)}k</span>
                            <motion.div
                                className="w-full bg-gradient-to-t from-[#FF6B6B] to-[#FFD95A] rounded-t"
                                initial={{ height: 0 }}
                                animate={{ height: `${(data.amount / 150000) * 100}%` }}
                                transition={{ delay: i * 0.03, duration: 0.4 }}
                            />
                            <span className="text-xs text-[#666] whitespace-nowrap">{data.date}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* TOP 10 크리에이터 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-[#333] mb-4">👑 TOP 10 인기 크리에이터</h3>
                    <div className="space-y-3">
                        {creatorStats.slice(0, 10).map((creator, i) => (
                            <div key={creator.id} className="flex items-center gap-3">
                                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-[#FFD95A] text-[#333]' :
                                    i === 1 ? 'bg-gray-300 text-[#333]' :
                                        i === 2 ? 'bg-[#CD7F32] text-white' :
                                            'bg-gray-100 text-[#666]'
                                    }`}>
                                    {i + 1}
                                </span>
                                <span className="text-xl">{creator.avatar}</span>
                                <span className="flex-1 font-medium text-[#333] truncate">{creator.displayName}</span>
                                <span className="text-sm font-bold text-[#FF6B6B]">
                                    ₩{creator.totalAmount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                        {creatorStats.length === 0 && (
                            <p className="text-center text-[#666] py-4">데이터가 없습니다.</p>
                        )}
                    </div>
                </div>

                {/* 일별 통계 테이블 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-[#333] mb-4">📊 일별 후원 통계</h3>
                    <div className="max-h-80 overflow-y-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="text-left text-[#666] font-medium px-3 py-2">날짜</th>
                                    <th className="text-right text-[#666] font-medium px-3 py-2">건수</th>
                                    <th className="text-right text-[#666] font-medium px-3 py-2">금액</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyData.slice().reverse().map((data, i) => (
                                    <tr key={i} className="border-t border-gray-100">
                                        <td className="px-3 py-2 text-[#333]">{data.date}</td>
                                        <td className="px-3 py-2 text-right text-[#666]">{data.count}건</td>
                                        <td className="px-3 py-2 text-right font-medium text-[#FF6B6B]">
                                            ₩{data.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* GA4 연동 안내 */}
            <div className="bg-gradient-to-r from-[#FF6B6B]/10 to-[#FFD95A]/10 rounded-xl p-6 border border-[#FFD95A]/30">
                <div className="flex items-start gap-4">
                    <span className="text-3xl">📊</span>
                    <div>
                        <h4 className="font-bold text-[#333]">Google Analytics 4 연동</h4>
                        <p className="text-sm text-[#666] mt-1">
                            GA4가 연동되어 있습니다. 더 자세한 분석은 Google Analytics 대시보드에서 확인하세요.
                        </p>
                        <a
                            href="https://analytics.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3 px-4 py-2 bg-[#FF6B6B] text-white rounded-lg text-sm hover:bg-[#e55555] transition-colors"
                        >
                            GA4 대시보드 열기 →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
