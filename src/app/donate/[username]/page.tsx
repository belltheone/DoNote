"use client";
// 후원 페이지 - Guest Checkout (Digital Analog 디자인)
// PortOne V2 SDK 결제 연동

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, use, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { requestPayment, generateOrderId } from "@/lib/payment";
import { toast } from "sonner";

// 크리에이터 타입
interface Creator {
    id: string;
    handle: string;
    displayName: string;
    avatar: string;
}

// 더미 크리에이터 데이터 (폴백용)
const demoCreator = {
    id: "demo",
    username: "demo",
    displayName: "개발하는 민수",
    avatar: "👨‍💻",
    reactionMessage: "감사합니다! 맛있는 커피 마시며 코딩할게요 ☕💜",
    reactionEmoji: "🎉"
};

// 금액 프리셋 - 우표 스타일
const amountPresets = [
    { value: 3000, emoji: "☕", label: "커피 한 잔" },
    { value: 5000, emoji: "🍩", label: "도넛 세트" },
    { value: 10000, emoji: "🍰", label: "케이크 한 조각" },
];

// 스티커 옵션
const stickers = ["☕", "🔥", "💪", "⭐", "🎉", "💌", "🍩", "❤️"];

export default function DonatePage({
    params
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = use(params);

    // 크리에이터 정보
    const [creator, setCreator] = useState<Creator | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 스텝 상태 (1: 메시지, 2: 금액, 3: 닉네임, 4: 결제, 5: 완료)
    const [step, setStep] = useState(1);

    // 폼 데이터
    const [message, setMessage] = useState("");
    const [selectedSticker, setSelectedSticker] = useState("☕");
    const [amount, setAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState("");
    const [nickname, setNickname] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState("");
    const [tipEnabled, setTipEnabled] = useState(true); // 도노트 팁 500원 기본 활성화

    // 도노트 팁 금액
    const DONOTE_TIP = 500;

    // 플랫폼 수수료 5% 계산
    const platformFeeRate = 0.05; // 5%
    const platformFee = Math.round((amount || 0) * platformFeeRate);
    const creatorAmount = (amount || 0) - platformFee; // 크리에이터 수령액
    const tipAmount = tipEnabled ? DONOTE_TIP : 0; // 도노트 팁
    const finalAmount = (amount || 0) + tipAmount; // 총 결제금액 = 후원금액 + 팁

    // 크리에이터 정보 로드
    useEffect(() => {
        const loadCreator = async () => {
            const { data } = await supabase
                .from('creators')
                .select('id, handle, display_name, avatar')
                .eq('handle', username)
                .single();

            if (data) {
                setCreator({
                    id: data.id,
                    handle: data.handle,
                    displayName: data.display_name,
                    avatar: data.avatar || '👨‍💻',
                });
            }
            setIsLoading(false);
        };
        loadCreator();
    }, [username]);

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

    // 결제 처리 (PortOne V2)
    const handlePayment = async () => {
        if (!amount || !nickname.trim() || !message.trim()) {
            toast.error('필수 정보를 입력해주세요');
            return;
        }

        setIsProcessing(true);
        setPaymentError("");
        setStep(4); // 결제 중 화면

        try {
            const orderId = generateOrderId();
            const creatorId = creator?.id || 'demo';
            const creatorName = creator?.displayName || demoCreator.displayName;

            const result = await requestPayment({
                orderId,
                orderName: `${creatorName}님에게 후원`,
                amount: finalAmount,
                buyerName: nickname,
                creatorId,
                message,
                sticker: selectedSticker,
                isTipIncluded: tipEnabled, // 도노트 팁 포함 여부
                tipAmount: tipAmount, // 팁 금액
            });

            if (result.success) {
                toast.success('후원이 완료되었습니다! 🎉');
                setStep(5); // 완료 화면
            } else {
                setPaymentError(result.error || '결제에 실패했습니다');
                toast.error(result.error || '결제에 실패했습니다');
                setStep(3); // 다시 결제 시도
            }
        } catch (error) {
            console.error('결제 오류:', error);
            setPaymentError('결제 처리 중 오류가 발생했습니다');
            toast.error('결제 처리 중 오류가 발생했습니다');
            setStep(3);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] py-8 px-4">
            <div className="max-w-md mx-auto">
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href={`/${username}`}
                        className="flex items-center gap-2 text-[#666] hover:text-[#333] transition-colors"
                    >
                        ← 돌아가기
                    </Link>

                    {/* 스텝 인디케이터 - 종이접기 스타일 */}
                    {step < 5 && (
                        <div className="flex gap-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`w-3 h-3 rounded-sm transition-all ${s <= step
                                        ? "bg-[#FFD95A] rotate-45"
                                        : "bg-gray-200 rotate-0"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* 크리에이터 미니 프로필 */}
                {step < 5 && (
                    <motion.div
                        className="flex items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="w-12 h-12 rounded-full bg-[#FFFACD] flex items-center justify-center text-2xl shadow-sm">
                            {demoCreator.avatar}
                        </div>
                        <div>
                            <h1 className="font-bold text-[#333]">{demoCreator.displayName}</h1>
                            <p className="text-sm text-[#666]">님에게 쪽지 보내기 ✉️</p>
                        </div>
                    </motion.div>
                )}

                {/* 스텝별 컨텐츠 */}
                <AnimatePresence mode="wait">
                    {/* Step 1: 메시지 작성 - 편지지 스타일 */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 relative"
                        >
                            {/* 테이프 장식 */}
                            <div className="absolute -top-2 left-6 w-12 h-3 bg-[#FFFACD]/80 rounded transform -rotate-2 shadow-sm"></div>

                            <h2 className="text-xl font-bold mb-2 text-[#333]">💌 응원 메시지</h2>
                            <p className="text-[#666] text-sm mb-6">
                                {demoCreator.displayName}님에게 따뜻한 쪽지를 써주세요
                            </p>

                            {/* 스티커 선택 */}
                            <div className="flex gap-2 mb-4 flex-wrap">
                                {stickers.map((sticker) => (
                                    <button
                                        key={sticker}
                                        onClick={() => setSelectedSticker(sticker)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${selectedSticker === sticker
                                            ? "bg-[#FFFACD] shadow-md scale-110 ring-2 ring-[#FFD95A]"
                                            : "bg-gray-100 hover:bg-gray-200"
                                            }`}
                                    >
                                        {sticker}
                                    </button>
                                ))}
                            </div>

                            {/* 메시지 입력 - 밑줄 노트 스타일 */}
                            <div className="relative">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="항상 좋은 글 감사합니다! 커피 한 잔 하세요 ☕"
                                    className="w-full h-32 p-4 rounded-xl bg-[#FFFEFA] border-2 border-dashed border-gray-200 text-[#333] placeholder-[#999] resize-none focus:outline-none focus:border-[#FFD95A] transition-colors"
                                    style={{
                                        backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #E8E8E8 31px, #E8E8E8 32px)",
                                        lineHeight: "32px"
                                    }}
                                    maxLength={200}
                                />
                            </div>
                            <div className="text-right text-sm text-[#999] mt-2">
                                {message.length}/200
                            </div>

                            <button
                                onClick={goNext}
                                disabled={message.length < 1}
                                className="w-full mt-4 py-4 bg-[#FFD95A] rounded-xl text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFCE3A] transition-all shadow-md"
                            >
                                다음으로 →
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: 금액 선택 - 우표 스타일 */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 relative"
                        >
                            <div className="absolute -top-2 right-6 w-12 h-3 bg-[#FFE4E1]/80 rounded transform rotate-2 shadow-sm"></div>

                            <h2 className="text-xl font-bold mb-2 text-[#333]">🎫 후원 금액</h2>
                            <p className="text-[#666] text-sm mb-6">
                                부담 없이 커피 한 잔 가격부터
                            </p>

                            {/* 프리셋 버튼 - 우표 스타일 */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {amountPresets.map((preset) => (
                                    <button
                                        key={preset.value}
                                        onClick={() => { setAmount(preset.value); setCustomAmount(""); }}
                                        className={`py-4 rounded-xl border-2 border-dashed transition-all ${amount === preset.value && !customAmount
                                            ? "border-[#FF6B6B] bg-[#FFF0F0]"
                                            : "border-gray-200 hover:border-[#FFD95A] bg-white"
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{preset.emoji}</div>
                                        <div className="font-bold text-[#333]">₩{preset.value.toLocaleString()}</div>
                                        <div className="text-xs text-[#999]">{preset.label}</div>
                                    </button>
                                ))}
                            </div>

                            {/* 커스텀 금액 */}
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]">₩</span>
                                <input
                                    type="text"
                                    value={customAmount}
                                    onChange={(e) => handleCustomAmount(e.target.value)}
                                    placeholder="직접 입력"
                                    className="w-full py-4 pl-10 pr-4 rounded-xl border-2 border-dashed border-gray-200 text-[#333] placeholder-[#999] focus:outline-none focus:border-[#FFD95A] transition-colors"
                                />
                            </div>
                            <p className="text-xs text-[#999] mt-2">최소 1,000원부터</p>

                            {/* 플랫폼 수수료 안내 */}
                            {amount && (
                                <div className="mt-6 p-4 rounded-xl bg-[#F0F9FF] border-2 border-dashed border-[#87CEEB]">
                                    <div className="flex items-start gap-3">
                                        <span className="text-xl">💸</span>
                                        <div>
                                            <span className="font-medium text-[#333]">플랫폼 수수료 안내</span>
                                            <p className="text-sm text-[#666] mt-1">
                                                후원금의 <span className="font-bold text-[#FF6B6B]">5%</span>가 도노트 운영비로 사용됩니다.
                                            </p>
                                            <div className="mt-2 text-sm">
                                                <span className="text-[#999]">크리에이터 수령액:</span>
                                                <span className="ml-2 font-bold text-[#333]">₩{creatorAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={goBack}
                                    className="flex-1 py-4 bg-gray-100 rounded-xl text-[#666] font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    ← 이전
                                </button>
                                <button
                                    onClick={goNext}
                                    disabled={!amount}
                                    className="flex-1 py-4 bg-[#FFD95A] rounded-xl text-[#333] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFCE3A] transition-all shadow-md"
                                >
                                    다음으로 →
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
                            className="bg-white rounded-xl p-6 shadow-md border border-gray-100 relative"
                        >
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-[#E6F3FF]/80 rounded shadow-sm"></div>

                            <h2 className="text-xl font-bold mb-2 text-[#333]">✍️ 보내는 사람</h2>
                            <p className="text-[#666] text-sm mb-6">
                                쪽지에 표시될 이름이에요
                            </p>

                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="익명의 팬"
                                className="w-full py-4 px-4 rounded-xl border-2 border-dashed border-gray-200 text-[#333] placeholder-[#999] focus:outline-none focus:border-[#FFD95A] transition-colors"
                                maxLength={20}
                            />

                            {/* 결제 요약 - 영수증 스타일 */}
                            <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-dashed border-gray-200">
                                <div className="text-center text-sm text-[#999] mb-3">--- 결제 내역 ---</div>
                                <div className="flex justify-between text-[#666] mb-2">
                                    <span>후원금</span>
                                    <span>₩{(amount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[#999] mb-2 text-sm">
                                    <span>플랫폼 수수료 (5%)</span>
                                    <span>-₩{platformFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-green-600 mb-2 text-sm">
                                    <span>크리에이터 수령액</span>
                                    <span>₩{creatorAmount.toLocaleString()}</span>
                                </div>

                                {/* 도노트 팁 체크박스 */}
                                <div className="py-3 border-t border-dashed border-gray-300">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={tipEnabled}
                                            onChange={(e) => setTipEnabled(e.target.checked)}
                                            className="w-5 h-5 rounded border-2 border-[#FF6B6B] text-[#FF6B6B] focus:ring-[#FF6B6B] cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#333] font-medium">🍩 도노트 팁</span>
                                                <span className="text-xs px-2 py-0.5 bg-[#FF6B6B] text-white rounded-full">♥</span>
                                            </div>
                                            <p className="text-xs text-[#999] mt-0.5">
                                                도노트 서비스 개선에 사용됩니다
                                            </p>
                                        </div>
                                        <span className="text-[#FF6B6B] font-bold">+₩{DONOTE_TIP.toLocaleString()}</span>
                                    </label>
                                </div>

                                <div className="pt-3 border-t border-dashed border-gray-300 flex justify-between font-bold text-[#333]">
                                    <span>총 결제금액</span>
                                    <span className="text-[#FF6B6B]">₩{finalAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={goBack}
                                    className="flex-1 py-4 bg-gray-100 rounded-xl text-[#666] font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    ← 이전
                                </button>
                                <button
                                    onClick={handlePayment}
                                    disabled={nickname.length < 1}
                                    className="flex-1 py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FF5252] transition-all shadow-md"
                                >
                                    💌 보내기
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: 결제 중 - 종이비행기 애니메이션 */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white rounded-xl p-12 shadow-md text-center"
                        >
                            <motion.div
                                className="text-6xl mb-6"
                                animate={{
                                    x: [0, 10, 0],
                                    y: [0, -10, 0],
                                    rotate: [0, 5, 0]
                                }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                ✈️
                            </motion.div>
                            <h2 className="text-xl font-bold mb-2 text-[#333]">쪽지를 보내는 중...</h2>
                            <p className="text-[#666]">잠시만 기다려주세요</p>
                        </motion.div>
                    )}

                    {/* Step 5: 완료 - 우체부 비둘기 컨셉 */}
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
                                🕊️
                            </motion.div>

                            <h2 className="text-2xl font-bold mb-2 text-[#333]">마음이 배달되었습니다!</h2>
                            <p className="text-[#666] mb-8">
                                {demoCreator.displayName}님에게 쪽지를 전달했어요
                            </p>

                            {/* 크리에이터 리액션 메시지 */}
                            <motion.div
                                className="bg-[#FFFACD] rounded-xl p-6 text-left mb-8 shadow-md relative"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                style={{ transform: "rotate(-1deg)" }}
                            >
                                {/* 핀 */}
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-400 shadow-sm"></div>

                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">
                                        {demoCreator.avatar}
                                    </div>
                                    <span className="font-bold text-[#333]">{demoCreator.displayName}</span>
                                </div>
                                <p className="text-[#333] italic">
                                    &quot;{demoCreator.reactionMessage}&quot;
                                </p>
                            </motion.div>

                            {/* 버튼들 */}
                            <div className="flex gap-4">
                                <Link
                                    href={`/${username}`}
                                    className="flex-1 py-4 bg-gray-100 rounded-xl text-[#666] font-semibold hover:bg-gray-200 transition-colors text-center"
                                >
                                    페이지로 돌아가기
                                </Link>
                                <button className="flex-1 py-4 bg-[#FFD95A] rounded-xl text-[#333] font-semibold hover:bg-[#FFCE3A] transition-all shadow-md">
                                    공유하기 📤
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
