// 다크 모드 토글 버튼
"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // hydration 오류 방지
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9" />;
    }

    return (
        <motion.button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="테마 변경"
        >
            <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg"
            >
                {theme === "dark" ? "🌙" : "☀️"}
            </motion.span>
        </motion.button>
    );
}
