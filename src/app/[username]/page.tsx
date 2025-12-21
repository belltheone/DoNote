"use client";
// 크리에이터 페이지 - 사용자별 후원 페이지 (Digital Analog 디자인)
// 코르크보드 컨셉의 "메시지 월"

import { motion } from "framer-motion";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// 데모 데이터 - devminsu, demo 핸들 또는 DB에 없는 사용자용
const demoCreator = {
    username: "devminsu",
    displayName: "개발하는 민수",
    avatar: "👨‍💻",
    bio: "프론트엔드 개발자 | 오픈소스 기여자 | 기술 블로거",
    socialLinks: [
        { name: "GitHub", url: "https://github.com" },
        { name: "Blog", url: "https://blog.example.com" },
        { name: "Twitter", url: "https://twitter.com" }
    ],
    goal: {
        title: "맥북 할부금 갚기",
        current: 150000,
        target: 500000
    },
    notes: [
        { id: 1, nickname: "익명의 팬", message: "항상 좋은 글 감사합니다! ☕", amount: 5000, createdAt: "2024-12-14", sticker: "☕" },
        { id: 2, nickname: "코딩초보", message: "덕분에 리액트 배웠어요 💜", amount: 3000, createdAt: "2024-12-13", sticker: "🔥" },
        { id: 3, nickname: "개발자김씨", message: "오픈소스 응원합니다!", amount: 10000, createdAt: "2024-12-12", sticker: "💪" },
        { id: 4, nickname: "감사해요", message: "최고!", amount: 5000, createdAt: "2024-12-11", sticker: "⭐" },
        { id: 5, nickname: "열정맨", message: "화이팅하세요", amount: 3000, createdAt: "2024-12-10", sticker: "🎉" },
        { id: 6, nickname: "후원자A", message: "좋은 컨텐츠 감사합니다", amount: 5000, createdAt: "2024-12-09", sticker: "💌" },
    ]
};

// 데모 핸들 목록 (이 핸들들은 DB 조회 없이 데모 데이터 표시)
const DEMO_HANDLES = ["devminsu", "demo"];

interface Note {
    id: number | string;
    nickname: string;
    message: string;
    amount: number;
    createdAt: string;
    sticker: string;
}

interface Creator {
    username: string;
    displayName: string;
    avatar: string;
    bio: string;
    socialLinks: { name: string; url: string }[];
    goal: { title: string; current: number; target: number };
    notes: Note[];
}

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
    "rotate-[-4deg]",
    "rotate-[3deg]",
    "rotate-[-2deg]",
    "rotate-[5deg]",
    "rotate-[-3deg]",
    "rotate-[2deg]",
];

export default function CreatorPage({
    params
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = use(params);
    const [creator, setCreator] = useState<Creator | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const loadCreator = async () => {
            // 데모 핸들인 경우 바로 데모 데이터 사용
            if (DEMO_HANDLES.includes(username.toLowerCase())) {
                setCreator({ ...demoCreator, username });
                setIsLoading(false);
                return;
            }

            // DB에서 크리에이터 조회
            const { data: creatorData, error } = await supabase
                .from('creators')
                .select('*')
                .eq('handle', username)
                .single();

            if (error || !creatorData) {
                setNotFound(true);
                setIsLoading(false);
                return;
            }

            // 후원 메시지 조회
            const { data: donationsData } = await supabase
                .from('donations')
                .select('id, donor_name, message, amount, created_at, sticker')
                .eq('creator_id', creatorData.id)
                .eq('is_public', true)
                .order('created_at', { ascending: false })
                .limit(20);

            // social_links 객체를 배열로 변환하는 헬퍼
            const parseSocialLinks = (links: unknown): { name: string; url: string }[] => {
                if (!links) return [];
                if (Array.isArray(links)) return links;
                if (typeof links === 'object') {
                    // {github: "url", blog: "url"} -> [{name: "GitHub", url: "url"}, ...]
                    return Object.entries(links as Record<string, string>)
                        .filter(([, url]) => url && url.trim() !== '')
                        .map(([name, url]) => ({
                            name: name.charAt(0).toUpperCase() + name.slice(1),
                            url
                        }));
                }
                return [];
            };

            setCreator({
                username: creatorData.handle,
                displayName: creatorData.display_name,
                avatar: creatorData.avatar || '👨‍💻',
                bio: creatorData.bio || '',
                socialLinks: parseSocialLinks(creatorData.social_links),
                goal: creatorData.goal || { title: '목표 없음', current: 0, target: 100000 },
                notes: (donationsData || []).map(d => ({
                    id: d.id,
                    nickname: d.donor_name,
                    message: d.message || '',
                    amount: d.amount,
                    createdAt: d.created_at,
                    sticker: d.sticker || '☕',
                })),
            });
            setIsLoading(false);
        };

        loadCreator();
    }, [username]);

    // 로딩 상태
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-[#FF6B6B] border-t-transparent rounded-full" />
            </div>
        );
    }

    // 404 상태
    if (notFound || !creator) {
        return (
            <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex flex-col items-center justify-center gap-4">
                <span className="text-6xl">🍩</span>
                <h1 className="text-2xl font-bold text-[#333] dark:text-white">크리에이터를 찾을 수 없어요</h1>
                <p className="text-[#666]">@{username} 페이지가 존재하지 않습니다.</p>
                <Link href="/" className="mt-4 px-6 py-3 bg-[#FF6B6B] text-white rounded-xl hover:bg-[#e55555]">
                    홈으로 돌아가기
                </Link>
            </div>
        );
    }

    const goalPercent = Math.round((creator.goal.current / creator.goal.target) * 100);

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* 뒤로가기 */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white transition-colors mb-6"
                >
                    ← 도노트 홈
                </Link>

                {/* 프로필 카드 - 편지봉투 스타일 */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 shadow-md border border-gray-100 dark:border-gray-700 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* 테이프 장식 */}
                    <div className="absolute -top-2 left-8 w-16 h-4 bg-[#FFFACD]/80 rounded transform -rotate-3 shadow-sm"></div>
                    <div className="absolute -top-2 right-8 w-16 h-4 bg-[#FFE4E1]/80 rounded transform rotate-2 shadow-sm"></div>

                    {/* 아바타 & 정보 */}
                    <div className="flex items-start gap-6 mb-6">
                        {/* 아바타 - 스티커 스타일 */}
                        <div className="w-20 h-20 rounded-full bg-[#FFFACD] flex items-center justify-center text-4xl shadow-md border-4 border-white">
                            {creator.avatar}
                        </div>

                        {/* 정보 */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-1 text-[#333] dark:text-white">{creator.displayName}</h1>
                            <p className="text-[#666] dark:text-gray-400 mb-3">{creator.bio}</p>

                            {/* 소셜 링크 */}
                            <div className="flex gap-2">
                                {creator.socialLinks.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full text-[#666] dark:text-gray-300 hover:bg-[#FFD95A] hover:text-[#333] transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 목표 게이지 - 도넛이 쌓이는 접시 컨셉 */}
                    <div className="p-4 rounded-xl bg-[#FFFACD]/30 border-2 border-dashed border-[#FFD95A]">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-[#333] dark:text-white">🍩 {creator.goal.title}</span>
                            <span className="text-sm text-[#666] dark:text-gray-400">
                                {creator.goal.current.toLocaleString()}원 / {creator.goal.target.toLocaleString()}원
                            </span>
                        </div>
                        {/* 프로그레스 바 - 잉크가 차오르는 스타일 */}
                        <div className="relative h-6 rounded-full bg-gray-200 overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 left-0 rounded-full"
                                style={{ background: "linear-gradient(90deg, #FFD95A 0%, #FF6B6B 100%)" }}
                                initial={{ width: 0 }}
                                animate={{ width: `${goalPercent}%` }}
                                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#333]">
                                {goalPercent}%
                            </span>
                        </div>
                    </div>

                    {/* 후원하기 버튼 - 티켓 스타일 */}
                    <Link
                        href={`/donate/${username}`}
                        className="mt-6 w-full py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold text-lg text-center flex items-center justify-center gap-2 hover:bg-[#FF5252] transition-all shadow-md"
                    >
                        <span>✉️</span>
                        <span>쪽지 보내기</span>
                    </Link>
                </motion.div>

                {/* Digital Wall - 코르크보드 컨셉 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#333] dark:text-white font-sans">
                        <span>📌</span>
                        <span>응원 메시지 월</span>
                        <span className="text-sm font-sans font-normal text-[#666]">({creator.notes.length})</span>
                    </h2>

                    {/* 코르크보드 배경 */}
                    <div className="p-6 md:p-8 rounded-xl bg-[#D4A574] relative shadow-inner overflow-hidden cork-bg">
                        <div className="absolute inset-0 bg-black/5 pointer-events-none" />

                        {/* 메모지 그리드 - Masonry 스타일 (CSS Columns) */}
                        <div className="columns-2 md:columns-3 gap-6 space-y-6">
                            {creator.notes.map((note, index) => (
                                <motion.div
                                    key={note.id}
                                    className={`relative p-5 break-inside-avoid rounded-sm shadow-md transition-all cursor-pointer group ${noteColors[index % noteColors.length]
                                        }`}
                                    style={{
                                        rotate: `${(index % 6) * 2 - 5}deg`,
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        rotate: 0,
                                        zIndex: 10,
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.15)"
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                                >
                                    {/* 반투명 테이프 */}
                                    <div className="tape"></div>

                                    {/* 스티커 */}
                                    <div className="absolute -bottom-2 -right-2 text-3xl transform rotate-12 opacity-80 group-hover:scale-110 transition-transform">
                                        {note.sticker}
                                    </div>

                                    {/* 금액 태그 */}
                                    <div className="inline-block px-2 py-0.5 bg-black/5 rounded text-xs font-mono text-[#555] mb-2">
                                        ₩{note.amount.toLocaleString()}
                                    </div>

                                    {/* 메시지 */}
                                    <p className="text-[#333] font-message text-lg leading-snug mb-4 min-h-[60px]">
                                        {note.message}
                                    </p>

                                    {/* 닉네임 */}
                                    <div className="text-right">
                                        <span className="text-sm text-[#555] border-b border-[#555]/30 pb-0.5">
                                            from. {note.nickname}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* 나도 배지 달기 */}
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <p className="text-[#999] text-sm mb-4">나도 이런 페이지를 갖고 싶다면?</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-[#FFD95A] hover:bg-[#FFFACD] transition-all text-[#333] dark:text-white"
                    >
                        <span>🍩</span>
                        <span>도노트 시작하기</span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
