"use client";
// OBS 오버레이 페이지 - 실시간 후원 알림 + 도넛 애니메이션
// 스트리머가 브라우저 소스로 추가하는 페이지

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { use } from "react";

// 더미 후원 데이터
const mockNewDonations = [
    { id: 1, donorName: '익명의 팬', message: '항상 좋은 글 감사합니다!', amount: 5000, sticker: '☕' },
    { id: 2, donorName: '코딩초보', message: '덕분에 리액트 배웠어요 💜', amount: 3000, sticker: '🔥' },
    { id: 3, donorName: '개발자김씨', message: '오픈소스 응원합니다!', amount: 10000, sticker: '💪' },
];

// 떨어지는 도넛 컴포넌트
function FallingDonut({ delay, onComplete }: { delay: number; onComplete: () => void }) {
    const startX = Math.random() * 100; // 0-100%
    const size = 20 + Math.random() * 30; // 20-50px
    const rotation = Math.random() * 360;

    return (
        <motion.div
            className="absolute text-4xl"
            style={{ left: `${startX}%`, fontSize: `${size}px` }}
            initial={{ y: -100, rotate: 0, opacity: 1 }}
            animate={{
                y: window?.innerHeight || 800,
                rotate: rotation + 360,
                opacity: [1, 1, 0]
            }}
            transition={{
                duration: 2 + Math.random(),
                delay,
                ease: "easeIn"
            }}
            onAnimationComplete={onComplete}
        >
            🍩
        </motion.div>
    );
}

// 알림 카드 컴포넌트
function AlertCard({ donation, onClose }: { donation: typeof mockNewDonations[0]; onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -50, opacity: 0 }}
            className="relative bg-[#FFFACD] rounded-xl p-6 shadow-2xl max-w-md mx-auto"
            style={{ transform: 'rotate(-1deg)' }}
        >
            {/* 핀 */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full shadow-md" />

            {/* 테이프 장식 */}
            <div className="absolute -top-2 left-6 w-16 h-4 bg-white/60 rounded transform -rotate-3" />
            <div className="absolute -top-2 right-6 w-16 h-4 bg-white/60 rounded transform rotate-3" />

            {/* 스티커 */}
            <motion.div
                className="absolute -top-4 -right-4 text-5xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
            >
                {donation.sticker}
            </motion.div>

            {/* 컨텐츠 */}
            <div className="text-center">
                {/* 새 쪽지 알림 */}
                <motion.div
                    className="text-lg mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                >
                    💌 새 쪽지가 도착했어요!
                </motion.div>

                {/* 금액 */}
                <div className="text-3xl font-bold text-[#FF6B6B] mb-3">
                    ₩{donation.amount.toLocaleString()}
                </div>

                {/* 닉네임 */}
                <div className="text-lg font-medium text-[#333] mb-2">
                    {donation.donorName}님
                </div>

                {/* 메시지 */}
                <div className="text-[#666] italic bg-white/50 rounded-lg p-3">
                    &quot;{donation.message}&quot;
                </div>
            </div>

            {/* 도노트 로고 */}
            <div className="absolute bottom-2 right-4 text-xs text-[#999] flex items-center gap-1">
                <span>🍩</span>
                <span>donote</span>
            </div>
        </motion.div>
    );
}

export default function OBSOverlayPage({
    params
}: {
    params: Promise<{ username: string }>
}) {
    const { username } = use(params);

    const [currentAlert, setCurrentAlert] = useState<typeof mockNewDonations[0] | null>(null);
    const [donuts, setDonuts] = useState<number[]>([]);
    const [donutKey, setDonutKey] = useState(0);

    // 데모: 5초마다 랜덤 알림
    useEffect(() => {
        const interval = setInterval(() => {
            const randomDonation = mockNewDonations[Math.floor(Math.random() * mockNewDonations.length)];
            setCurrentAlert({ ...randomDonation, id: Date.now() });

            // 도넛 떨어뜨리기
            const donutCount = Math.floor(randomDonation.amount / 1000);
            setDonuts(Array.from({ length: donutCount }, (_, i) => i));
            setDonutKey(prev => prev + 1);
        }, 8000);

        // 첫 알림
        setTimeout(() => {
            const randomDonation = mockNewDonations[0];
            setCurrentAlert({ ...randomDonation, id: Date.now() });
            setDonuts(Array.from({ length: 5 }, (_, i) => i));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleDonutComplete = (index: number) => {
        setDonuts(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-transparent">
            {/* 도넛 애니메이션 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {donuts.map((_, index) => (
                    <FallingDonut
                        key={`${donutKey}-${index}`}
                        delay={index * 0.1}
                        onComplete={() => handleDonutComplete(index)}
                    />
                ))}
            </div>

            {/* 알림 카드 */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    {currentAlert && (
                        <AlertCard
                            key={currentAlert.id}
                            donation={currentAlert}
                            onClose={() => setCurrentAlert(null)}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* 설정 안내 (개발 모드에서만) */}
            {!currentAlert && (
                <div className="absolute bottom-4 left-4 text-white/50 text-sm bg-black/30 px-4 py-2 rounded-lg">
                    OBS 브라우저 소스로 추가하세요 • {username}
                </div>
            )}
        </div>
    );
}
