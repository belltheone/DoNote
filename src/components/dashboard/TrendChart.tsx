"use client";
// 7일 추세 그래프 컴포넌트
// 대시보드 및 분석 페이지에서 재사용 가능

import { motion } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// Props 타입
interface TrendChartProps {
    data: { date: string; amount: number; count: number }[];
    title?: string;
    showCount?: boolean;
    height?: number;
    className?: string;
}

// 7일 추세 그래프 컴포넌트
export function TrendChart({
    data,
    title = "최근 7일 추세",
    showCount = false,
    height = 256,
    className = "",
}: TrendChartProps) {
    // 데이터가 없으면 빈 상태 표시
    if (!data || data.length === 0) {
        return (
            <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
                <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                    <span>📈</span> {title}
                </h3>
                <div className="h-48 flex items-center justify-center">
                    <div className="text-center">
                        <span className="text-4xl mb-2 block">📊</span>
                        <p className="text-[#666] dark:text-gray-400">아직 데이터가 없어요</p>
                    </div>
                </div>
            </div>
        );
    }

    // 총합 계산
    const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
    const totalCount = data.reduce((sum, d) => sum + d.count, 0);

    return (
        <motion.div
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#333] dark:text-white flex items-center gap-2">
                    <span>📈</span> {title}
                </h3>
                <div className="text-right">
                    <p className="text-xl font-bold text-[#FF6B6B]">
                        ₩{totalAmount.toLocaleString()}
                    </p>
                    {showCount && (
                        <p className="text-xs text-[#666] dark:text-gray-400">
                            {totalCount}건
                        </p>
                    )}
                </div>
            </div>

            {/* 차트 */}
            <div style={{ height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: '#666' }}
                            axisLine={{ stroke: '#e0e0e0' }}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#666' }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255,255,255,0.95)',
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                padding: '12px 16px',
                            }}
                            formatter={(value) => [`₩${(value ?? 0).toLocaleString()}`, '후원금']}
                            labelFormatter={(label) => `📅 ${label}`}
                        />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#FF6B6B"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAmount)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* 일별 요약 (컴팩트) */}
            <div className="flex gap-1 mt-4 overflow-x-auto">
                {data.map((day, i) => (
                    <div
                        key={i}
                        className="flex-1 min-w-[60px] text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                        <p className="text-xs text-[#999] dark:text-gray-400">
                            {day.date.split(' ')[1]?.replace('일', '') || day.date}
                        </p>
                        <p className="text-sm font-bold text-[#333] dark:text-white">
                            {(day.amount / 1000).toFixed(0)}k
                        </p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// 7일 데이터 생성 헬퍼
export function generateLast7DaysData(
    donations: { amount: number; createdAt: string }[]
): { date: string; amount: number; count: number }[] {
    return Array(7).fill(0).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));

        const dayDonations = donations.filter(d => {
            const dDate = new Date(d.createdAt);
            return dDate.toDateString() === date.toDateString();
        });

        return {
            date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
            amount: dayDonations.reduce((sum, d) => sum + d.amount, 0),
            count: dayDonations.length,
        };
    });
}

export default TrendChart;
