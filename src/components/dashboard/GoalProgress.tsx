"use client";
// 후원 목표 진행바 컴포넌트
// 크리에이터 페이지와 대시보드에서 사용

import { motion } from "framer-motion";

interface GoalProgressProps {
    title: string;
    current: number;
    target: number;
    showAmount?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function GoalProgress({
    title,
    current,
    target,
    showAmount = true,
    size = 'md',
    className = ""
}: GoalProgressProps) {
    const percentage = Math.min((current / target) * 100, 100);
    const isComplete = current >= target;

    // 사이즈별 스타일
    const sizeStyles = {
        sm: { bar: 'h-2', text: 'text-sm' },
        md: { bar: 'h-3', text: 'text-base' },
        lg: { bar: 'h-4', text: 'text-lg' }
    };

    return (
        <div className={`${className}`}>
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <span className={`font-medium text-[#333] dark:text-white ${sizeStyles[size].text}`}>
                        {title}
                    </span>
                </div>
                {showAmount && (
                    <span className={`${sizeStyles[size].text} text-[#666] dark:text-gray-400`}>
                        {percentage.toFixed(0)}%
                    </span>
                )}
            </div>

            {/* 진행바 */}
            <div className={`relative bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeStyles[size].bar}`}>
                <motion.div
                    className={`absolute top-0 left-0 h-full rounded-full ${isComplete
                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                            : 'bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A]'
                        }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
                {/* 반짝이 효과 */}
                <motion.div
                    className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '500%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
            </div>

            {/* 금액 표시 */}
            {showAmount && (
                <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-[#FF6B6B] font-bold">
                        ₩{current.toLocaleString()}
                    </span>
                    <span className="text-[#666] dark:text-gray-400">
                        / ₩{target.toLocaleString()}
                    </span>
                </div>
            )}

            {/* 완료 표시 */}
            {isComplete && (
                <motion.div
                    className="mt-2 text-center text-green-500 font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    🎉 목표 달성!
                </motion.div>
            )}
        </div>
    );
}

// 미니 버전 (크리에이터 페이지용)
export function GoalProgressMini({ current, target }: { current: number; target: number }) {
    const percentage = Math.min((current / target) * 100, 100);

    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8 }}
                />
            </div>
            <span className="text-xs text-[#666] dark:text-gray-400 whitespace-nowrap">
                {percentage.toFixed(0)}%
            </span>
        </div>
    );
}
