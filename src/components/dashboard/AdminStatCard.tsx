"use client";
// 관리자 통계 카드 컴포넌트
// 수익, 크리에이터, 후원 통계 표시

import { motion } from "framer-motion";

// Props 타입
interface AdminStatCardProps {
    label: string;
    value: string;
    subValue?: string;
    icon: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: "red" | "yellow" | "blue" | "green" | "purple";
    className?: string;
}

// 색상 맵
const colorMap = {
    red: "from-red-400 to-red-500",
    yellow: "from-yellow-400 to-orange-500",
    blue: "from-blue-400 to-blue-500",
    green: "from-green-400 to-green-500",
    purple: "from-purple-400 to-purple-500",
};

// 관리자 통계 카드
export function AdminStatCard({
    label,
    value,
    subValue,
    icon,
    trend,
    color = "red",
    className = "",
}: AdminStatCardProps) {
    return (
        <motion.div
            className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
        >
            {/* 그라데이션 배경 */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorMap[color]} opacity-10 rounded-bl-full`} />

            {/* 아이콘 및 라벨 */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-2xl shadow-md`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-[#666] dark:text-gray-400">{label}</p>
                    {trend && (
                        <span className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {trend.isPositive ? '▲' : '▼'} {Math.abs(trend.value)}%
                        </span>
                    )}
                </div>
            </div>

            {/* 메인 값 */}
            <p className="text-3xl font-bold text-[#333] dark:text-white mb-1">{value}</p>

            {/* 서브 값 */}
            {subValue && (
                <p className="text-xs text-[#999] dark:text-gray-500">{subValue}</p>
            )}
        </motion.div>
    );
}

// 플랫폼 수익 카드
export function RevenueCard({
    totalRevenue,
    thisMonthRevenue,
    feeRate = 0.05,
    className = "",
}: {
    totalRevenue: number;
    thisMonthRevenue: number;
    feeRate?: number;
    className?: string;
}) {
    return (
        <motion.div
            className={`bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-xl p-6 shadow-lg text-white ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💰</span>
                <div>
                    <p className="text-white/80 text-sm">플랫폼 수익</p>
                    <p className="text-xs text-white/60">수수료 {feeRate * 100}%</p>
                </div>
            </div>

            <p className="text-4xl font-bold mb-2">
                ₩{totalRevenue.toLocaleString()}
            </p>

            <p className="text-white/80 text-sm">
                이번 달: ₩{thisMonthRevenue.toLocaleString()}
            </p>
        </motion.div>
    );
}

export default AdminStatCard;
