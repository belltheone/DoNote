"use client";
// 대시보드 메인 페이지 - 요약 카드, 최근 후원, 빠른 액션

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { realtimeManager } from "@/lib/realtime";
import { NotificationToast } from "@/components/NotificationToast";
import { useAuthStore } from "@/store/auth";
import { DashboardSkeleton } from "@/components/ui/skeleton";

interface Notification {
    id: string;
    donor: string;
    amount: number;
    message: string;
    sticker: string;
}

interface CreatorProfile {
    id: string;
    handle: string;
    displayName: string;
    avatar: string;
}

interface DonationItem {
    id: string;
    donorName: string;
    amount: number;
    message: string;
    sticker: string;
    createdAt: string;
    isPinned: boolean;
}

interface Stats {
    totalAmount: number;
    thisMonthAmount: number;
    totalNotes: number;
    thisMonthNotes: number;
}

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<CreatorProfile | null>(null);
    const [donations, setDonations] = useState<DonationItem[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalAmount: 0,
        thisMonthAmount: 0,
        totalNotes: 0,
        thisMonthNotes: 0,
    });
    const [notification, setNotification] = useState<Notification | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 사용자 데이터 로드
    useEffect(() => {
        if (!user?.id) {
            setIsLoading(false);
            return;
        }

        const loadData = async () => {
            // 1. 크리에이터 프로필 조회
            const { data: creatorData } = await supabase
                .from('creators')
                .select('id, handle, display_name, avatar')
                .eq('user_id', user.id)
                .single();

            if (creatorData) {
                setProfile({
                    id: creatorData.id,
                    handle: creatorData.handle,
                    displayName: creatorData.display_name,
                    avatar: creatorData.avatar || '👨‍💻',
                });

                // 2. 후원 목록 조회
                const { data: donationsData } = await supabase
                    .from('donations')
                    .select('*')
                    .eq('creator_id', creatorData.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (donationsData) {
                    setDonations(donationsData.map(d => ({
                        id: d.id,
                        donorName: d.donor_name,
                        amount: d.amount,
                        message: d.message,
                        sticker: d.sticker || '☕',
                        createdAt: d.created_at,
                        isPinned: d.is_pinned || false,
                    })));
                }

                // 3. 통계 계산
                const { data: allDonations } = await supabase
                    .from('donations')
                    .select('amount, created_at')
                    .eq('creator_id', creatorData.id);

                if (allDonations) {
                    const now = new Date();
                    const thisMonth = now.getMonth();
                    const thisYear = now.getFullYear();

                    const totalAmount = allDonations.reduce((sum, d) => sum + d.amount, 0);
                    const thisMonthDonations = allDonations.filter(d => {
                        const date = new Date(d.created_at);
                        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
                    });

                    setStats({
                        totalAmount,
                        thisMonthAmount: thisMonthDonations.reduce((sum, d) => sum + d.amount, 0),
                        totalNotes: allDonations.length,
                        thisMonthNotes: thisMonthDonations.length,
                    });
                }
            }
            setIsLoading(false);
        };

        loadData();
    }, [user]);

    // Realtime 구독
    useEffect(() => {
        if (!profile?.id) return;

        const unsubscribe = realtimeManager.subscribeToCreatorDonations(
            profile.id,
            (donation) => {
                setNotification({
                    id: donation.id,
                    donor: donation.donor_name,
                    amount: donation.amount,
                    message: donation.message,
                    sticker: donation.sticker,
                });

                // 최근 후원 목록에 추가
                setDonations(prev => [
                    {
                        id: donation.id,
                        donorName: donation.donor_name,
                        amount: donation.amount,
                        message: donation.message,
                        sticker: donation.sticker || '☕',
                        createdAt: donation.created_at,
                        isPinned: false,
                    },
                    ...prev.slice(0, 4)
                ]);
            }
        );

        return () => unsubscribe();
    }, [profile]);

    // 사용자 이름 (프로필이 없으면 이메일에서 추출)
    const displayName = profile?.displayName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '사용자';
    const handle = profile?.handle || 'unknown';
    const avatar = profile?.avatar || user?.user_metadata?.avatar_url || '👨‍💻';

    // 로딩 중
    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto">
                <DashboardSkeleton />
            </div>
        );
    }

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
                <h2 className="text-2xl font-bold text-[#333] dark:text-white mb-2">
                    안녕하세요, {displayName}님! 👋
                </h2>
                <p className="text-[#666] dark:text-gray-400">
                    {donations.length > 0 ? '오늘도 따뜻한 쪽지가 도착했어요.' : '아직 받은 쪽지가 없어요. 페이지를 공유해보세요!'}
                </p>
            </motion.div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: "총 후원금", value: `₩${stats.totalAmount.toLocaleString()}`, icon: "💰", color: "bg-[#FFFACD] dark:bg-yellow-900/30" },
                    { label: "이번 달", value: `₩${stats.thisMonthAmount.toLocaleString()}`, icon: "📅", color: "bg-[#FFE4E1] dark:bg-red-900/30" },
                    { label: "받은 쪽지", value: `${stats.totalNotes}개`, icon: "💌", color: "bg-[#E6F3FF] dark:bg-blue-900/30" },
                    { label: "이번 달 쪽지", value: `${stats.thisMonthNotes}개`, icon: "✨", color: "bg-[#E8F5E9] dark:bg-green-900/30" },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        className={`${stat.color} rounded-xl p-6 shadow-sm relative overflow-hidden`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="absolute -top-1 left-4 w-10 h-3 bg-white/60 dark:bg-white/20 rounded transform -rotate-3"></div>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-[#666] dark:text-gray-400 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-[#333] dark:text-white">{stat.value}</p>
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
                    className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white flex items-center gap-2">
                            <span>📬</span> 최근 쪽지
                        </h3>
                        <Link href="/dashboard/messages" className="text-sm text-[#FF6B6B] hover:underline">
                            전체 보기 →
                        </Link>
                    </div>

                    {donations.length > 0 ? (
                        <div className="space-y-4">
                            {donations.map((donation, index) => (
                                <motion.div
                                    key={donation.id}
                                    className="flex items-start gap-4 p-4 bg-[#FFFACD]/30 dark:bg-yellow-900/20 rounded-xl"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                >
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-xl shadow-sm">
                                        {donation.sticker}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-[#333] dark:text-white">{donation.donorName}</span>
                                            {donation.isPinned && <span className="text-xs">📌</span>}
                                            <span className="text-xs text-[#999] dark:text-gray-500">
                                                {new Date(donation.createdAt).toLocaleDateString('ko-KR')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#666] dark:text-gray-400 truncate">{donation.message}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-[#FF6B6B]">₩{donation.amount.toLocaleString()}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-3">📭</div>
                            <p className="text-[#666] dark:text-gray-400">아직 받은 쪽지가 없어요</p>
                            <p className="text-sm text-[#999] dark:text-gray-500 mt-1">페이지를 공유하면 쪽지를 받을 수 있어요!</p>
                        </div>
                    )}
                </motion.div>

                {/* 빠른 액션 */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {/* 내 프로필 카드 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                            <span>👤</span> 내 프로필
                        </h3>
                        <div className="text-center mb-4">
                            <div className="w-20 h-20 mx-auto rounded-full bg-[#FFFACD] dark:bg-yellow-900/50 flex items-center justify-center text-4xl shadow-md mb-3 overflow-hidden">
                                {typeof avatar === 'string' && avatar.startsWith('http') ? (
                                    <img src={avatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    avatar
                                )}
                            </div>
                            <p className="font-bold text-[#333] dark:text-white">{displayName}</p>
                            <p className="text-sm text-[#999] dark:text-gray-500">@{handle}</p>
                        </div>
                        <div className="space-y-2">
                            {profile ? (
                                <>
                                    <Link
                                        href={`/${handle}`}
                                        className="block w-full py-2 px-4 bg-[#FFD95A] rounded-lg text-center font-medium text-[#333] hover:bg-[#FFCE3A] transition-colors"
                                    >
                                        👁️ 내 페이지 보기
                                    </Link>
                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}/${handle}`;
                                            navigator.clipboard.writeText(url);
                                            alert('링크가 복사되었습니다! 🎉');
                                        }}
                                        className="block w-full py-2 px-4 bg-[#E6F3FF] dark:bg-blue-900/30 rounded-lg text-center font-medium text-[#333] dark:text-white hover:bg-[#D0E8FF] dark:hover:bg-blue-900/50 transition-colors"
                                    >
                                        📋 내 페이지 공유
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/onboarding"
                                    className="block w-full py-2 px-4 bg-[#FF6B6B] rounded-lg text-center font-medium text-white hover:bg-[#FF5252] transition-colors"
                                >
                                    🚀 프로필 만들기
                                </Link>
                            )}
                            <Link
                                href="/dashboard/settings"
                                className="block w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center font-medium text-[#666] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                ⚙️ 설정
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-2 flex items-center gap-2">
                            <span>💳</span> 정산하기
                        </h3>
                        <p className="text-sm text-[#666] dark:text-gray-400 mb-4">
                            정산 가능 금액: <span className="font-bold text-[#FF6B6B]">₩{stats.totalAmount.toLocaleString()}</span>
                        </p>
                        <Link
                            href="/dashboard/settlement"
                            className="block w-full py-2 px-4 border-2 border-dashed border-[#FFD95A] dark:border-yellow-600 rounded-lg text-center text-[#666] dark:text-gray-300 font-medium hover:bg-[#FFFACD]/30 dark:hover:bg-yellow-900/30 transition-colors"
                        >
                            정산 신청하기
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
