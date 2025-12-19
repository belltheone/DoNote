"use client";
// 후원 목표 컴포넌트
// 목표 금액 대비 현재 후원금 진행률 표시

import { motion } from "framer-motion";

// Props 타입
interface DonationGoalProps {
    currentAmount: number;
    goalAmount: number;
    title?: string;
    description?: string;
    showPercentage?: boolean;
    className?: string;
}

// 후원 목표 진행률 컴포넌트
export function DonationGoal({
    currentAmount,
    goalAmount,
    title = "후원 목표",
    description,
    showPercentage = true,
    className = "",
}: DonationGoalProps) {
    // 진행률 계산
    const percentage = Math.min((currentAmount / goalAmount) * 100, 100);
    const isCompleted = currentAmount >= goalAmount;

    return (
        <motion.div
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{isCompleted ? '🎉' : '🎯'}</span>
                    <h3 className="text-lg font-bold text-[#333] dark:text-white">{title}</h3>
                </div>
                {showPercentage && (
                    <span className={`text-sm font-bold ${isCompleted ? 'text-green-500' : 'text-[#FF6B6B]'}`}>
                        {percentage.toFixed(0)}%
                    </span>
                )}
            </div>

            {/* 설명 */}
            {description && (
                <p className="text-sm text-[#666] dark:text-gray-400 mb-4">
                    {description}
                </p>
            )}

            {/* 진행바 */}
            <div className="relative h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                <motion.div
                    className={`h-full rounded-full ${isCompleted
                        ? 'bg-gradient-to-r from-green-400 to-green-500'
                        : 'bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A]'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />

                {/* 글로우 효과 */}
                {!isCompleted && (
                    <motion.div
                        className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "400%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                )}
            </div>

            {/* 금액 표시 */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-[#666] dark:text-gray-400">
                    현재: <span className="font-bold text-[#333] dark:text-white">₩{currentAmount.toLocaleString()}</span>
                </span>
                <span className="text-[#666] dark:text-gray-400">
                    목표: <span className="font-bold text-[#FF6B6B]">₩{goalAmount.toLocaleString()}</span>
                </span>
            </div>

            {/* 완료 메시지 */}
            {isCompleted && (
                <motion.div
                    className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <p className="text-green-600 dark:text-green-400 font-medium">
                        🎊 목표를 달성했어요! 감사합니다!
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}

// 후원 목표 설정 폼
export function DonationGoalForm({
    initialGoal = 100000,
    onSave,
    className = "",
}: {
    initialGoal?: number;
    onSave?: (goal: number, title: string) => void;
    className?: string;
}) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
            <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                <span>⚙️</span> 목표 설정
            </h3>

            <div className="space-y-4">
                {/* 목표 금액 */}
                <div>
                    <label className="block text-sm text-[#666] dark:text-gray-400 mb-2">
                        목표 금액
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666] dark:text-gray-400">₩</span>
                        <input
                            type="number"
                            defaultValue={initialGoal}
                            className="w-full pl-8 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent"
                            placeholder="100000"
                        />
                    </div>
                </div>

                {/* 목표 제목 */}
                <div>
                    <label className="block text-sm text-[#666] dark:text-gray-400 mb-2">
                        목표 제목 (선택)
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:ring-2 focus:ring-[#FF6B6B] focus:border-transparent"
                        placeholder="예: 새 마이크 구매"
                    />
                </div>

                {/* 저장 버튼 */}
                <button
                    onClick={() => onSave?.(initialGoal, '후원 목표')}
                    className="w-full py-3 bg-[#FF6B6B] text-white rounded-lg font-medium hover:bg-[#FF5252] transition-colors"
                >
                    저장하기
                </button>
            </div>
        </div>
    );
}

export default DonationGoal;
