"use client";
// 멤버십 뱃지 컴포넌트
// 후원 등급에 따른 뱃지 표시

import { motion } from "framer-motion";

// 멤버십 등급 타입
export type MembershipTier = 'none' | 'bronze' | 'silver' | 'gold' | 'diamond';

// 멤버십 정보
const membershipInfo: Record<MembershipTier, {
    name: string;
    emoji: string;
    color: string;
    bgColor: string;
    minAmount: number;
    description: string;
}> = {
    none: {
        name: '일반',
        emoji: '👤',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100 dark:bg-gray-700',
        minAmount: 0,
        description: '첫 후원을 기다리고 있어요',
    },
    bronze: {
        name: '브론즈',
        emoji: '🥉',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        minAmount: 3000,
        description: '커피 한 잔의 마음',
    },
    silver: {
        name: '실버',
        emoji: '🥈',
        color: 'text-gray-400',
        bgColor: 'bg-gray-200 dark:bg-gray-600',
        minAmount: 10000,
        description: '꾸준한 응원자',
    },
    gold: {
        name: '골드',
        emoji: '🥇',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        minAmount: 50000,
        description: '든든한 후원자',
    },
    diamond: {
        name: '다이아몬드',
        emoji: '💎',
        color: 'text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        minAmount: 100000,
        description: 'VIP 서포터',
    },
};

// 총 후원금액으로 등급 계산
export function calculateTier(totalAmount: number): MembershipTier {
    if (totalAmount >= 100000) return 'diamond';
    if (totalAmount >= 50000) return 'gold';
    if (totalAmount >= 10000) return 'silver';
    if (totalAmount >= 3000) return 'bronze';
    return 'none';
}

// 뱃지 Props
interface MembershipBadgeProps {
    tier: MembershipTier;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
}

// 멤버십 뱃지 컴포넌트
export function MembershipBadge({
    tier,
    size = 'md',
    showLabel = false,
    className = "",
}: MembershipBadgeProps) {
    const info = membershipInfo[tier];

    const sizeClasses = {
        sm: 'w-6 h-6 text-sm',
        md: 'w-8 h-8 text-lg',
        lg: 'w-12 h-12 text-2xl',
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <motion.div
                className={`${sizeClasses[size]} ${info.bgColor} rounded-full flex items-center justify-center`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
            >
                {info.emoji}
            </motion.div>
            {showLabel && (
                <span className={`font-medium ${info.color}`}>
                    {info.name}
                </span>
            )}
        </div>
    );
}

// 멤버십 카드 Props
interface MembershipCardProps {
    tier: MembershipTier;
    totalAmount: number;
    donationCount: number;
    className?: string;
}

// 멤버십 카드 컴포넌트 (프로필용)
export function MembershipCard({
    tier,
    totalAmount,
    donationCount,
    className = "",
}: MembershipCardProps) {
    const info = membershipInfo[tier];
    const nextTier = getNextTier(tier);
    const nextInfo = nextTier ? membershipInfo[nextTier] : null;
    const progressToNext = nextInfo
        ? Math.min((totalAmount / nextInfo.minAmount) * 100, 100)
        : 100;

    return (
        <motion.div
            className={`${info.bgColor} rounded-xl p-6 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-4xl">{info.emoji}</span>
                    <div>
                        <h3 className={`text-lg font-bold ${info.color}`}>{info.name} 멤버</h3>
                        <p className="text-sm text-[#666] dark:text-gray-400">{info.description}</p>
                    </div>
                </div>
            </div>

            {/* 통계 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-[#333] dark:text-white">
                        ₩{totalAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-[#666] dark:text-gray-400">총 후원금</div>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-[#333] dark:text-white">
                        {donationCount}회
                    </div>
                    <div className="text-xs text-[#666] dark:text-gray-400">후원 횟수</div>
                </div>
            </div>

            {/* 다음 등급 진행률 */}
            {nextInfo && (
                <div>
                    <div className="flex justify-between text-xs text-[#666] dark:text-gray-400 mb-1">
                        <span>다음 등급: {nextInfo.name}</span>
                        <span>₩{nextInfo.minAmount.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-white/50 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FFD95A] rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressToNext}%` }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </div>
            )}
        </motion.div>
    );
}

// 다음 등급 구하기
function getNextTier(tier: MembershipTier): MembershipTier | null {
    const tiers: MembershipTier[] = ['none', 'bronze', 'silver', 'gold', 'diamond'];
    const currentIndex = tiers.indexOf(tier);
    if (currentIndex < tiers.length - 1) {
        return tiers[currentIndex + 1];
    }
    return null;
}

// 등급 목록 컴포넌트
export function MembershipTierList({ className = "" }: { className?: string }) {
    const tiers: MembershipTier[] = ['bronze', 'silver', 'gold', 'diamond'];

    return (
        <div className={`space-y-3 ${className}`}>
            <h3 className="text-lg font-bold text-[#333] dark:text-white flex items-center gap-2">
                <span>🏆</span> 멤버십 등급
            </h3>
            <div className="grid gap-2">
                {tiers.map((tier) => {
                    const info = membershipInfo[tier];
                    return (
                        <div
                            key={tier}
                            className={`flex items-center justify-between p-3 rounded-lg ${info.bgColor}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{info.emoji}</span>
                                <div>
                                    <span className={`font-medium ${info.color}`}>{info.name}</span>
                                    <p className="text-xs text-[#666] dark:text-gray-400">{info.description}</p>
                                </div>
                            </div>
                            <span className="text-sm text-[#666] dark:text-gray-400">
                                ₩{info.minAmount.toLocaleString()}+
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MembershipBadge;
