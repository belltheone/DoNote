"use client";
// 정산 신청 페이지 - 정산하기 (Settlement)
// 실제 DB 연동 버전

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import {
    getMyDonations,
    getMySettlements,
    requestSettlement,
    getSettlementInfo,
    getRealStats,
    SettlementStatus
} from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";

export default function SettlementPage() {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 통계 및 정산 데이터
    const [stats, setStats] = useState({ totalAmount: 0, thisMonthAmount: 0, totalNotes: 0, thisMonthNotes: 0 });
    const [settlements, setSettlements] = useState<{ id: string; amount: number; netAmount: number; status: SettlementStatus; requestedAt: string; completedAt?: string; }[]>([]);
    const [hasSettlementInfo, setHasSettlementInfo] = useState(false);

    // 정산 가능 금액 계산
    const settledAmount = settlements.filter(s => s.status !== 'rejected').reduce((sum, s) => sum + s.amount, 0);
    const availableAmount = stats.totalAmount - settledAmount;

    // 수수료 계산 (플랫폼 5%)
    const platformFee = Math.round(availableAmount * 0.05);
    const netAmount = availableAmount - platformFee;

    // 데이터 로드
    useEffect(() => {
        const loadData = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                // 내 후원 목록
                const donations = await getMyDonations(user.id);
                const realStats = await getRealStats(donations);
                setStats(realStats);

                // 내 정산 내역
                const mySettlements = await getMySettlements(user.id);
                setSettlements(mySettlements);

                // 정산 정보 등록 여부
                const settlementInfo = await getSettlementInfo(user.id);
                setHasSettlementInfo(!!settlementInfo);
            } catch (error) {
                console.error('데이터 로드 오류:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user]);

    // 정산 신청 처리
    const handleRequestSettlement = async () => {
        if (!user) return;

        setIsSubmitting(true);
        try {
            const result = await requestSettlement(user.id, availableAmount);

            if (result.success) {
                toast.success(result.message);
                // 정산 목록 새로고침
                const mySettlements = await getMySettlements(user.id);
                setSettlements(mySettlements);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('정산 요청 오류:', error);
            toast.error('정산 요청에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 상태별 배지 표시
    const getStatusBadge = (status: SettlementStatus) => {
        switch (status) {
            case 'pending':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-medium">⏳ 대기중</span>;
            case 'approved':
                return <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">✓ 승인됨</span>;
            case 'completed':
                return <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">✓ 완료</span>;
            case 'rejected':
                return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">✕ 거절</span>;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto animate-pulse space-y-6">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-48" />
                <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-16" />
                <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* 페이지 헤더 */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-2xl font-bold text-[#333] dark:text-white flex items-center gap-2">
                    <span>💳</span> 정산하기
                </h2>
                <p className="text-[#666] dark:text-gray-400 mt-1">받은 후원금을 정산받으세요</p>
            </motion.div>

            {/* 정산 정보 미등록 안내 */}
            {!hasSettlementInfo && (
                <motion.div
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-dashed border-red-300 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <p className="text-red-600 dark:text-red-400 font-medium mb-2">⚠️ 정산 정보가 등록되지 않았습니다</p>
                    <p className="text-sm text-red-500 dark:text-red-300 mb-3">
                        정산을 받으시려면 먼저 정산 정보를 등록해주세요.
                    </p>
                    <Link
                        href="/dashboard/settings"
                        className="inline-block px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                        설정에서 정산 정보 등록하기 →
                    </Link>
                </motion.div>
            )}

            {/* 정산 가능 금액 카드 */}
            <motion.div
                className="bg-gradient-to-r from-[#FFD95A] to-[#FFE082] rounded-2xl p-8 shadow-lg relative overflow-hidden mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="absolute top-4 right-4 text-6xl opacity-20">💳</div>

                <p className="text-[#333]/70 text-sm mb-2">정산 가능 금액</p>
                <p className="text-5xl font-bold text-[#333] mb-4">
                    ₩{availableAmount.toLocaleString()}
                </p>

                <div className="flex items-center gap-4 text-sm">
                    <span className="text-[#333]/70">
                        총 후원: ₩{stats.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[#333]/50">|</span>
                    <span className="text-[#333]/70">
                        기 정산: ₩{settledAmount.toLocaleString()}
                    </span>
                </div>
            </motion.div>

            {/* 정산 요약 */}
            {availableAmount >= 1000 && (
                <motion.div
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="text-center text-sm text-[#999] dark:text-gray-500 mb-3">--- 정산 예상 금액 ---</div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[#666] dark:text-gray-400">
                            <span>정산 요청 금액</span>
                            <span>₩{availableAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[#999] dark:text-gray-500 text-sm">
                            <span>플랫폼 수수료 (5%)</span>
                            <span className="text-red-500">-₩{platformFee.toLocaleString()}</span>
                        </div>
                        <div className="pt-3 border-t border-dashed border-gray-300 dark:border-gray-600 flex justify-between font-bold text-[#333] dark:text-white">
                            <span>실 입금액</span>
                            <span className="text-[#FF6B6B]">₩{netAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* 정산 신청 버튼 */}
            <motion.button
                onClick={handleRequestSettlement}
                disabled={availableAmount < 1000 || !hasSettlementInfo || isSubmitting}
                className="w-full py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold text-lg hover:bg-[#FF5252] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                whileHover={{ scale: availableAmount >= 1000 && hasSettlementInfo ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
            >
                {isSubmitting ? (
                    <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                    >⏳</motion.span>
                ) : availableAmount >= 1000 ? (
                    hasSettlementInfo ? '정산 신청하기' : '정산 정보를 먼저 등록해주세요'
                ) : (
                    '최소 정산 금액: ₩1,000'
                )}
            </motion.button>

            {/* 정산 내역 */}
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                    <span>📋</span> 정산 내역
                </h3>

                {settlements.length > 0 ? (
                    <div className="space-y-3">
                        {settlements.map((settlement) => (
                            <div
                                key={settlement.id}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                            >
                                <div>
                                    <p className="font-bold text-[#333] dark:text-white">
                                        ₩{settlement.amount.toLocaleString()}
                                        <span className="text-sm font-normal text-[#999] dark:text-gray-400 ml-2">
                                            (실 수령: ₩{settlement.netAmount.toLocaleString()})
                                        </span>
                                    </p>
                                    <p className="text-xs text-[#999] dark:text-gray-500">
                                        {new Date(settlement.requestedAt).toLocaleDateString('ko-KR')} 신청
                                        {settlement.completedAt && ` → ${new Date(settlement.completedAt).toLocaleDateString('ko-KR')} 완료`}
                                    </p>
                                </div>
                                {getStatusBadge(settlement.status)}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-[#999] dark:text-gray-500">
                        아직 정산 내역이 없어요
                    </div>
                )}
            </motion.div>

            {/* 안내 */}
            <motion.div
                className="bg-[#FFFACD] dark:bg-yellow-900/20 rounded-xl p-4 border-2 border-dashed border-[#FFD95A]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <p className="text-sm text-[#666] dark:text-gray-300">
                    💡 <strong>정산 안내</strong>: 정산 신청 후 영업일 기준 3-5일 이내에 입금됩니다. 최소 정산 금액은 ₩1,000입니다.
                </p>
                <p className="text-xs text-[#999] dark:text-gray-500 mt-2">
                    ※ 플랫폼 수수료 5%가 차감됩니다.
                </p>
            </motion.div>
        </div>
    );
}
