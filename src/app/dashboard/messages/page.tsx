"use client";
// 메시지 월 페이지 - 드래그 앤 드롭 가능한 쪽지 보드
// 코르크보드 컨셉의 핀터레스트 스타일 레이아웃

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase, type Donation } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth";
import { MessageWallSkeleton } from "@/components/ui/Skeleton";
import { MessagesEmptyState } from "@/components/ui/EmptyState";

// 포스트잇 색상
const noteColors = [
    "bg-[#FFFACD]", // 노란색
    "bg-[#FFE4E1]", // 분홍색
    "bg-[#E6F3FF]", // 파란색
    "bg-[#E8F5E9]", // 연두색
    "bg-[#F3E5F5]", // 보라색
];

// 랜덤 회전 각도
const rotations = [
    "rotate-[-3deg]",
    "rotate-[2deg]",
    "rotate-[-2deg]",
    "rotate-[4deg]",
    "rotate-[-4deg]",
    "rotate-[1deg]",
];

export default function MessagesPage() {
    const { user } = useAuthStore();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pinned'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

    // 실제 데이터 로드
    useEffect(() => {
        const loadDonations = async () => {
            if (!user?.id) {
                // 로그인 안됨 - 빈 배열 (데모 모드는 별도 페이지에서만)
                setDonations([]);
                setIsLoading(false);
                return;
            }

            try {
                // 1. 크리에이터 프로필 조회
                const { data: creator } = await supabase
                    .from('creators')
                    .select('id')
                    .eq('user_id', user.id)
                    .single();

                if (!creator) {
                    setDonations([]);
                    setIsLoading(false);
                    return;
                }

                // 2. 후원 데이터 조회
                const { data: donationsData, error } = await supabase
                    .from('donations')
                    .select('*')
                    .eq('creator_id', creator.id)
                    .order('created_at', { ascending: false });

                if (error || !donationsData || donationsData.length === 0) {
                    // 실제 데이터가 없으면 빈 배열
                    setDonations([]);
                } else {
                    // 실제 데이터 변환
                    setDonations(donationsData.map(d => ({
                        id: d.id,
                        creatorId: d.creator_id,
                        donorName: d.donor_name,
                        message: d.message,
                        amount: d.amount,
                        sticker: d.sticker || '☕',
                        isTipIncluded: d.is_tip_included,
                        status: d.status,
                        createdAt: d.created_at,
                        isPinned: d.is_pinned || false,
                    })));
                }
            } catch (error) {
                console.error('Failed to load donations:', error);
                setDonations([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadDonations();
    }, [user]);

    // 로딩 중이면 스켈레톤 표시
    if (isLoading) {
        return <MessageWallSkeleton />;
    }

    // 핀 토글
    const togglePin = (id: string) => {
        setDonations(prev =>
            prev.map(d => d.id === id ? { ...d, isPinned: !d.isPinned } : d)
        );
    };

    // 필터링 및 정렬
    const filteredDonations = donations
        .filter(d => filter === 'all' || d.isPinned)
        .sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return b.amount - a.amount;
        });

    // 핀된 항목을 먼저
    const sortedDonations = [
        ...filteredDonations.filter(d => d.isPinned),
        ...filteredDonations.filter(d => !d.isPinned),
    ];

    return (
        <div className="max-w-6xl mx-auto">
            {/* 헤더 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-[#333] flex items-center gap-2">
                        <span>📌</span> 메시지 월
                    </h2>
                    <p className="text-sm text-[#666]">
                        총 {donations.length}개의 쪽지 · 핀된 쪽지 {donations.filter(d => d.isPinned).length}개
                    </p>
                </div>

                {/* 필터 & 정렬 */}
                <div className="flex gap-2">
                    {/* 필터 */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'pinned')}
                        className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-[#333] focus:outline-none focus:border-[#FFD95A]"
                    >
                        <option value="all">전체 쪽지</option>
                        <option value="pinned">핀된 쪽지만</option>
                    </select>

                    {/* 정렬 */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                        className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-[#333] focus:outline-none focus:border-[#FFD95A]"
                    >
                        <option value="date">최신순</option>
                        <option value="amount">금액순</option>
                    </select>
                </div>
            </div>

            {/* 코르크보드 */}
            <motion.div
                className="p-6 rounded-xl bg-gradient-to-br from-[#D4A574] to-[#B8956A] min-h-[600px] shadow-inner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {/* 메모지 그리드 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {sortedDonations.map((donation, index) => (
                        <motion.div
                            key={donation.id}
                            className={`relative p-5 rounded ${noteColors[index % noteColors.length]} ${rotations[index % rotations.length]} shadow-md hover:rotate-0 hover:-translate-y-2 hover:shadow-xl transition-all cursor-pointer group`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            layout
                        >
                            {/* 핀 버튼 - 개선된 UI */}
                            <motion.button
                                onClick={() => togglePin(donation.id)}
                                className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xl transition-all ${donation.isPinned
                                    ? 'drop-shadow-lg scale-110'
                                    : 'opacity-40 group-hover:opacity-100'
                                    }`}
                                whileHover={{ scale: 1.3, rotate: 15 }}
                                whileTap={{ scale: 0.9 }}
                                title={donation.isPinned ? '핀 해제' : '핀 고정'}
                            >
                                📌
                            </motion.button>

                            {/* 스티커 */}
                            <div className="absolute -top-1 -right-1 text-2xl transform rotate-12">
                                {donation.sticker}
                            </div>

                            {/* 금액 배지 */}
                            <div className="inline-block px-2 py-1 bg-white/50 rounded text-xs font-medium text-[#666] mb-2">
                                ₩{donation.amount.toLocaleString()}
                            </div>

                            {/* 메시지 */}
                            <p className="text-lg font-message text-[#333] mb-3 min-h-[60px] leading-relaxed">
                                {donation.message}
                            </p>

                            {/* 하단 정보 */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-[#666] italic">
                                    - {donation.donorName}
                                </span>
                                <span className="text-xs text-[#999]">
                                    {new Date(donation.createdAt).toLocaleDateString('ko-KR', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>

                            {/* 핀 표시 */}
                            {donation.isPinned && (
                                <div className="absolute -bottom-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full shadow-sm">
                                    📌 Best
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* 빈 상태 */}
                {sortedDonations.length === 0 && (
                    <div className="bg-white/10 backdrop-blur rounded-xl">
                        <MessagesEmptyState />
                    </div>
                )}
            </motion.div>

            {/* 하단 안내 */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100 flex items-center gap-4">
                <span className="text-2xl">💡</span>
                <div>
                    <p className="text-sm font-medium text-[#333]">팁: 쪽지를 핀으로 고정하세요!</p>
                    <p className="text-xs text-[#666]">중요한 쪽지나 Best 메시지는 핀을 눌러 상단에 고정할 수 있어요.</p>
                </div>
            </div>
        </div>
    );
}
