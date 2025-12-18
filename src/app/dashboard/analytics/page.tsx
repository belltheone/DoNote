"use client";
// 분석 페이지 - 후원 통계, 차트, 인사이트

import { motion } from "framer-motion";
import { getStats, getHourlyAnalysis, getTopFans, mockDonations } from "@/lib/supabase";

export default function AnalyticsPage() {
    const stats = getStats();
    const hourlyData = getHourlyAnalysis();
    const topFans = getTopFans();

    // 최대 시간대 값 (차트 스케일용)
    const maxHour = Math.max(...hourlyData);

    return (
        <div className="max-w-6xl mx-auto">
            {/* 통계 요약 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: "총 후원금", value: `₩${stats.totalAmount.toLocaleString()}`, icon: "💰", desc: "지금까지 받은 모든 후원" },
                    { label: "평균 후원액", value: `₩${Math.round(stats.totalAmount / stats.totalNotes).toLocaleString()}`, icon: "📊", desc: "쪽지 1개당 평균" },
                    { label: "플랫폼 팁", value: `₩${(mockDonations.filter(d => d.isTipIncluded).length * 500).toLocaleString()}`, icon: "🍩", desc: "도노트에 보내주신 사랑" },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-sm text-[#666]">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-bold text-[#333] mb-1">{stat.value}</p>
                        <p className="text-xs text-[#999]">{stat.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* 시간대별 후원 차트 */}
                <motion.div
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                        <span>🕐</span> 시간대별 후원
                    </h3>
                    <p className="text-sm text-[#666] mb-6">언제 가장 많은 응원을 받았을까요?</p>

                    {/* 막대 차트 */}
                    <div className="flex items-end gap-1 h-40">
                        {hourlyData.map((count, hour) => (
                            <div key={hour} className="flex-1 flex flex-col items-center">
                                <motion.div
                                    className={`w-full rounded-t transition-colors ${count === maxHour && maxHour > 0
                                            ? 'bg-[#FF6B6B]'
                                            : count > 0
                                                ? 'bg-[#FFD95A]'
                                                : 'bg-gray-100'
                                        }`}
                                    initial={{ height: 0 }}
                                    animate={{ height: maxHour > 0 ? `${(count / maxHour) * 100}%` : '4px' }}
                                    transition={{ delay: 0.5 + hour * 0.02, duration: 0.3 }}
                                />
                                {hour % 6 === 0 && (
                                    <span className="text-xs text-[#999] mt-2">{hour}시</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 인사이트 */}
                    {maxHour > 0 && (
                        <div className="mt-6 p-4 bg-[#FFFACD]/50 rounded-lg">
                            <p className="text-sm text-[#333]">
                                💡 <strong>{hourlyData.indexOf(maxHour)}시</strong>에 가장 많은 후원을 받았어요!
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* 최고의 팬 */}
                <motion.div
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                        <span>🏆</span> 최고의 팬
                    </h3>
                    <p className="text-sm text-[#666] mb-6">가장 많이 응원해주신 분들이에요</p>

                    <div className="space-y-4">
                        {topFans.map((fan, index) => (
                            <motion.div
                                key={fan.name}
                                className="flex items-center gap-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                            >
                                {/* 순위 */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-[#FFD95A] text-[#333]' :
                                        index === 1 ? 'bg-gray-200 text-[#666]' :
                                            index === 2 ? 'bg-[#CD7F32]/30 text-[#8B4513]' :
                                                'bg-gray-100 text-[#999]'
                                    }`}>
                                    {index === 0 ? '👑' : index + 1}
                                </div>

                                {/* 정보 */}
                                <div className="flex-1">
                                    <p className="font-medium text-[#333]">{fan.name}</p>
                                    <p className="text-xs text-[#999]">{fan.count}회 후원</p>
                                </div>

                                {/* 금액 */}
                                <p className="font-bold text-[#FF6B6B]">
                                    ₩{fan.amount.toLocaleString()}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {topFans.length === 0 && (
                        <div className="text-center py-8">
                            <span className="text-4xl mb-2 block">🤔</span>
                            <p className="text-[#666]">아직 데이터가 부족해요</p>
                        </div>
                    )}
                </motion.div>

                {/* 월별 트렌드 */}
                <motion.div
                    className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                        <span>📈</span> 인사이트 요약
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* 가장 인기 있는 금액 */}
                        <div className="p-4 bg-[#E6F3FF] rounded-xl">
                            <p className="text-sm text-[#666] mb-2">가장 인기 있는 금액</p>
                            <p className="text-2xl font-bold text-[#333]">
                                ₩{(() => {
                                    const amounts = mockDonations.map(d => d.amount);
                                    const counts = amounts.reduce((acc, val) => {
                                        acc[val] = (acc[val] || 0) + 1;
                                        return acc;
                                    }, {} as Record<number, number>);
                                    const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                                    return mostCommon ? parseInt(mostCommon[0]).toLocaleString() : 0;
                                })()}
                            </p>
                        </div>

                        {/* 가장 많이 사용된 스티커 */}
                        <div className="p-4 bg-[#FFE4E1] rounded-xl">
                            <p className="text-sm text-[#666] mb-2">가장 많이 사용된 스티커</p>
                            <p className="text-2xl">
                                {(() => {
                                    const stickers = mockDonations.map(d => d.sticker);
                                    const counts = stickers.reduce((acc, val) => {
                                        acc[val] = (acc[val] || 0) + 1;
                                        return acc;
                                    }, {} as Record<string, number>);
                                    const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                                    return mostCommon ? mostCommon[0] : '❓';
                                })()}
                            </p>
                        </div>

                        {/* 평균 메시지 길이 */}
                        <div className="p-4 bg-[#E8F5E9] rounded-xl">
                            <p className="text-sm text-[#666] mb-2">평균 메시지 길이</p>
                            <p className="text-2xl font-bold text-[#333]">
                                {Math.round(mockDonations.reduce((sum, d) => sum + d.message.length, 0) / mockDonations.length)}자
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
