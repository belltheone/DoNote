"use client";
// 에러 바운더리 컴포넌트
// 에러 발생 시 사용자 친화적 UI 표시

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // 에러 로깅 (Sentry 등)
        console.error("페이지 에러:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex flex-col items-center justify-center p-6">
            <motion.div
                className="text-center max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* 에러 이모지 */}
                <motion.div
                    className="text-8xl mb-6"
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    🍩
                </motion.div>

                <h1 className="text-2xl font-bold text-[#333] dark:text-white mb-4">
                    앗! 문제가 발생했어요
                </h1>

                <p className="text-[#666] dark:text-gray-400 mb-8">
                    페이지를 로드하는 중 오류가 발생했습니다.
                    <br />
                    잠시 후 다시 시도해주세요.
                </p>

                {/* 액션 버튼 */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-[#FF6B6B] text-white rounded-xl font-semibold hover:bg-[#FF5252] transition-colors shadow-md"
                    >
                        🔄 다시 시도
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-white dark:bg-gray-800 text-[#333] dark:text-white rounded-xl font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        🏠 홈으로
                    </Link>
                </div>

                {/* 에러 코드 (개발자용) */}
                {process.env.NODE_ENV === "development" && (
                    <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-left">
                        <p className="text-xs text-red-600 dark:text-red-400 font-mono break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-red-400 mt-2">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
