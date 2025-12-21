"use client";
// 빈 상태 UI 컴포넌트 - 데이터가 없을 때 표시
// 재사용 가능한 empty state 컴포넌트

import { motion } from "framer-motion";
import Link from "next/link";

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
}: EmptyStateProps) {
    return (
        <motion.div
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* 아이콘 */}
            <motion.div
                className="text-7xl mb-6"
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                {icon}
            </motion.div>

            {/* 제목 */}
            <h3 className="text-xl font-bold text-[#333] dark:text-white mb-2">
                {title}
            </h3>

            {/* 설명 */}
            <p className="text-[#666] dark:text-gray-400 max-w-md mb-6">
                {description}
            </p>

            {/* 액션 버튼 */}
            {actionLabel && (actionHref || onAction) && (
                actionHref ? (
                    <Link
                        href={actionHref}
                        className="px-6 py-3 bg-[#FFD95A] hover:bg-[#FFCE3A] text-[#333] font-medium rounded-xl transition-colors shadow-md"
                    >
                        {actionLabel}
                    </Link>
                ) : (
                    <button
                        onClick={onAction}
                        className="px-6 py-3 bg-[#FFD95A] hover:bg-[#FFCE3A] text-[#333] font-medium rounded-xl transition-colors shadow-md"
                    >
                        {actionLabel}
                    </button>
                )
            )}
        </motion.div>
    );
}

// 메시지 월용 빈 상태
export function MessagesEmptyState() {
    return (
        <EmptyState
            icon="📮"
            title="아직 받은 쪽지가 없어요"
            description="후원자들의 따뜻한 메시지가 여기에 표시됩니다. 후원 페이지 링크를 공유해보세요!"
            actionLabel="내 후원 링크 복사하기"
        />
    );
}

// 대시보드용 빈 상태
export function DashboardEmptyState() {
    return (
        <EmptyState
            icon="🌱"
            title="아직 후원 내역이 없어요"
            description="첫 후원이 도착하면 여기에서 확인할 수 있습니다. 크리에이터 페이지를 공유해보세요!"
            actionLabel="설정으로 이동"
            actionHref="/dashboard/settings"
        />
    );
}

// 정산용 빈 상태
export function SettlementEmptyState() {
    return (
        <EmptyState
            icon="💳"
            title="정산 가능한 금액이 없어요"
            description="후원을 받으면 정산 가능 금액이 여기에 표시됩니다."
        />
    );
}

// 분석용 빈 상태
export function AnalyticsEmptyState() {
    return (
        <EmptyState
            icon="📊"
            title="아직 분석할 데이터가 없어요"
            description="후원 데이터가 쌓이면 더 자세한 분석 결과를 확인할 수 있습니다."
        />
    );
}
