"use client";
// 다크모드 토글 컴포넌트
// 수동 모드 전환 지원

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    // 초기 상태 로드 - requestAnimationFrame으로 매크로태스크 해결
    useEffect(() => {
        const init = () => {
            setMounted(true);
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                setIsDark(true);
                document.documentElement.classList.add('dark');
            } else {
                setIsDark(false);
                document.documentElement.classList.remove('dark');
            }
        };
        requestAnimationFrame(init);
    }, []);

    // 테마 변경
    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // 마운트 전에는 렌더링하지 않음 (hydration 이슈 방지)
    if (!mounted) {
        return (
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 w-10 h-10" aria-label="테마 변경">
                <span className="opacity-0">🌙</span>
            </button>
        );
    }

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
            <motion.span
                key={isDark ? 'dark' : 'light'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xl block"
            >
                {isDark ? '☀️' : '🌙'}
            </motion.span>
        </motion.button>
    );
}

// 간단한 텍스트 버전
export function DarkModeToggleText() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const init = () => {
            setMounted(true);
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(savedTheme === 'dark' || (!savedTheme && prefersDark));
        };
        requestAnimationFrame(init);
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    if (!mounted) return null;

    return (
        <button
            onClick={toggleTheme}
            className="text-sm text-[#666] hover:text-[#333] dark:text-gray-400 dark:hover:text-white transition-colors"
        >
            {isDark ? '☀️ 라이트 모드' : '🌙 다크 모드'}
        </button>
    );
}
