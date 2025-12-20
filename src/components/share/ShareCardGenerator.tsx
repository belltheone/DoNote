"use client";
// 공유 카드 생성기
// SNS용 후원 감사 카드 자동 생성

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

// 카드 테마
type CardTheme = "coral" | "yellow" | "mint" | "purple" | "dark";

interface ShareCardProps {
    donorName: string;
    amount: number;
    message?: string;
    creatorName: string;
    theme?: CardTheme;
}

// 테마별 스타일
const themes: Record<CardTheme, { bg: string; text: string; accent: string }> = {
    coral: {
        bg: "linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)",
        text: "#FFFFFF",
        accent: "#FFD95A",
    },
    yellow: {
        bg: "linear-gradient(135deg, #FFD95A 0%, #FFE88C 100%)",
        text: "#333333",
        accent: "#FF6B6B",
    },
    mint: {
        bg: "linear-gradient(135deg, #4ECCA3 0%, #7DE0BE 100%)",
        text: "#FFFFFF",
        accent: "#FFD95A",
    },
    purple: {
        bg: "linear-gradient(135deg, #A855F7 0%, #C084FC 100%)",
        text: "#FFFFFF",
        accent: "#FFD95A",
    },
    dark: {
        bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        text: "#FFFFFF",
        accent: "#FFD95A",
    },
};

export function ShareCardGenerator({
    donorName,
    amount,
    message,
    creatorName,
    theme = "coral",
}: ShareCardProps) {
    const [selectedTheme, setSelectedTheme] = useState<CardTheme>(theme);
    const [isGenerating, setIsGenerating] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // 카드 이미지 생성 및 다운로드
    const generateCard = async () => {
        if (!cardRef.current) return;

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                backgroundColor: null,
                useCORS: true,
            });

            const link = document.createElement("a");
            link.download = `donote_thanks_${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (error) {
            console.error("카드 생성 오류:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const currentTheme = themes[selectedTheme];

    return (
        <div className="space-y-6">
            {/* 테마 선택 */}
            <div className="flex gap-2 justify-center">
                {(Object.keys(themes) as CardTheme[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => setSelectedTheme(t)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedTheme === t
                                ? "border-[#333] scale-110"
                                : "border-transparent"
                            }`}
                        style={{ background: themes[t].bg }}
                    />
                ))}
            </div>

            {/* 카드 미리보기 */}
            <div
                ref={cardRef}
                className="w-[400px] h-[500px] mx-auto rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
                style={{
                    background: currentTheme.bg,
                    color: currentTheme.text,
                }}
            >
                {/* 배경 장식 */}
                <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
                    style={{ background: currentTheme.accent }}
                />
                <div
                    className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-20"
                    style={{ background: currentTheme.accent }}
                />

                {/* 로고 */}
                <div className="text-4xl mb-4">💌</div>

                {/* 제목 */}
                <h2 className="text-2xl font-bold mb-6">감사합니다!</h2>

                {/* 후원 정보 */}
                <div
                    className="px-6 py-4 rounded-xl mb-4"
                    style={{ background: `${currentTheme.accent}30` }}
                >
                    <p className="text-lg font-medium mb-1">{donorName}님의 후원</p>
                    <p
                        className="text-3xl font-bold"
                        style={{ color: currentTheme.accent }}
                    >
                        ₩{amount.toLocaleString()}
                    </p>
                </div>

                {/* 메시지 */}
                {message && (
                    <p className="text-sm opacity-80 italic mb-6 px-4 line-clamp-3">
                        &ldquo;{message}&rdquo;
                    </p>
                )}

                {/* 크리에이터 */}
                <p className="text-sm opacity-60">
                    {creatorName}님에게 전달될 마음입니다
                </p>

                {/* 워터마크 */}
                <div className="absolute bottom-4 right-4 text-xs opacity-40">
                    donote.site
                </div>
            </div>

            {/* 다운로드 버튼 */}
            <motion.button
                onClick={generateCard}
                disabled={isGenerating}
                className="w-full py-4 bg-[#FFD95A] text-[#333] font-bold rounded-xl hover:bg-[#FFC940] transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {isGenerating ? "생성 중..." : "📥 이미지로 저장하기"}
            </motion.button>
        </div>
    );
}
