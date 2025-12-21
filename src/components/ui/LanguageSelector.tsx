"use client";
// 언어 선택 컴포넌트
// 다국어 지원 UI

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Locale, locales, localeNames, localeFlags, getSavedLocale, saveLocale } from "@/lib/i18n";

interface LanguageSelectorProps {
    className?: string;
    showFlags?: boolean;
    compact?: boolean;
}

export function LanguageSelector({
    className = "",
    showFlags = true,
    compact = false
}: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLocale, setCurrentLocale] = useState<Locale>('ko');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const init = () => {
            setMounted(true);
            setCurrentLocale(getSavedLocale());
        };
        requestAnimationFrame(init);
    }, []);

    const handleSelect = (locale: Locale) => {
        setCurrentLocale(locale);
        saveLocale(locale);
        setIsOpen(false);
        // 페이지 새로고침하여 언어 적용
        window.location.reload();
    };

    if (!mounted) {
        return (
            <div className={`w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`} />
        );
    }

    return (
        <div className={`relative ${className}`}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${compact ? 'text-sm' : ''
                    }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {showFlags && (
                    <span className="text-lg">{localeFlags[currentLocale]}</span>
                )}
                {!compact && (
                    <span className="text-[#333] dark:text-white font-medium">
                        {localeNames[currentLocale]}
                    </span>
                )}
                <span className="text-[#666] dark:text-gray-400">▼</span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* 배경 클릭 닫기 */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* 드롭다운 */}
                        <motion.div
                            className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {locales.map((locale) => (
                                <button
                                    key={locale}
                                    onClick={() => handleSelect(locale)}
                                    className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${currentLocale === locale
                                        ? 'bg-[#FFFACD] dark:bg-yellow-900/20'
                                        : ''
                                        }`}
                                >
                                    <span className="text-lg">{localeFlags[locale]}</span>
                                    <span className="text-[#333] dark:text-white">
                                        {localeNames[locale]}
                                    </span>
                                    {currentLocale === locale && (
                                        <span className="ml-auto text-[#FF6B6B]">✓</span>
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// 간단한 인라인 버전
export function LanguageSelectorInline({ className = "" }: { className?: string }) {
    const [currentLocale, setCurrentLocale] = useState<Locale>('ko');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const init = () => {
            setMounted(true);
            setCurrentLocale(getSavedLocale());
        };
        requestAnimationFrame(init);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const locale = e.target.value as Locale;
        setCurrentLocale(locale);
        saveLocale(locale);
        window.location.reload();
    };

    if (!mounted) return null;

    return (
        <select
            value={currentLocale}
            onChange={handleChange}
            className={`px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#333] dark:text-white ${className}`}
        >
            {locales.map((locale) => (
                <option key={locale} value={locale}>
                    {localeFlags[locale]} {localeNames[locale]}
                </option>
            ))}
        </select>
    );
}
