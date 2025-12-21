"use client";
// 분석 페이지 - 후원 통계, recharts 차트, 인사이트
// 다크 모드 지원, 기간 필터링, CSV 내보내기

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { mockDonations, getAllDonations, type Donation } from "@/lib/supabase";
import { StatCardSkeleton, ChartSkeleton } from "@/components/ui/Skeleton";

// 기간 필터 옵션

// 기간 필터 옵션
type DateRange = '7d' | '30d' | '90d' | 'all';

export default function AnalyticsPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState<DateRange>('30d');

    // 데이터 로드
    useEffect(() => {
        const loadData = async () => {
            const data = await getAllDonations();
            setDonations(data.length > 0 ? data : mockDonations);
            setIsLoading(false);
        };
        loadData();
    }, []);

    // 기간별 필터링
    const filteredDonations = useMemo(() => {
        if (dateRange === 'all') return donations;

        const now = new Date();
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        return donations.filter(d => new Date(d.createdAt) >= cutoff);
    }, [donations, dateRange]);

    // CSV 내보내기
    const exportToCSV = () => {
        const headers = ['날짜', '후원자', '금액', '메시지', '스티커', '팁 포함'];
        const rows = filteredDonations.map(d => [
            new Date(d.createdAt).toLocaleString('ko-KR'),
            d.donorName,
            d.amount.toString(),
            `"${d.message.replace(/"/g, '""')}"`,
            d.sticker,
            d.isTipIncluded ? '예' : '아니오'
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `donote_analytics_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // 통계 계산 (필터링된 데이터 사용)
    const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0);
    const avgAmount = filteredDonations.length > 0 ? Math.round(totalAmount / filteredDonations.length) : 0;
    const tipCount = filteredDonations.filter(d => d.isTipIncluded).length;

    // 시간대별 데이터 (recharts용)
    const hourlyData = Array(24).fill(0).map((_, hour) => {
        const count = filteredDonations.filter(d => new Date(d.createdAt).getHours() === hour).length;
        return { hour: `${hour}시`, count, amount: filteredDonations.filter(d => new Date(d.createdAt).getHours() === hour).reduce((sum, d) => sum + d.amount, 0) };
    });

    // 금액별 분포 (파이 차트용)
    const amountDistribution = [
        { name: "3,000원", value: filteredDonations.filter(d => d.amount === 3000).length, color: "#FFD95A" },
        { name: "5,000원", value: filteredDonations.filter(d => d.amount === 5000).length, color: "#FF6B6B" },
        { name: "10,000원+", value: filteredDonations.filter(d => d.amount >= 10000).length, color: "#4ECDC4" },
        { name: "기타", value: filteredDonations.filter(d => d.amount !== 3000 && d.amount !== 5000 && d.amount < 10000).length, color: "#96CEB4" },
    ].filter(d => d.value > 0);

    // 트렌드 데이터 (기간에 따라 동적)
    const trendDays = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 30;
    const trendData = Array(Math.min(trendDays, 14)).fill(0).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (Math.min(trendDays, 14) - 1 - i));
        const dayDonations = filteredDonations.filter(d => {
            const dDate = new Date(d.createdAt);
            return dDate.toDateString() === date.toDateString();
        });
        return {
            date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
            count: dayDonations.length,
            amount: dayDonations.reduce((sum, d) => sum + d.amount, 0) / 1000,
        };
    });

    // 최고의 팬
    const topFans = (() => {
        const fanMap = new Map<string, { name: string; amount: number; count: number }>();
        filteredDonations.forEach(d => {
            const existing = fanMap.get(d.donorName) || { name: d.donorName, amount: 0, count: 0 };
            fanMap.set(d.donorName, { ...existing, amount: existing.amount + d.amount, count: existing.count + 1 });
        });
        return Array.from(fanMap.values()).sort((a, b) => b.amount - a.amount).slice(0, 5);
    })();

    // 로딩 중
    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                    <ChartSkeleton />
                    <ChartSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* 필터 및 내보내기 */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                    {(['7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateRange === range
                                ? 'bg-[#FF6B6B] text-white'
                                : 'bg-white dark:bg-gray-800 text-[#666] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                                }`}
                        >
                            {range === '7d' ? '7일' : range === '30d' ? '30일' : range === '90d' ? '90일' : '전체'}
                        </button>
                    ))}
                </div>
                <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FFD95A] text-[#333] rounded-lg text-sm font-medium hover:bg-[#FFCE3A] transition-colors"
                >
                    📥 CSV 내보내기
                </button>
            </div>

            {/* 통계 요약 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: "총 후원금", value: `₩${totalAmount.toLocaleString()}`, icon: "💰", desc: "지금까지 받은 모든 후원", color: "from-yellow-400 to-orange-500" },
                    { label: "평균 후원액", value: `₩${avgAmount.toLocaleString()}`, icon: "📊", desc: "쪽지 1개당 평균", color: "from-blue-400 to-purple-500" },
                    { label: "플랫폼 팁", value: `₩${(tipCount * 500).toLocaleString()}`, icon: "🍩", desc: "도노트에 보내주신 사랑", color: "from-pink-400 to-red-500" },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        {/* 그라데이션 배경 */}
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`} />

                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-sm text-[#666] dark:text-gray-400">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-bold text-[#333] dark:text-white mb-1">{stat.value}</p>
                        <p className="text-xs text-[#999] dark:text-gray-500">{stat.desc}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* 트렌드 차트 (Area Chart) */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                        <span>📈</span> {dateRange === '7d' ? '7일' : dateRange === '30d' ? '30일' : dateRange === '90d' ? '90일' : '전체'} 트렌드
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                    formatter={(value) => [`₩${(Number(value) * 1000).toLocaleString()}`, '후원금']}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#FF6B6B" fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* 시간대별 후원 (Bar Chart) */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                        <span>🕐</span> 시간대별 후원
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData.filter((_, i) => i % 2 === 0)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Bar dataKey="count" fill="#FFD95A" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* 금액 분포 (Pie Chart) */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                        <span>🍰</span> 금액별 분포
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={amountDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {amountDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* 최고의 팬 */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                        <span>🏆</span> 최고의 팬
                    </h3>

                    <div className="space-y-4">
                        {topFans.map((fan, index) => (
                            <motion.div
                                key={fan.name}
                                className="flex items-center gap-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                                    index === 1 ? 'bg-gray-200 dark:bg-gray-600 text-[#666] dark:text-gray-300' :
                                        index === 2 ? 'bg-[#CD7F32]/30 text-[#8B4513]' :
                                            'bg-gray-100 dark:bg-gray-700 text-[#999] dark:text-gray-400'
                                    }`}>
                                    {index === 0 ? '👑' : index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-[#333] dark:text-white">{fan.name}</p>
                                    <p className="text-xs text-[#999] dark:text-gray-400">{fan.count}회 후원</p>
                                </div>
                                <p className="font-bold text-[#FF6B6B]">₩{fan.amount.toLocaleString()}</p>
                            </motion.div>
                        ))}
                        {topFans.length === 0 && (
                            <div className="text-center py-8">
                                <span className="text-4xl mb-2 block">🤔</span>
                                <p className="text-[#666] dark:text-gray-400">아직 데이터가 부족해요</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
