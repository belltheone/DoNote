"use client";
// 전역 에러 처리 컴포넌트
// React Error Boundary를 사용하여 에러를 잡고 사용자 친화적인 UI 표시

import React, { Component, ErrorInfo, ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// 에러 바운더리 Props 타입
interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

// 에러 바운더리 State 타입
interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

// 에러 바운더리 클래스 컴포넌트
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    // 에러 발생 시 상태 업데이트
    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    // 에러 정보 로깅
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({ errorInfo });

        // 여기에 에러 리포팅 서비스 (예: Sentry) 연동 가능
        // if (typeof window !== 'undefined' && window.Sentry) {
        //     window.Sentry.captureException(error);
        // }
    }

    // 에러 초기화 (재시도)
    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // 커스텀 폴백이 제공된 경우
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // 기본 에러 UI
            return (
                <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex items-center justify-center px-4">
                    <motion.div
                        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {/* 에러 아이콘 */}
                        <motion.div
                            className="text-6xl mb-6"
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            😵
                        </motion.div>

                        <h1 className="text-2xl font-bold text-[#333] dark:text-white mb-4">
                            앗, 문제가 발생했어요!
                        </h1>
                        <p className="text-[#666] dark:text-gray-400 mb-6">
                            예상치 못한 오류가 발생했습니다.<br />
                            잠시 후 다시 시도해주세요.
                        </p>

                        {/* 에러 상세 (개발 환경에서만) */}
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm text-[#999] dark:text-gray-500 hover:text-[#666] dark:hover:text-gray-400">
                                    에러 상세 보기
                                </summary>
                                <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-red-500 overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="space-y-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full py-3 bg-[#FF6B6B] rounded-xl text-white font-medium hover:bg-[#FF5252] transition-colors"
                            >
                                다시 시도하기
                            </button>
                            <Link
                                href="/"
                                className="block w-full py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-[#666] dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                홈으로 돌아가기
                            </Link>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
