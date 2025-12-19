"use client";
// 구독 후원 컴포넌트
// 월간 정기 후원 기능

import { motion } from "framer-motion";
import { useState } from "react";

// 구독 플랜 타입
interface SubscriptionPlan {
    id: string;
    name: string;
    amount: number;
    emoji: string;
    benefits: string[];
    popular?: boolean;
}

// 기본 구독 플랜
const defaultPlans: SubscriptionPlan[] = [
    {
        id: 'basic',
        name: '커피 후원',
        amount: 3000,
        emoji: '☕',
        benefits: ['매월 감사 메시지', '후원자 전용 뱃지'],
    },
    {
        id: 'standard',
        name: '도넛 후원',
        amount: 5000,
        emoji: '🍩',
        benefits: ['커피 후원 혜택 포함', '미공개 소식 먼저 보기', '이름 크레딧 표시'],
        popular: true,
    },
    {
        id: 'premium',
        name: '케이크 후원',
        amount: 10000,
        emoji: '🎂',
        benefits: ['도넛 후원 혜택 포함', '1:1 DM 가능', 'VIP 후원자 뱃지'],
    },
];

// Props 타입
interface SubscriptionCardsProps {
    plans?: SubscriptionPlan[];
    creatorName?: string;
    onSubscribe?: (planId: string) => void;
    className?: string;
}

// 구독 카드 컴포넌트
export function SubscriptionCards({
    plans = defaultPlans,
    creatorName = "크리에이터",
    onSubscribe,
    className = "",
}: SubscriptionCardsProps) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const handleSubscribe = (planId: string) => {
        setSelectedPlan(planId);
        onSubscribe?.(planId);
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* 헤더 */}
            <div className="text-center">
                <h2 className="text-xl font-bold text-[#333] dark:text-white mb-2">
                    💝 {creatorName}님 정기 후원하기
                </h2>
                <p className="text-sm text-[#666] dark:text-gray-400">
                    매월 자동으로 후원하고 특별한 혜택을 받아보세요
                </p>
            </div>

            {/* 플랜 카드 */}
            <div className="grid md:grid-cols-3 gap-4">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all cursor-pointer ${selectedPlan === plan.id
                                ? 'border-[#FF6B6B] shadow-lg'
                                : 'border-gray-200 dark:border-gray-700 hover:border-[#FFD95A]'
                            }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedPlan(plan.id)}
                    >
                        {/* 인기 태그 */}
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#FF6B6B] text-white text-xs font-bold rounded-full">
                                인기 🔥
                            </div>
                        )}

                        {/* 이모지 */}
                        <div className="text-4xl text-center mb-4">{plan.emoji}</div>

                        {/* 플랜 이름 */}
                        <h3 className="text-lg font-bold text-[#333] dark:text-white text-center mb-2">
                            {plan.name}
                        </h3>

                        {/* 금액 */}
                        <div className="text-center mb-4">
                            <span className="text-2xl font-bold text-[#FF6B6B]">
                                ₩{plan.amount.toLocaleString()}
                            </span>
                            <span className="text-sm text-[#666] dark:text-gray-400">/월</span>
                        </div>

                        {/* 혜택 목록 */}
                        <ul className="space-y-2 mb-6">
                            {plan.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-[#666] dark:text-gray-300">
                                    <span className="text-green-500">✓</span>
                                    {benefit}
                                </li>
                            ))}
                        </ul>

                        {/* 구독 버튼 */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSubscribe(plan.id);
                            }}
                            className={`w-full py-3 rounded-xl font-medium transition-colors ${selectedPlan === plan.id
                                    ? 'bg-[#FF6B6B] text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-[#333] dark:text-white hover:bg-[#FFD95A]'
                                }`}
                        >
                            {selectedPlan === plan.id ? '선택됨 ✓' : '선택하기'}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* 안내 */}
            <div className="p-4 bg-[#FFFACD] dark:bg-yellow-900/20 rounded-xl text-center">
                <p className="text-sm text-[#666] dark:text-gray-300">
                    💳 토스페이로 간편하게 정기 결제됩니다. 언제든 해지 가능해요!
                </p>
            </div>
        </div>
    );
}

export default SubscriptionCards;
