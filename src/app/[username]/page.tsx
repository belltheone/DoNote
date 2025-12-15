"use client";
// 크리에이터 페이지 - 사용자별 후원 페이지 (Digital Analog 디자인)
// 코르크보드 컨셉의 "메시지 월"

import { motion } from "framer-motion";
import Link from "next/link";
import { use } from "react";

// 더미 데이터 - 실제로는 DB에서 가져옴
const demoCreator = {
    username: "demo",
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
    // Digital Wall - 받은 후원 메모지들
    notes: [
        { id: 1, nickname: "익명의 팬", message: "항상 좋은 글 감사합니다! ☕", amount: 5000, createdAt: "2024-12-14", sticker: "☕" },
        { id: 2, nickname: "코딩초보", message: "덕분에 리액트 배웠어요 💜", amount: 3000, createdAt: "2024-12-13", sticker: "🔥" },
        { id: 3, nickname: "개발자김씨", message: "오픈소스 응원합니다!", amount: 10000, createdAt: "2024-12-12", sticker: "💪" },
        { id: 4, nickname: "감사해요", message: "최고!", amount: 5000, createdAt: "2024-12-11", sticker: "⭐" },
        { id: 5, nickname: "열정맨", message: "화이팅하세요", amount: 3000, createdAt: "2024-12-10", sticker: "🎉" },
        { id: 6, nickname: "후원자A", message: "좋은 컨텐츠 감사합니다", amount: 5000, createdAt: "2024-12-09", sticker: "💌" },
    ]
};

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

    // 실제로는 username으로 DB 조회
    const creator = demoCreator;
    const goalPercent = Math.round((creator.goal.current / creator.goal.target) * 100);

    return (
        <div className="min-h-screen bg-[#F9F9F9] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* 뒤로가기 */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[#666] hover:text-[#333] transition-colors mb-6"
                >
                    ← 도노트 홈
                </Link>

                {/* 프로필 카드 - 편지봉투 스타일 */}
                <motion.div
                    className="bg-white rounded-xl p-8 mb-8 shadow-md border border-gray-100 relative"
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
                            <h1 className="text-2xl font-bold mb-1 text-[#333]">{creator.displayName}</h1>
                            <p className="text-[#666] mb-3">{creator.bio}</p>

                            {/* 소셜 링크 */}
                            <div className="flex gap-2">
                                {creator.socialLinks.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 text-sm bg-gray-100 rounded-full text-[#666] hover:bg-[#FFD95A] hover:text-[#333] transition-colors"
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
                            <span className="font-medium text-[#333]">🍩 {creator.goal.title}</span>
                            <span className="text-sm text-[#666]">
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
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#333]">
                        <span>📌</span>
                        <span>응원 메시지 월</span>
                        <span className="text-sm font-normal text-[#999]">({creator.notes.length})</span>
                    </h2>

                    {/* 코르크보드 배경 */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#D4A574] to-[#B8956A] min-h-[400px] shadow-inner">
                        {/* 메모지 그리드 - Masonry 스타일 */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {creator.notes.map((note, index) => (
                                <motion.div
                                    key={note.id}
                                    className={`relative p-4 rounded ${noteColors[index % noteColors.length]} ${rotations[index % rotations.length]} shadow-md hover:rotate-0 hover:-translate-y-1 transition-all cursor-pointer`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                                >
                                    {/* 핀/테이프 */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-400 shadow-sm"></div>

                                    {/* 스티커 */}
                                    <div className="absolute -top-1 -right-1 text-xl transform rotate-12">
                                        {note.sticker}
                                    </div>

                                    {/* 금액 태그 */}
                                    <div className="text-xs text-[#999] mb-2 font-medium">
                                        ₩{note.amount.toLocaleString()}
                                    </div>

                                    {/* 메시지 */}
                                    <p className="text-sm font-medium mb-3 text-[#333] line-clamp-3">
                                        {note.message}
                                    </p>

                                    {/* 닉네임 - 손글씨 느낌 */}
                                    <div className="text-xs text-[#666] italic">
                                        - {note.nickname}
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
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#FFD95A] hover:bg-[#FFFACD] transition-all text-[#333]"
                    >
                        <span>🍩</span>
                        <span>도노트 시작하기</span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
