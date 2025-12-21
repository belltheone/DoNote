"use client";
// 후원 통계 차트 컴포넌트
// 대시보드에서 사용하는 통계 시각화

import { motion } from "framer-motion";

interface ChartData {
    label: string;
    value: number;
}

interface BarChartProps {
    data: ChartData[];
    title: string;
    color?: string;
    height?: number;
    showValues?: boolean;
    className?: string;
}

// 바 차트
export function BarChart({
    data,
    title,
    color = "#FF6B6B",
    height = 200,
    showValues = true,
    className = ""
}: BarChartProps) {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
            <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                📊 {title}
            </h3>
            <div className="flex items-end gap-2" style={{ height }}>
                {data.map((item, index) => {
                    const barHeight = (item.value / maxValue) * 100;

                    return (
                        <div key={item.label} className="flex-1 flex flex-col items-center">
                            {/* 값 표시 */}
                            {showValues && (
                                <div className="text-xs text-[#666] dark:text-gray-400 mb-1">
                                    {item.value >= 1000
                                        ? `${(item.value / 1000).toFixed(0)}k`
                                        : item.value}
                                </div>
                            )}

                            {/* 바 */}
                            <motion.div
                                className="w-full rounded-t-lg"
                                style={{ backgroundColor: color }}
                                initial={{ height: 0 }}
                                animate={{ height: `${barHeight}%` }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            />

                            {/* 라벨 */}
                            <div className="text-xs text-[#666] dark:text-gray-400 mt-2 truncate w-full text-center">
                                {item.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// 라인 차트 (CSS로 구현)
interface LineChartProps {
    data: ChartData[];
    title: string;
    color?: string;
    height?: number;
    className?: string;
}

export function LineChart({
    data,
    title,
    color = "#FF6B6B",
    height = 200,
    className = ""
}: LineChartProps) {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
            <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                📈 {title}
            </h3>
            <div className="relative" style={{ height }}>
                {/* 배경 그리드 */}
                <div className="absolute inset-0 flex flex-col justify-between">
                    {[100, 75, 50, 25, 0].map(percent => (
                        <div
                            key={percent}
                            className="border-b border-gray-100 dark:border-gray-700 w-full"
                        />
                    ))}
                </div>

                {/* 데이터 포인트 */}
                <div className="absolute inset-0 flex items-end">
                    {data.map((item, index) => {
                        const pointY = ((maxValue - item.value) / maxValue) * 100;

                        return (
                            <div
                                key={item.label}
                                className="flex-1 relative"
                                style={{ height: '100%' }}
                            >
                                {/* 포인트 */}
                                <motion.div
                                    className="absolute w-3 h-3 rounded-full shadow-md"
                                    style={{
                                        backgroundColor: color,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        top: `${pointY}%`
                                    }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* X축 라벨 */}
                <div className="absolute -bottom-6 left-0 right-0 flex">
                    {data.map(item => (
                        <div
                            key={item.label}
                            className="flex-1 text-center text-xs text-[#666] dark:text-gray-400"
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 도넛 차트
interface DonutChartProps {
    value: number;
    max: number;
    label: string;
    color?: string;
    size?: number;
    className?: string;
}

export function DonutChart({
    value,
    max,
    label,
    color = "#FF6B6B",
    size = 120,
    className = ""
}: DonutChartProps) {
    const percentage = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {/* 배경 원 */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        className="dark:stroke-gray-700"
                    />
                    {/* 진행 원 */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </svg>
                {/* 중앙 텍스트 */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#333] dark:text-white">
                        {percentage.toFixed(0)}%
                    </span>
                </div>
            </div>
            <p className="mt-2 text-sm text-[#666] dark:text-gray-400">{label}</p>
        </div>
    );
}

// 통계 요약 카드
interface StatSummaryProps {
    stats: {
        label: string;
        value: string | number;
        change?: number;
        icon?: string;
    }[];
    className?: string;
}

export function StatSummary({ stats, className = "" }: StatSummaryProps) {
    return (
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        {stat.icon && <span>{stat.icon}</span>}
                        <span className="text-sm text-[#666] dark:text-gray-400">{stat.label}</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-[#333] dark:text-white">
                            {typeof stat.value === 'number'
                                ? stat.value.toLocaleString()
                                : stat.value}
                        </span>
                        {stat.change !== undefined && (
                            <span className={`text-sm ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                            </span>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
