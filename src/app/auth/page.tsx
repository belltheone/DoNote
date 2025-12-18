"use client";
// 로그인 페이지 - 소셜 로그인 (Digital Analog 디자인)
// 편지봉투를 열어 로그인하는 컨셉

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithProvider } from "@/lib/supabase";

export default function AuthPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

    // 로그인 처리
    const handleLogin = async (provider: 'kakao' | 'google' | 'github') => {
        setIsLoading(provider);

        try {
            await signInWithProvider(provider);
            // 로그인 성공 시 대시보드로 이동
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-4 py-12">
            {/* 배경 데코 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-20 h-20 bg-[#FFFACD] rounded shadow-md transform rotate-6 opacity-30"></div>
                <div className="absolute top-40 right-20 w-16 h-16 bg-[#FFE4E1] rounded shadow-md transform -rotate-3 opacity-30"></div>
                <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-[#E6F3FF] rounded shadow-md transform rotate-2 opacity-20"></div>
                <div className="absolute bottom-20 right-10 w-14 h-14 bg-[#E8F5E9] rounded shadow-md transform -rotate-6 opacity-30"></div>
            </div>

            <div className="relative max-w-md w-full">
                {/* 뒤로가기 */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[#666] hover:text-[#333] transition-colors mb-8"
                >
                    ← 홈으로
                </Link>

                {/* 로그인 카드 - 편지봉투 컨셉 */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* 봉투 뚜껑 (상단 삼각형) */}
                    <motion.div
                        className="absolute -top-12 left-0 right-0 h-24 bg-[#F5DEB3] origin-bottom"
                        style={{
                            clipPath: "polygon(0 100%, 50% 30%, 100% 100%)",
                            zIndex: isEnvelopeOpen ? 0 : 10,
                        }}
                        animate={{
                            rotateX: isEnvelopeOpen ? 180 : 0,
                            y: isEnvelopeOpen ? -20 : 0,
                        }}
                        transition={{ duration: 0.5 }}
                    />

                    {/* 메인 카드 (봉투 본체) */}
                    <div className="bg-[#FFF8E7] rounded-xl p-8 shadow-lg border border-[#E8D5B7] relative overflow-hidden">
                        {/* 봉투 패턴 */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 right-0 h-full"
                                style={{
                                    backgroundImage: "repeating-linear-gradient(45deg, #C4A574 0, #C4A574 1px, transparent 1px, transparent 10px)",
                                }}
                            />
                        </div>

                        <div className="relative z-10">
                            {/* 로고 & 타이틀 */}
                            <div className="text-center mb-8">
                                <motion.div
                                    className="text-5xl mb-4"
                                    animate={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    🍩
                                </motion.div>
                                <h1 className="text-2xl font-bold text-[#333] mb-2">도노트에 오신 것을 환영해요!</h1>
                                <p className="text-[#666]">3초 만에 내 우체통을 만들어보세요</p>
                            </div>

                            {/* 소셜 로그인 버튼들 */}
                            <div className="space-y-3">
                                {/* 카카오 로그인 */}
                                <motion.button
                                    onClick={() => { setIsEnvelopeOpen(true); handleLogin('kakao'); }}
                                    disabled={isLoading !== null}
                                    className="w-full py-4 px-6 bg-[#FEE500] rounded-xl text-[#333] font-semibold flex items-center justify-center gap-3 hover:bg-[#FDD835] transition-all shadow-sm disabled:opacity-50"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLoading === 'kakao' ? (
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >⏳</motion.span>
                                    ) : (
                                        <>
                                            <span className="text-xl">💬</span>
                                            <span>카카오로 시작하기</span>
                                        </>
                                    )}
                                </motion.button>

                                {/* 구글 로그인 */}
                                <motion.button
                                    onClick={() => { setIsEnvelopeOpen(true); handleLogin('google'); }}
                                    disabled={isLoading !== null}
                                    className="w-full py-4 px-6 bg-white rounded-xl text-[#333] font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm border border-gray-200 disabled:opacity-50"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLoading === 'google' ? (
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >⏳</motion.span>
                                    ) : (
                                        <>
                                            <span className="text-xl">🔍</span>
                                            <span>Google로 시작하기</span>
                                        </>
                                    )}
                                </motion.button>

                                {/* 깃허브 로그인 */}
                                <motion.button
                                    onClick={() => { setIsEnvelopeOpen(true); handleLogin('github'); }}
                                    disabled={isLoading !== null}
                                    className="w-full py-4 px-6 bg-[#24292e] rounded-xl text-white font-semibold flex items-center justify-center gap-3 hover:bg-[#1a1e22] transition-all shadow-sm disabled:opacity-50"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLoading === 'github' ? (
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >⏳</motion.span>
                                    ) : (
                                        <>
                                            <span className="text-xl">🐙</span>
                                            <span>GitHub로 시작하기</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            {/* 구분선 */}
                            <div className="flex items-center gap-4 my-6">
                                <div className="flex-1 h-px bg-[#E8D5B7]"></div>
                                <span className="text-sm text-[#999]">또는</span>
                                <div className="flex-1 h-px bg-[#E8D5B7]"></div>
                            </div>

                            {/* 데모 체험 */}
                            <Link
                                href="/demo"
                                className="block w-full py-3 px-6 bg-transparent rounded-xl text-[#666] font-medium text-center border-2 border-dashed border-[#E8D5B7] hover:border-[#FFD95A] hover:bg-[#FFFACD]/30 transition-all"
                            >
                                🎪 로그인 없이 데모 체험하기
                            </Link>
                        </div>
                    </div>

                    {/* 봉투 실링 와크스 */}
                    <motion.div
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg border-4 border-[#FFF8E7]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                    >
                        <span className="text-2xl">🍩</span>
                    </motion.div>
                </motion.div>

                {/* 하단 안내 */}
                <p className="text-center text-sm text-[#999] mt-12">
                    로그인 시 <Link href="#" className="text-[#FF6B6B] hover:underline">이용약관</Link> 및{" "}
                    <Link href="#" className="text-[#FF6B6B] hover:underline">개인정보처리방침</Link>에 동의하게 됩니다.
                </p>
            </div>
        </div>
    );
}
