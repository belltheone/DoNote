"use client";
// 로그인 페이지 - 소셜 로그인 + 이메일 로그인 (Digital Analog 디자인)
// 편지봉투를 열어 로그인하는 컨셉

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
    const handleSocialLogin = async (provider: 'kakao' | 'google' | 'github' | 'apple') => {
        setIsLoading(provider);
        setError('');

        try {
            await signInWithProvider(provider);
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
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
                                    className="text-5xl mb-4"
                                    animate={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    🍩
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
                                        {/* 카카오 로그인 */}
                                        <motion.button
                                            onClick={() => { setIsEnvelopeOpen(true); handleSocialLogin('kakao'); }}
                                            disabled={isLoading !== null}
                                            className="w-full py-4 px-6 bg-[#FEE500] rounded-xl text-[#333] font-semibold flex items-center justify-center gap-3 hover:bg-[#FDD835] transition-all shadow-sm disabled:opacity-50"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isLoading === 'kakao' ? (
                                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⏳</motion.span>
                                            ) : (
                                                <>
                                                    <span className="text-xl">💬</span>
                                                    <span>카카오로 시작하기</span>
                                                </>
                                            )}
                                        </motion.button>

                                        {/* 구글 로그인 */}
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
                                                    <span className="text-xl">🔍</span>
                                                    <span>Google로 시작하기</span>
                                                </>
                                            )}
                                        </motion.button>

                                        {/* Apple 로그인 */}
                                        <motion.button
                                            onClick={() => { setIsEnvelopeOpen(true); handleSocialLogin('apple'); }}
                                            disabled={isLoading !== null}
                                            className="w-full py-4 px-6 bg-black rounded-xl text-white font-semibold flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isLoading === 'apple' ? (
                                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⏳</motion.span>
                                            ) : (
                                                <>
                                                    <span className="text-xl">🍎</span>
                                                    <span>Apple로 시작하기</span>
                                                </>
                                            )}
                                        </motion.button>

                                        {/* 깃허브 로그인 */}
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
                                                    <span className="text-xl">🐙</span>
                                                    <span>GitHub로 시작하기</span>
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
                        <span className="text-2xl">🍩</span>
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
