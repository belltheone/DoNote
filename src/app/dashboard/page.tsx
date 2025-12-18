"use client";
// 대시보드 메인 페이지 - 요약 카드, 최근 후원, 빠른 액션

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getStats, mockDonations } from "@/lib/supabase";
import { realtimeManager } from "@/lib/realtime";
import { NotificationToast } from "@/components/NotificationToast";
import { useAuthStore } from "@/store/auth";

interface Notification {
    id: string;
    donor: string;
    amount: number;
    message: string;
    sticker: string;
}

export default function DashboardPage() {
    const { user } = useAuthStore();
    const stats = getStats();
    const [recentDonations, setRecentDonations] = useState(mockDonations.slice(0, 5));
    const [notification, setNotification] = useState<Notification | null>(null);

    // Realtime 구독
    useEffect(() => {
        if (!user?.id) return;

        // 크리에이터 ID 가져오기 (임시로 user.id 사용, 실제로는 creator_id 조회 필요)
        const unsubscribe = realtimeManager.subscribeToCreatorDonations(
            user.id,
            (donation) => {
                // 새 후원 알림 표시
                setNotification({
                    id: donation.id,
                    donor: donation.donor_name,
                    amount: donation.amount,
                    message: donation.message,
                    sticker: donation.sticker,
                });

                // 최근 후원 목록 업데이트
                setRecentDonations(prev => [
                    {
                        id: donation.id,
                        donorName: donation.donor_name,
                        amount: donation.amount,
                        message: donation.message,
                        sticker: donation.sticker,
                        createdAt: donation.created_at,
                        isPinned: false,
                    },
                    ...prev.slice(0, 4)
                ]);
            }
        );

        return () => unsubscribe();
    }, [user]);


    return (
        <div className="max-w-6xl mx-auto">
            {/* 실시간 알림 토스트 */}
            {notification && (
                <NotificationToast
                    donor={notification.donor}
                    amount={notification.amount}
                    message={notification.message}
                    sticker={notification.sticker}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* 환영 메시지 */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-2xl font-bold text-[#333] mb-2">
                    안녕하세요, 개발하는 민수님! 👋
                </h2>
                <p className="text-[#666]">오늘도 따뜻한 쪽지가 도착했어요.</p>
            </motion.div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "총 후원금", value: `₩${stats.totalAmount.toLocaleString()}`, icon: "💰", color: "bg-[#FFFACD]" },
                    { label: "이번 달", value: `₩${stats.thisMonthAmount.toLocaleString()}`, icon: "📅", color: "bg-[#FFE4E1]" },
                    { label: "받은 쪽지", value: `${stats.totalNotes}개`, icon: "💌", color: "bg-[#E6F3FF]" },
                    { label: "이번 달 쪽지", value: `${stats.thisMonthNotes}개`, icon: "✨", color: "bg-[#E8F5E9]" },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        className={`${stat.color} rounded-xl p-6 shadow-sm relative overflow-hidden`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        {/* 테이프 장식 */}
                        <div className="absolute -top-1 left-4 w-10 h-3 bg-white/60 rounded transform -rotate-3"></div>

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-[#666] mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-[#333]">{stat.value}</p>
                            </div>
                            <span className="text-3xl">{stat.icon}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 메인 컨텐츠 그리드 */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* 최근 후원 */}
                <motion.div
                    className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-[#333] flex items-center gap-2">
                            <span>📬</span> 최근 쪽지
                        </h3>
                        <Link
                            href="/dashboard/messages"
                            className="text-sm text-[#FF6B6B] hover:underline"
                        >
                            전체 보기 →
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentDonations.map((donation, index) => (
                            <motion.div
                                key={donation.id}
                                className="flex items-start gap-4 p-4 bg-[#FFFACD]/30 rounded-xl"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                {/* 스티커 */}
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
                                    {donation.sticker}
                                </div>

                                {/* 내용 */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-[#333]">{donation.donorName}</span>
                                        {donation.isPinned && <span className="text-xs">📌</span>}
                                        <span className="text-xs text-[#999]">
                                            {new Date(donation.createdAt).toLocaleDateString('ko-KR')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#666] truncate">{donation.message}</p>
                                </div>

                                {/* 금액 */}
                                <div className="text-right">
                                    <span className="font-bold text-[#FF6B6B]">
                                        ₩{donation.amount.toLocaleString()}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 빠른 액션 */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {/* 내 프로필 카드 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                            <span>👤</span> 내 프로필
                        </h3>

                        <div className="text-center mb-4">
                            <div className="w-20 h-20 mx-auto rounded-full bg-[#FFFACD] flex items-center justify-center text-4xl shadow-md mb-3">
                                👨‍💻
                            </div>
                            <p className="font-bold text-[#333]">개발하는 민수</p>
                            <p className="text-sm text-[#999]">@devminsu</p>
                        </div>

                        <div className="space-y-2">
                            <Link
                                href="/devminsu"
                                className="block w-full py-2 px-4 bg-[#FFD95A] rounded-lg text-center font-medium text-[#333] hover:bg-[#FFCE3A] transition-colors"
                            >
                                👁️ 내 페이지 보기
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                className="block w-full py-2 px-4 bg-gray-100 rounded-lg text-center font-medium text-[#666] hover:bg-gray-200 transition-colors"
                            >
                                ⚙️ 프로필 수정
                            </Link>
                        </div>
                    </div>

                    {/* 위젯 바로가기 */}
                    <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-xl p-6 shadow-sm text-white">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <span>🎫</span> 위젯 만들기
                        </h3>
                        <p className="text-sm opacity-90 mb-4">
                            블로그나 GitHub에 예쁜 후원 배지를 달아보세요!
                        </p>
                        <Link
                            href="/dashboard/widget"
                            className="block w-full py-2 px-4 bg-white/20 rounded-lg text-center font-medium hover:bg-white/30 transition-colors"
                        >
                            위젯 생성하기 →
                        </Link>
                    </div>

                    {/* 정산 안내 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-[#333] mb-2 flex items-center gap-2">
                            <span>🍯</span> 수확하기
                        </h3>
                        <p className="text-sm text-[#666] mb-4">
                            정산 가능 금액: <span className="font-bold text-[#FF6B6B]">₩{stats.totalAmount.toLocaleString()}</span>
                        </p>
                        <button
                            className="w-full py-2 px-4 border-2 border-dashed border-[#FFD95A] rounded-lg text-[#666] font-medium hover:bg-[#FFFACD]/30 transition-colors"
                        >
                            정산 신청하기
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
