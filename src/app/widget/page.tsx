"use client";
// 위젯 미리보기 및 데모 페이지
// 외부 사이트에서 위젯이 어떻게 보이는지 확인

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function WidgetDemoPage() {
    const [widgetLoaded, setWidgetLoaded] = useState(false);
    const _widgetRefs = useRef<(HTMLDivElement | null)[]>([]);

    // SDK 로드 및 위젯 생성
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/widget/sdk.js';
        script.async = true;
        script.onload = () => {
            setWidgetLoaded(true);
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // 위젯 로드 후 동적으로 추가
    useEffect(() => {
        if (widgetLoaded && typeof window !== 'undefined' && (window as unknown as { Donote?: { create: (el: HTMLElement, opts: Record<string, string>) => void } }).Donote) {
            const Donote = (window as unknown as { Donote: { create: (el: HTMLElement, opts: Record<string, string>) => void } }).Donote;

            // 각 컨테이너에 위젯 생성
            const widgetConfigs = [
                { id: 'ticket-1', handle: 'devminsu', style: 'ticket', theme: 'yellow', text: '커피 한 잔 ☕' },
                { id: 'ticket-2', handle: 'devminsu', style: 'ticket', theme: 'coral', text: '도노트 보내기 🍩' },
                { id: 'button-1', handle: 'devminsu', style: 'button', theme: 'yellow', text: '커피 한 잔 ☕' },
                { id: 'button-2', handle: 'devminsu', style: 'button', theme: 'coral', text: '응원하기 💌' },
                { id: 'button-3', handle: 'devminsu', style: 'button', theme: 'dark', text: '후원하기 💝' },
                { id: 'mini-1', handle: 'devminsu', style: 'mini', theme: 'yellow', text: '☕' },
                { id: 'mini-2', handle: 'devminsu', style: 'mini', theme: 'coral', text: '🍩' },
                { id: 'mini-3', handle: 'devminsu', style: 'mini', theme: 'white', text: '💌' },
                { id: 'mini-4', handle: 'devminsu', style: 'mini', theme: 'dark', text: '💝' },
                { id: 'blog-1', handle: 'devminsu', style: 'button', theme: 'yellow', text: '커피 한 잔 ☕' },
            ];

            widgetConfigs.forEach(config => {
                const container = document.getElementById(config.id);
                if (container && container.children.length === 0) {
                    Donote.create(container, config);
                }
            });
        }
    }, [widgetLoaded]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-1 py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* 헤더 */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold text-[#333] dark:text-white mb-4">
                            🎫 위젯 미리보기
                        </h1>
                        <p className="text-lg text-[#666] dark:text-gray-400">
                            실제 블로그나 GitHub에서 위젯이 어떻게 보이는지 확인해보세요
                        </p>
                    </motion.div>

                    {/* 위젯 데모 그리드 */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* 티켓 스타일 */}
                        <motion.div
                            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4">티켓 스타일</h3>
                            <div className="space-y-4 flex flex-col items-center">
                                {widgetLoaded ? (
                                    <>
                                        <div id="ticket-1"></div>
                                        <div id="ticket-2"></div>
                                    </>
                                ) : (
                                    <div className="text-[#999] dark:text-gray-500">위젯 로딩 중...</div>
                                )}
                            </div>
                        </motion.div>

                        {/* 버튼 스타일 */}
                        <motion.div
                            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4">버튼 스타일</h3>
                            <div className="space-y-4 flex flex-col items-center">
                                {widgetLoaded ? (
                                    <>
                                        <div id="button-1"></div>
                                        <div id="button-2"></div>
                                        <div id="button-3"></div>
                                    </>
                                ) : (
                                    <div className="text-[#999] dark:text-gray-500">위젯 로딩 중...</div>
                                )}
                            </div>
                        </motion.div>

                        {/* 미니 스타일 */}
                        <motion.div
                            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4">미니 스타일</h3>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {widgetLoaded ? (
                                    <>
                                        <div id="mini-1"></div>
                                        <div id="mini-2"></div>
                                        <div id="mini-3"></div>
                                        <div id="mini-4"></div>
                                    </>
                                ) : (
                                    <div className="text-[#999] dark:text-gray-500">위젯 로딩 중...</div>
                                )}
                            </div>
                        </motion.div>

                        {/* 블로그 시뮬레이션 */}
                        <motion.div
                            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4">블로그에서 보이는 모습</h3>
                            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm border dark:border-gray-600">
                                <h4 className="text-xl font-bold mb-2 dark:text-white">오늘의 개발 일지</h4>
                                <p className="text-sm text-[#666] dark:text-gray-400 mb-4">
                                    오늘은 React Query를 사용한 서버 상태 관리에 대해 알아보았습니다.
                                    캐싱 전략과 Optimistic Updates 패턴이 인상적이었네요...
                                </p>
                                <div className="border-t dark:border-gray-600 pt-4 mt-4 flex items-center justify-between">
                                    <span className="text-sm text-[#999] dark:text-gray-500">이 글이 도움이 되셨다면...</span>
                                    {widgetLoaded && <div id="blog-1"></div>}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* 사용 방법 */}
                    <motion.div
                        className="bg-[#FFFACD] dark:bg-yellow-900/30 rounded-xl p-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4">💡 사용 방법</h3>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-[#333] dark:text-white mb-2">1. SDK 스크립트 추가</h4>
                                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                                    {`<script src="https://donote.site/widget/sdk.js"></script>`}
                                </pre>
                            </div>

                            <div>
                                <h4 className="font-medium text-[#333] dark:text-white mb-2">2. 위젯 컴포넌트 삽입</h4>
                                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                                    {`<donote-widget 
  handle="your-handle" 
  style-type="ticket" 
  theme="yellow"
  text="커피 한 잔 ☕">
</donote-widget>`}
                                </pre>
                            </div>

                            <div>
                                <h4 className="font-medium text-[#333] dark:text-white mb-2">3. 또는 JavaScript API 사용</h4>
                                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                                    {`Donote.create('#container', {
  handle: 'your-handle',
  style: 'button',
  theme: 'coral',
  text: '응원하기 💌'
});`}
                                </pre>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
