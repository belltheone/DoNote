"use client";
// 로그인 페이지 - 소셜 로그인 + 이메일 로그인 (Digital Analog 디자인)
// 편지봉투를 열어 로그인하는 컨셉

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithProvider, supabase } from "@/lib/supabase";

export default function AuthPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'social' | 'email'>('social');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');

    // 소셜 로그인 처리
    const handleSocialLogin = async (provider: 'naver' | 'google' | 'github' | 'kakao' | 'apple') => {
        setIsLoading(provider);
        setError('');

        try {
            // OAuth 제공자로 리디렉션 (콜백 페이지에서 처리됨)
            await signInWithProvider(provider);
            // signInWithProvider가 OAuth 페이지로 리디렉션하므로
            // 여기서 추가 리디렉션 불필요
        } catch (err) {
            console.error('Login error:', err);
            setError('로그인에 실패했습니다. 다시 시도해주세요.');
            setIsLoading(null);
        }
    };

    // 이메일 로그인/회원가입 처리
    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading('email');
        setError('');

        try {
            if (isSignUp) {
                // 회원가입
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setError('확인 이메일을 발송했습니다. 이메일을 확인해주세요.');
                setIsLoading(null);
            } else {
                // 로그인
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/dashboard');
            }
        } catch (err: unknown) {
            console.error('Auth error:', err);
            const errorMessage = err instanceof Error ? err.message : '인증에 실패했습니다.';
            setError(errorMessage);
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex items-center justify-center px-4 py-12">
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
                    className="inline-flex items-center gap-2 text-[#666] dark:text-gray-400 hover:text-[#333] dark:hover:text-white transition-colors mb-8"
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
                    <div className="bg-[#FFF8E7] dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-[#E8D5B7] dark:border-gray-700 relative overflow-hidden">
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
                                    className="mb-4"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <Image
                                        src="/logo-140.png"
                                        alt="도노트 로고"
                                        width={64}
                                        height={64}
                                        className="rounded-xl"
                                        priority
                                    />
                                </motion.div>
                                <h1 className="text-2xl font-bold text-[#333] dark:text-white mb-2">도노트에 오신 것을 환영해요!</h1>
                                <p className="text-[#666] dark:text-gray-400">3초 만에 내 우체통을 만들어보세요</p>
                            </div>

                            <AnimatePresence mode="wait">
                                {authMode === 'social' ? (
                                    <motion.div
                                        key="social"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-3"
                                    >
                                        {/* Google 로그인 */}
                                        <motion.button
                                            onClick={() => { setIsEnvelopeOpen(true); handleSocialLogin('google'); }}
                                            disabled={isLoading !== null}
                                            className="w-full py-4 px-6 bg-white rounded-xl text-[#333] font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm border border-gray-200 disabled:opacity-50"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isLoading === 'google' ? (
                                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⏳</motion.span>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                                    <span>Google로 시작하기</span>
                                                </>
                                            )}
                                        </motion.button>

                                        {/* Naver 로그인 */}
                                        <motion.button
                                            onClick={() => { setIsEnvelopeOpen(true); handleSocialLogin('naver'); }}
                                            disabled={isLoading !== null}
                                            className="w-full py-4 px-6 bg-[#03C75A] rounded-xl text-white font-semibold flex items-center justify-center gap-3 hover:bg-[#02b350] transition-all shadow-sm disabled:opacity-50"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isLoading === 'naver' ? (
                                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⏳</motion.span>
                                            ) : (
                                                <>
                                                    <span className="font-bold text-xl">N</span>
                                                    <span>네이버로 시작하기</span>
                                                </>
                                            )}
                                        </motion.button>

                                        {/* GitHub 로그인 */}
                                        <motion.button
                                            onClick={() => { setIsEnvelopeOpen(true); handleSocialLogin('github'); }}
                                            disabled={isLoading !== null}
                                            className="w-full py-4 px-6 bg-[#24292e] rounded-xl text-white font-semibold flex items-center justify-center gap-3 hover:bg-[#1a1e22] transition-all shadow-sm disabled:opacity-50"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isLoading === 'github' ? (
                                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⏳</motion.span>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                                                    <span>GitHub로 시작하기</span>
                                                </>
                                            )}
                                        </motion.button>

                                        {/* Kakao 로그인 */}
                                        <motion.button
                                            onClick={() => { setIsEnvelopeOpen(true); handleSocialLogin('kakao'); }}
                                            disabled={isLoading !== null}
                                            className="w-full py-4 px-6 bg-[#FEE500] rounded-xl text-[#3C1E1E] font-semibold flex items-center justify-center gap-3 hover:bg-[#FAD800] transition-all shadow-sm disabled:opacity-50"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isLoading === 'kakao' ? (
                                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⏳</motion.span>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#3C1E1E" d="M12 3C6.477 3 2 6.463 2 10.806c0 2.868 1.855 5.386 4.64 6.808l-.99 3.67c-.03.11.07.22.18.18l4.36-2.9c.59.08 1.19.12 1.81.12 5.523 0 10-3.463 10-7.806S17.523 3 12 3z" /></svg>
                                                    <span>카카오로 시작하기</span>
                                                </>
                                            )}
                                        </motion.button>

                                        {/* Apple 로그인 */}
                                        <motion.button
                                            onClick={() => { setIsEnvelopeOpen(true); handleSocialLogin('apple'); }}
                                            disabled={isLoading !== null}
                                            className="w-full py-4 px-6 bg-black rounded-xl text-white font-semibold flex items-center justify-center gap-3 hover:bg-gray-900 transition-all shadow-sm disabled:opacity-50"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isLoading === 'apple' ? (
                                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⏳</motion.span>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                                                    <span>Apple로 시작하기</span>
                                                </>
                                            )}
                                        </motion.button>

                                        {/* 구분선 */}
                                        <div className="flex items-center gap-4 my-6">
                                            <div className="flex-1 h-px bg-[#E8D5B7]"></div>
                                            <span className="text-sm text-[#999]">또는</span>
                                            <div className="flex-1 h-px bg-[#E8D5B7]"></div>
                                        </div>

                                        {/* 이메일 로그인 전환 */}
                                        <button
                                            onClick={() => setAuthMode('email')}
                                            className="w-full py-3 px-6 bg-transparent rounded-xl text-[#666] font-medium text-center border-2 border-dashed border-[#E8D5B7] hover:border-[#FFD95A] hover:bg-[#FFFACD]/30 transition-all"
                                        >
                                            ✉️ 이메일로 시작하기
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="email"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <form onSubmit={handleEmailAuth} className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-[#666] mb-2">이메일</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-[#E8D5B7] focus:border-[#FFD95A] focus:outline-none transition-colors bg-white"
                                                    placeholder="you@example.com"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-[#666] mb-2">비밀번호</label>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-[#E8D5B7] focus:border-[#FFD95A] focus:outline-none transition-colors bg-white"
                                                    placeholder="••••••••"
                                                    required
                                                    minLength={6}
                                                />
                                            </div>

                                            {error && (
                                                <p className={`text-sm ${error.includes('이메일') ? 'text-green-600' : 'text-red-500'}`}>{error}</p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isLoading !== null}
                                                className="w-full py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold hover:bg-[#FF5252] transition-all shadow-sm disabled:opacity-50"
                                            >
                                                {isLoading === 'email' ? '처리 중...' : (isSignUp ? '회원가입' : '로그인')}
                                            </button>
                                        </form>

                                        {/* 모드 전환 */}
                                        <div className="mt-4 text-center">
                                            <button
                                                onClick={() => setIsSignUp(!isSignUp)}
                                                className="text-sm text-[#666] hover:text-[#333]"
                                            >
                                                {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
                                            </button>
                                        </div>

                                        {/* 소셜 로그인으로 돌아가기 */}
                                        <button
                                            onClick={() => { setAuthMode('social'); setError(''); }}
                                            className="w-full mt-4 py-3 text-[#999] text-sm hover:text-[#666] transition-colors"
                                        >
                                            ← 소셜 로그인으로 돌아가기
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* 봉투 실링 왁스 */}
                    <motion.div
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-lg border-4 border-[#FFF8E7]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                    >
                        <Image
                            src="/logo-140.png"
                            alt="도노트"
                            width={24}
                            height={24}
                            className="rounded"
                        />
                    </motion.div>
                </motion.div>

                {/* 하단 안내 */}
                <p className="text-center text-sm text-[#999] mt-12">
                    로그인 시 <Link href="/terms" className="text-[#FF6B6B] hover:underline">이용약관</Link> 및{" "}
                    <Link href="/privacy" className="text-[#FF6B6B] hover:underline">개인정보처리방침</Link>에 동의하게 됩니다.
                </p>
            </div>
        </div>
    );
}
