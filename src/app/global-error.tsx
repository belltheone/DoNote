"use client";
// 전역 에러 페이지
// 예기치 않은 에러 발생 시 표시

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // 에러 로깅 (실제 서비스에서는 Sentry 등 사용)
        console.error("Global Error:", error);
    }, [error]);

    return (
        <html lang="ko">
            <body className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-6">
                <div className="text-center max-w-md">
                    {/* 이모지 아이콘 */}
                    <div className="text-8xl mb-6">🔧</div>

                    {/* 에러 코드 */}
                    <h1 className="text-6xl font-bold text-[#FF6B6B] mb-4">오류</h1>

                    {/* 메시지 */}
                    <h2 className="text-2xl font-bold text-[#333] mb-4">
                        문제가 발생했어요
                    </h2>
                    <p className="text-[#666] mb-8">
                        잠시 후 다시 시도해주세요. 문제가 계속되면 고객센터로 문의해주세요.
                    </p>

                    {/* 버튼들 */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => reset()}
                            className="px-6 py-3 bg-[#FF6B6B] text-white font-semibold rounded-xl hover:bg-[#e55555] transition-colors"
                        >
                            다시 시도하기
                        </button>
                        <a
                            href="/"
                            className="px-6 py-3 bg-white text-[#333] font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            홈으로 돌아가기
                        </a>
                    </div>

                    {/* 에러 정보 (개발용) */}
                    {process.env.NODE_ENV === "development" && error.digest && (
                        <p className="mt-8 text-xs text-gray-400">
                            오류 ID: {error.digest}
                        </p>
                    )}
                </div>
            </body>
        </html>
    );
}
