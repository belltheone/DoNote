"use client";
// 온보딩 진행률 표시 컴포넌트
// 단계별 진행 상태를 시각적으로 표시

import { motion } from "framer-motion";

// 진행률 Props 타입
interface OnboardingProgressProps {
    currentStep: number;
    totalSteps: number;
    steps: { label: string; icon: string }[];
}

// 온보딩 진행률 컴포넌트
export function OnboardingProgress({
    currentStep,
    totalSteps,
    steps,
}: OnboardingProgressProps) {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full mb-8">
            {/* 진행률 바 */}
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>

            {/* 단계 표시 */}
            <div className="flex justify-between">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center">
                            <motion.div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1
                                    ${isCompleted
                                        ? "bg-[#4CAF50] text-white"
                                        : isCurrent
                                            ? "bg-[#FF6B6B] text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-[#999] dark:text-gray-500"
                                    }`}
                                animate={isCurrent ? { scale: [1, 1.1, 1] } : undefined}
                                transition={isCurrent ? { duration: 1.5, repeat: Infinity } : undefined}
                            >
                                {isCompleted ? "✓" : step.icon}
                            </motion.div>
                            <span
                                className={`text-xs font-medium ${isCurrent
                                    ? "text-[#FF6B6B]"
                                    : isCompleted
                                        ? "text-[#4CAF50]"
                                        : "text-[#999] dark:text-gray-500"
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* 퍼센트 표시 */}
            <p className="text-center text-sm text-[#666] dark:text-gray-400 mt-4">
                {currentStep}/{totalSteps} 단계 완료 ({Math.round(progress)}%)
            </p>
        </div>
    );
}

// 간단한 진행률 바
export function SimpleProgress({
    value,
    max = 100,
    showText = true,
    className = "",
}: {
    value: number;
    max?: number;
    showText?: boolean;
    className?: string;
}) {
    const percentage = Math.round((value / max) * 100);

    return (
        <div className={`w-full ${className}`}>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>
            {showText && (
                <div className="flex justify-between mt-1">
                    <span className="text-xs text-[#666] dark:text-gray-400">진행률</span>
                    <span className="text-xs font-medium text-[#FF6B6B]">{percentage}%</span>
                </div>
            )}
        </div>
    );
}

export default OnboardingProgress;
