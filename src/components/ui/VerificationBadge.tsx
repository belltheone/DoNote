"use client";
// 크리에이터 인증 배지 컴포넌트

import { motion } from "framer-motion";

type BadgeType = 'verified' | 'top' | 'new' | 'premium';

interface BadgeProps {
    type: BadgeType;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

// 배지 설정
const badgeConfig: Record<BadgeType, {
    emoji: string;
    label: string;
    color: string;
    bgColor: string;
    description: string;
}> = {
    verified: {
        emoji: '✓',
        label: '인증됨',
        color: '#fff',
        bgColor: '#3B82F6',
        description: '도노트에서 인증된 크리에이터입니다'
    },
    top: {
        emoji: '👑',
        label: 'TOP',
        color: '#FFD95A',
        bgColor: '#1F2937',
        description: '이번 달 인기 크리에이터입니다'
    },
    new: {
        emoji: '✨',
        label: 'NEW',
        color: '#fff',
        bgColor: '#10B981',
        description: '새로 가입한 크리에이터입니다'
    },
    premium: {
        emoji: '💎',
        label: '프리미엄',
        color: '#fff',
        bgColor: '#8B5CF6',
        description: '프리미엄 크리에이터입니다'
    }
};

export function VerificationBadge({ type, size = 'md', showLabel = false }: BadgeProps) {
    const config = badgeConfig[type];

    // 사이즈별 스타일
    const sizeStyles = {
        sm: { badge: 'w-4 h-4 text-xs', label: 'text-xs' },
        md: { badge: 'w-5 h-5 text-sm', label: 'text-sm' },
        lg: { badge: 'w-6 h-6 text-base', label: 'text-base' }
    };

    return (
        <motion.div
            className="inline-flex items-center gap-1 cursor-help"
            title={config.description}
            whileHover={{ scale: 1.1 }}
        >
            <div
                className={`${sizeStyles[size].badge} rounded-full flex items-center justify-center font-bold shadow-sm`}
                style={{ backgroundColor: config.bgColor, color: config.color }}
            >
                {config.emoji}
            </div>
            {showLabel && (
                <span
                    className={`${sizeStyles[size].label} font-medium`}
                    style={{ color: config.bgColor }}
                >
                    {config.label}
                </span>
            )}
        </motion.div>
    );
}

// 여러 배지를 표시하는 컴포넌트
interface BadgeGroupProps {
    badges: BadgeType[];
    size?: 'sm' | 'md' | 'lg';
}

export function BadgeGroup({ badges, size = 'md' }: BadgeGroupProps) {
    if (badges.length === 0) return null;

    return (
        <div className="flex items-center gap-1">
            {badges.map(type => (
                <VerificationBadge key={type} type={type} size={size} />
            ))}
        </div>
    );
}

// 인증 상태 표시 (프로필용)
interface VerificationStatusProps {
    isVerified: boolean;
    verifiedAt?: string;
}

export function VerificationStatus({ isVerified, verifiedAt }: VerificationStatusProps) {
    if (!isVerified) {
        return (
            <div className="flex items-center gap-2 text-[#666] dark:text-gray-400">
                <span className="text-gray-400">○</span>
                <span className="text-sm">미인증</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <VerificationBadge type="verified" showLabel />
            {verifiedAt && (
                <span className="text-xs text-[#999]">
                    {new Date(verifiedAt).toLocaleDateString('ko-KR')} 인증
                </span>
            )}
        </div>
    );
}
