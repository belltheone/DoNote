"use client";
// OBS 오버레이 페이지 - 실시간 후원 알림 + 도넛 애니메이션 + 사운드
// 스트리머가 브라우저 소스로 추가하는 페이지

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { use } from "react";
import { supabase } from "@/lib/supabase";

// 더미 후원 데이터 (Supabase 연동 전 테스트용)
const mockNewDonations = [
    { id: 1, donorName: '익명의 팬', message: '항상 좋은 글 감사합니다!', amount: 5000, sticker: '☕' },
    { id: 2, donorName: '코딩초보', message: '덕분에 리액트 배웠어요 💜', amount: 3000, sticker: '🔥' },
    { id: 3, donorName: '개발자김씨', message: '오픈소스 응원합니다!', amount: 10000, sticker: '💪' },
];

// Web Audio API로 알림 사운드 생성
function playNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

        // 멜로디 노트 (도-미-솔 화음)
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

        frequencies.forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.value = freq;

            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime + i * 0.1);
            oscillator.stop(audioContext.currentTime + 0.5 + i * 0.1);
        });
    } catch (e) {
        console.log('알림음 재생 실패:', e);
    }
}

// 떨어지는 도넛 컴포넌트
function FallingDonut({ delay, startX, size, onComplete }: {
    delay: number;
    startX: number;
    size: number;
    onComplete: () => void;
}) {
    return (
        <motion.div
            className="absolute text-4xl pointer-events-none"
            style={{ left: `${startX}%`, fontSize: `${size}px` }}
            initial={{ y: -100, rotate: 0, opacity: 1 }}
            animate={{
                y: typeof window !== 'undefined' ? window.innerHeight + 100 : 900,
                rotate: 360 + (delay * 30),
                opacity: [1, 1, 0]
            }}
            transition={{
                duration: 2.5,
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
        // 알림 표시 시 사운드 재생
        playNotificationSound();

        const timer = setTimeout(onClose, 6000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ scale: 0, y: 100, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, y: -100, opacity: 0, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative bg-gradient-to-br from-[#FFFACD] to-[#FFF8DC] rounded-2xl p-8 shadow-2xl max-w-lg mx-auto border-4 border-[#FFD95A]"
        >
            {/* 핀 애니메이션 */}
            <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
            >
                <div className="w-8 h-8 bg-red-500 rounded-full shadow-lg border-2 border-red-600" />
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-1 h-4 bg-gray-400" />
            </motion.div>

            {/* 테이프 장식 */}
            <div className="absolute -top-1 left-8 w-20 h-5 bg-white/70 rounded transform -rotate-6 shadow-sm" />
            <div className="absolute -top-1 right-8 w-20 h-5 bg-white/70 rounded transform rotate-6 shadow-sm" />

            {/* 스티커 바운스 */}
            <motion.div
                className="absolute -top-6 -right-6 text-6xl drop-shadow-lg"
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, -15, 0]
                }}
                transition={{ duration: 0.6, repeat: 3 }}
            >
                {donation.sticker}
            </motion.div>

            {/* 컨텐츠 */}
            <div className="text-center pt-4">
                {/* 새 쪽지 알림 */}
                <motion.div
                    className="text-xl font-bold mb-4 text-[#FF6B6B]"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    💌 새 쪽지가 도착했어요!
                </motion.div>

                {/* 금액 - 카운트업 효과 */}
                <motion.div
                    className="text-5xl font-black text-[#FF6B6B] mb-4"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                >
                    ₩{donation.amount.toLocaleString()}
                </motion.div>

                {/* 닉네임 */}
                <motion.div
                    className="text-xl font-bold text-[#333] mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <span className="text-2xl mr-2">👤</span>
                    {donation.donorName}님
                </motion.div>

                {/* 메시지 */}
                <motion.div
                    className="bg-white/80 rounded-xl p-4 text-lg text-[#555] italic shadow-inner border border-[#FFD95A]/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    &quot;{donation.message}&quot;
                </motion.div>
            </div>

            {/* 도노트 로고 */}
            <motion.div
                className="absolute bottom-3 right-5 flex items-center gap-1 text-[#999]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <span className="text-lg">🍩</span>
                <span className="text-sm font-medium">donote</span>
            </motion.div>
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
    const [donuts, setDonuts] = useState<{ id: number, x: number, size: number }[]>([]);
    const [donutKey, setDonutKey] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    // 도넛 생성 함수
    const spawnDonuts = useCallback((amount: number) => {
        const count = Math.min(Math.floor(amount / 1000), 10); // 최대 10개
        const newDonuts = Array.from({ length: count }, (_, i) => ({
            id: i,
            x: 10 + (i * 8) + (i % 3) * 5, // 분산 배치
            size: 25 + (i % 4) * 8
        }));
        setDonuts(newDonuts);
        setDonutKey(prev => prev + 1);
    }, []);

    // Supabase Realtime 연결 (크리에이터 조회 후 필터링)
    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel> | null = null;

        // 크리에이터 정보 조회 후 Realtime 연결
        async function setupRealtime() {
            // handle로 크리에이터 조회
            const { data: creator, error } = await supabase
                .from('creators')
                .select('id')
                .eq('handle', username)
                .single();

            if (error || !creator) {
                console.log('크리에이터를 찾을 수 없습니다:', username);
                return;
            }

            // Realtime 채널 연결
            channel = supabase
                .channel(`obs-${username}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'donations',
                        filter: `creator_id=eq.${creator.id}`
                    },
                    (payload) => {
                        const newDonation = payload.new;
                        setCurrentAlert({
                            id: Date.now(),
                            donorName: newDonation.donor_name || '익명',
                            message: newDonation.message || '',
                            amount: newDonation.amount || 0,
                            sticker: newDonation.sticker || '🍩',
                        });
                        spawnDonuts(newDonation.amount || 0);
                    }
                )
                .subscribe((status) => {
                    setIsConnected(status === 'SUBSCRIBED');
                });
        }

        setupRealtime();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [username, spawnDonuts]);

    // 데모 모드: 10초마다 랜덤 알림 (실제 연결 없을 때)
    useEffect(() => {
        if (isConnected) return;

        const interval = setInterval(() => {
            const randomIndex = Math.floor(Date.now() % mockNewDonations.length);
            const randomDonation = mockNewDonations[randomIndex];
            setCurrentAlert({ ...randomDonation, id: Date.now() });
            spawnDonuts(randomDonation.amount);
        }, 10000);

        // 첫 알림 (3초 후)
        const firstTimeout = setTimeout(() => {
            setCurrentAlert({ ...mockNewDonations[0], id: Date.now() });
            spawnDonuts(mockNewDonations[0].amount);
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(firstTimeout);
        };
    }, [isConnected, spawnDonuts]);

    const handleDonutComplete = (index: number) => {
        setDonuts(prev => prev.filter(d => d.id !== index));
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-transparent">
            {/* 도넛 애니메이션 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {donuts.map((donut, index) => (
                    <FallingDonut
                        key={`${donutKey}-${donut.id}`}
                        delay={index * 0.15}
                        startX={donut.x}
                        size={donut.size}
                        onComplete={() => handleDonutComplete(donut.id)}
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

            {/* 연결 상태 및 설정 안내 (알림 없을 때만) */}
            {!currentAlert && (
                <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white/70 text-sm bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`} />
                    <span>
                        {isConnected ? '실시간 연결됨' : '데모 모드'} • @{username}
                    </span>
                </div>
            )}
        </div>
    );
}
