"use client";
// 후원 정기구독 UI 컴포넌트
// 월간 정기 후원 기능

import { motion } from "framer-motion";
import { useState } from "react";

interface SubscriptionPlan {
    id: string;
    name: string;
    amount: number;
    benefits: string[];
    popular?: boolean;
}

interface SubscriptionUIProps {
    creatorName: string;
    creatorHandle: string;
    plans?: SubscriptionPlan[];
    onSubscribe?: (planId: string) => void;
}

// 기본 구독 플랜
const defaultPlans: SubscriptionPlan[] = [
    {
        id: 'basic',
        name: '커피 한 잔',
        amount: 3000,
        benefits: ['월간 감사 메시지', '후원자 뱃지']
    },
    {
        id: 'standard',
        name: '브런치 세트',
        amount: 10000,
        benefits: ['월간 감사 메시지', '후원자 뱃지', 'VIP 채팅방 접근', '콘텐츠 미리보기'],
        popular: true
    },
    {
        id: 'premium',
        name: '디너 코스',
        amount: 30000,
        benefits: ['월간 감사 메시지', '프리미엄 뱃지', 'VIP 채팅방', '콘텐츠 미리보기', '1:1 Q&A', '굿즈 할인']
    }
];

export function SubscriptionUI({
    creatorName,
    creatorHandle,
    plans = defaultPlans,
    onSubscribe
}: SubscriptionUIProps) {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubscribe = async () => {
        if (!selectedPlan) return;

        setIsProcessing(true);
        try {
            if (onSubscribe) {
                await onSubscribe(selectedPlan);
            } else {
                // Mock 처리
                await new Promise(resolve => setTimeout(resolve, 1500));
                alert('구독 기능은 준비 중입니다.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* 헤더 */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#333] dark:text-white mb-2">
                    🍩 {creatorName} 정기 후원
                </h2>
                <p className="text-[#666] dark:text-gray-400">
                    @{creatorHandle}를 매월 응원하세요
                </p>
            </div>

            {/* 플랜 카드 */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {plans.map((plan, index) => (
                    <motion.div
                        key={plan.id}
                        className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 cursor-pointer transition-all ${selectedPlan === plan.id
                                ? 'border-[#FF6B6B] shadow-lg shadow-[#FF6B6B]/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-[#FFD95A]'
                            }`}
                        onClick={() => setSelectedPlan(plan.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        {/* 인기 배지 */}
                        {plan.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A] rounded-full text-white text-xs font-bold">
                                인기
                            </div>
                        )}

                        {/* 플랜 이름 */}
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-2 text-center">
                            {plan.name}
                        </h3>

                        {/* 가격 */}
                        <div className="text-center mb-4">
                            <span className="text-3xl font-black text-[#FF6B6B]">
                                ₩{plan.amount.toLocaleString()}
                            </span>
                            <span className="text-[#666] dark:text-gray-400 text-sm">
                                /월
                            </span>
                        </div>

                        {/* 혜택 */}
                        <ul className="space-y-2">
                            {plan.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-[#666] dark:text-gray-400">
                                    <span className="text-green-500">✓</span>
                                    {benefit}
                                </li>
                            ))}
                        </ul>

                        {/* 선택 표시 */}
                        {selectedPlan === plan.id && (
                            <motion.div
                                className="absolute top-3 right-3 w-6 h-6 bg-[#FF6B6B] rounded-full flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                            >
                                <span className="text-white text-sm">✓</span>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* 구독 버튼 */}
            <div className="text-center">
                <button
                    onClick={handleSubscribe}
                    disabled={!selectedPlan || isProcessing}
                    className="px-8 py-4 bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A] rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-[#FF6B6B]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? '처리 중...' : selectedPlan ? '구독 시작하기' : '플랜을 선택하세요'}
                </button>
                <p className="mt-4 text-sm text-[#999]">
                    언제든 취소 가능 • 자동 갱신
                </p>
            </div>

            {/* 안내 */}
            <div className="mt-8 p-4 bg-[#FFFACD] dark:bg-yellow-900/20 rounded-xl">
                <p className="text-sm text-[#666] dark:text-gray-400 text-center">
                    💡 정기 구독 기능은 현재 준비 중입니다. 곧 만나보실 수 있어요!
                </p>
            </div>
        </div>
    );
}

// 구독 관리 (현재 구독 표시)
interface CurrentSubscriptionProps {
    plan: SubscriptionPlan;
    startDate: string;
    nextBillingDate: string;
    onCancel: () => void;
}

export function CurrentSubscription({ plan, startDate, nextBillingDate, onCancel }: CurrentSubscriptionProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#333] dark:text-white">
                    현재 구독
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                    활성
                </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B6B] to-[#FFD95A] rounded-xl flex items-center justify-center text-2xl">
                    🍩
                </div>
                <div>
                    <p className="font-bold text-[#333] dark:text-white">{plan.name}</p>
                    <p className="text-[#FF6B6B] font-bold">₩{plan.amount.toLocaleString()}/월</p>
                </div>
            </div>

            <div className="space-y-2 text-sm text-[#666] dark:text-gray-400 mb-4">
                <p>시작일: {new Date(startDate).toLocaleDateString('ko-KR')}</p>
                <p>다음 결제일: {new Date(nextBillingDate).toLocaleDateString('ko-KR')}</p>
            </div>

            <button
                onClick={onCancel}
                className="text-sm text-red-500 hover:underline"
            >
                구독 취소
            </button>
        </div>
    );
}
