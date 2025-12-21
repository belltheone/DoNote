"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface NotificationToastProps {
    donor: string;
    amount: number;
    message: string;
    sticker?: string;
    onClose: () => void;
}

export function NotificationToast({
    donor,
    amount,
    message,
    sticker = "💌",
    onClose,
}: NotificationToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // 5초 후 자동 닫기
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // 애니메이션 후 제거
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed top-24 right-6 z-[100] max-w-sm"
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                    }}
                >
                    {/* 토스트 카드 */}
                    <div className="relative bg-white rounded-xl shadow-2xl border-2 border-[#FFD95A] overflow-hidden">
                        {/* 배경 패턴 */}
                        <div className="absolute inset-0 paper-bg opacity-50" />

                        {/* 내용 */}
                        <div className="relative p-4">
                            {/* 헤더 */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{sticker}</div>
                                    <div>
                                        <div className="text-sm font-sans text-[#FF6B6B] font-bold">
                                            새 후원이 도착했어요!
                                        </div>
                                        <div className="text-xs text-[#666] mt-0.5">
                                            {donor}님이 보냈습니다
                                        </div>
                                    </div>
                                </div>

                                {/* 닫기 버튼 */}
                                <button
                                    onClick={() => {
                                        setIsVisible(false);
                                        setTimeout(onClose, 300);
                                    }}
                                    className="text-[#999] hover:text-[#333] transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* 금액 */}
                            <div className="mb-2 px-3 py-2 bg-[#FFFACD] rounded-lg inline-block">
                                <div className="text-2xl font-sans font-bold text-[#D9A000]">
                                    ₩{amount.toLocaleString()}
                                </div>
                            </div>

                            {/* 메시지 */}
                            {message && (
                                <div className="mt-3 p-3 bg-white/50 rounded border border-gray-200">
                                    <p className="text-sm text-[#333] leading-relaxed line-clamp-2">
                                        &quot;{message}&quot;
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 하단 테이프 장식 */}
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FFD95A] via-[#FF6B6B] to-[#FFD95A] opacity-60" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
