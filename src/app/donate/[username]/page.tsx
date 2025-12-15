"use client";
// 후원 페이지 - Guest Checkout (비회원 후원)
// Message First UX: 금액보다 메시지 작성을 먼저 유도

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, use } from "react";

// 더미 크리에이터 데이터
const demoCreator = {
    username: "demo",
    displayName: "개발하는 민수",
    avatar: "👨‍💻",
    reactionMessage: "감사합니다! 맛있는 커피 마시며 코딩할게요 ☕💜",
    reactionGif: "🎉"
};

// 금액 프리셋
const amountPresets = [3000, 5000, 10000];

export default function DonatePage({
    params
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = use(params);

    // 스텝 상태 (1: 메시지, 2: 금액, 3: 닉네임, 4: 결제, 5: 완료)
    const [step, setStep] = useState(1);

    // 폼 데이터
    const [message, setMessage] = useState("");
    const [amount, setAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState("");
    const [nickname, setNickname] = useState("");
    const [tipEnabled, setTipEnabled] = useState(true);

    // 실제 결제 금액 계산 (팁 포함)
    const finalAmount = (amount || 0) + (tipEnabled ? 500 : 0);

    // 다음 단계로 이동
    const goNext = () => {
        if (step < 5) setStep(step + 1);
    };

    // 이전 단계로 이동
    const goBack = () => {
        if (step > 1) setStep(step - 1);
    };

    // 커스텀 금액 설정
    const handleCustomAmount = (value: string) => {
        setCustomAmount(value);
        const numValue = parseInt(value.replace(/,/g, ""));
        if (!isNaN(numValue) && numValue >= 1000) {
            setAmount(numValue);
        }
    };

    // 결제 처리 (Mock)
    const handlePayment = () => {
        // 실제로는 여기서 PG 연동
        setTimeout(() => {
            setStep(5);
        }, 1500);
        setStep(4);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] py-8 px-4">
            {/* 배경 효과 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-md mx-auto">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href={`/${username}`}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        돌아가기
                    </Link>

                    {/* 스텝 인디케이터 */}
                    {step < 5 && (
                        <div className="flex gap-1">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`w-2 h-2 rounded-full transition-colors ${s <= step ? "gradient-bg" : "bg-white/20"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* 크리에이터 미니 프로필 */}
                {step < 5 && (
                    <motion.div
                        className="flex items-center gap-4 mb-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center text-2xl">
                            {demoCreator.avatar}
                        </div>
                        <div>
                            <h1 className="font-bold">{demoCreator.displayName}</h1>
                            <p className="text-sm text-gray-400">에게 커피 한 잔 ☕</p>
                        </div>
                    </motion.div>
                )}

                {/* 스텝별 컨텐츠 */}
                <AnimatePresence mode="wait">
                    {/* Step 1: 메시지 작성 (Message First!) */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card p-6"
                        >
                            <h2 className="text-xl font-bold mb-2">💌 응원 메시지</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                따뜻한 한마디가 크리에이터에게 큰 힘이 됩니다
                            </p>

                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="항상 좋은 글 감사합니다! 커피 한 잔 하세요 ☕"
                                className="w-full h-32 p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500 transition-colors"
                                maxLength={200}
                            />
                            <div className="text-right text-sm text-gray-500 mt-2">
                                {message.length}/200
                            </div>

                            <button
                                onClick={goNext}
                                disabled={message.length < 1}
                                className="w-full mt-4 py-4 gradient-bg rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                            >
                                다음으로
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: 금액 선택 */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card p-6"
                        >
                            <h2 className="text-xl font-bold mb-2">☕ 후원 금액</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                부담 없이 커피 한 잔 가격부터
                            </p>

                            {/* 프리셋 버튼 */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {amountPresets.map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => { setAmount(preset); setCustomAmount(""); }}
                                        className={`py-4 rounded-2xl font-semibold transition-all ${amount === preset && !customAmount
                                                ? "gradient-bg text-white"
                                                : "bg-white/5 border border-white/10 hover:border-purple-500"
                                            }`}
                                    >
                                        ₩{preset.toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            {/* 커스텀 금액 */}
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
                                <input
                                    type="text"
                                    value={customAmount}
                                    onChange={(e) => handleCustomAmount(e.target.value)}
                                    placeholder="직접 입력"
                                    className="w-full py-4 pl-10 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">최소 1,000원부터</p>

                            {/* 플랫폼 팁 (선택) */}
                            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div>
                                        <span className="font-medium">💜 도노트 후원</span>
                                        <p className="text-sm text-gray-400 mt-1">
                                            플랫폼 운영비 500원 더 내기
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setTipEnabled(!tipEnabled)}
                                        className={`w-12 h-7 rounded-full transition-colors ${tipEnabled ? "gradient-bg" : "bg-white/20"
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${tipEnabled ? "translate-x-6" : "translate-x-1"
                                            }`} />
                                    </button>
                                </label>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={goBack}
                                    className="flex-1 py-4 glass-card text-white font-semibold hover:bg-white/10 transition-colors"
                                >
                                    이전
                                </button>
                                <button
                                    onClick={goNext}
                                    disabled={!amount}
                                    className="flex-1 py-4 gradient-bg rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                                >
                                    다음으로
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: 닉네임 & 결제 확인 */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-card p-6"
                        >
                            <h2 className="text-xl font-bold mb-2">✨ 닉네임</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                크리에이터에게 표시될 이름이에요
                            </p>

                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="익명의 팬"
                                className="w-full py-4 px-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                maxLength={20}
                            />

                            {/* 결제 요약 */}
                            <div className="mt-6 p-4 rounded-2xl bg-white/5 space-y-3">
                                <div className="flex justify-between text-gray-400">
                                    <span>후원금</span>
                                    <span>₩{(amount || 0).toLocaleString()}</span>
                                </div>
                                {tipEnabled && (
                                    <div className="flex justify-between text-gray-400">
                                        <span>플랫폼 후원</span>
                                        <span>₩500</span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-white/10 flex justify-between font-bold">
                                    <span>총 결제금액</span>
                                    <span className="gradient-text">₩{finalAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={goBack}
                                    className="flex-1 py-4 glass-card text-white font-semibold hover:bg-white/10 transition-colors"
                                >
                                    이전
                                </button>
                                <button
                                    onClick={handlePayment}
                                    disabled={nickname.length < 1}
                                    className="flex-1 py-4 gradient-bg rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                                >
                                    결제하기
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: 결제 중 */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="glass-card p-12 text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center animate-pulse">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold mb-2">결제 처리 중...</h2>
                            <p className="text-gray-400">잠시만 기다려주세요</p>
                        </motion.div>
                    )}

                    {/* Step 5: 완료 + 리액션 */}
                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            {/* 성공 애니메이션 */}
                            <motion.div
                                className="text-8xl mb-6"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{ duration: 0.6 }}
                            >
                                {demoCreator.reactionGif}
                            </motion.div>

                            <h2 className="text-2xl font-bold mb-2">후원 완료!</h2>
                            <p className="text-gray-400 mb-8">
                                {demoCreator.displayName}님에게 마음을 전달했어요
                            </p>

                            {/* 크리에이터 리액션 메시지 */}
                            <motion.div
                                className="glass-card p-6 text-left mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-xl">
                                        {demoCreator.avatar}
                                    </div>
                                    <span className="font-bold">{demoCreator.displayName}</span>
                                </div>
                                <p className="text-gray-300 italic">
                                    "{demoCreator.reactionMessage}"
                                </p>
                            </motion.div>

                            {/* 공유 버튼들 */}
                            <div className="flex gap-4">
                                <Link
                                    href={`/${username}`}
                                    className="flex-1 py-4 glass-card text-white font-semibold hover:bg-white/10 transition-colors text-center"
                                >
                                    페이지로 돌아가기
                                </Link>
                                <button className="flex-1 py-4 gradient-bg rounded-full text-white font-semibold hover:opacity-90 transition-all">
                                    공유하기
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
