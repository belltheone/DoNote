"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function EnvelopeHero() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsOpen(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative w-[300px] h-[200px] md:w-[400px] md:h-[260px] mx-auto perspective-1000">
            <motion.div
                className="w-full h-full relative preserve-3d"
                initial={{ rotateX: 20, y: 100, opacity: 0 }}
                animate={{ rotateX: 10, y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* 봉투 몸통 (Back) */}
                <div className="absolute inset-0 bg-[#E8D5B7] rounded-lg shadow-xl" />

                {/* 편지지 (Letter) - 봉투 안에서 나옴 */}
                <motion.div
                    className="absolute left-4 right-4 bg-white rounded-lg shadow-inner z-10 flex flex-col items-center justify-center p-6 text-center border border-gray-100"
                    style={{ height: '90%', bottom: '10px' }}
                    initial={{ y: 0 }}
                    animate={{ y: isOpen ? -100 : 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "backOut" }}
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-4xl mb-2"
                    >
                        💌
                    </motion.div>
                    <p className="font-sans text-xl text-[#333] leading-relaxed">
                        마음을 담은<br />쪽지가 도착했어요
                    </p>
                </motion.div>

                {/* 봉투 앞면 (Front - 아래쪽 삼각형) */}
                <div
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to top, #FFF8E7 40%, transparent 40%)',
                        clipPath: 'polygon(0 100%, 50% 60%, 100% 100%)',
                        filter: 'drop-shadow(0 -2px 4px rgba(0,0,0,0.05))'
                    }}
                />

                {/* 봉투 앞면 (Front - 좌우 삼각형) */}
                <div
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to right, #F5DEB3 50%, #E8D5B7 50%)',
                        clipPath: 'polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 50%)',
                    }}
                />

                {/* 봉투 뚜껑 (Flap) */}
                <motion.div
                    className="absolute top-0 left-0 right-0 h-[50%] bg-[#E0C090] z-30 origin-top shadow-md"
                    style={{
                        clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                        borderRadius: '4px 4px 0 0'
                    }}
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: isOpen ? 180 : 0, zIndex: isOpen ? 1 : 30 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                />

                {/* 아이콘 파티클 효과 */}
                {isOpen && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-full h-full pointer-events-none z-0">
                        {['🍩', '✨', '💜', '☕', '🖊️'].map((emoji, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-2xl"
                                initial={{ opacity: 0, x: 0, y: 50, scale: 0 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    x: (i - 2) * 40 + (Math.random() * 20 - 10),
                                    y: -100 - Math.random() * 50,
                                    scale: [0.5, 1.2, 0.8],
                                    rotate: Math.random() * 360
                                }}
                                transition={{
                                    duration: 2,
                                    delay: 1.2 + i * 0.1,
                                    repeat: Infinity,
                                    repeatDelay: 1
                                }}
                                style={{
                                    left: '50%',
                                    top: '50%'
                                }}
                            >
                                {emoji}
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
