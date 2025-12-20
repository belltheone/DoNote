"use client";
// 위젯 생성 페이지 - 커스터마이징 및 임베드 코드 생성
// QR 코드, 다크모드 지원

import { motion } from "framer-motion";
import { useState } from "react";
import { QRCodeGenerator } from "@/components/dashboard/QRCodeGenerator";

// 위젯 스타일 옵션
const widgetStyles = [
    { id: 'ticket', name: '티켓형', emoji: '🎫' },
    { id: 'button', name: '버튼형', emoji: '📮' },
    { id: 'mini', name: '미니', emoji: '💌' },
];

// 색상 옵션
const colorOptions = [
    { id: 'yellow', name: '크림 옐로우', bg: '#FFD95A', text: '#333' },
    { id: 'coral', name: '코랄 핑크', bg: '#FF6B6B', text: '#fff' },
    { id: 'white', name: '화이트', bg: '#fff', text: '#333' },
    { id: 'dark', name: '다크', bg: '#333', text: '#fff' },
];

// 문구 옵션
const textOptions = [
    '커피 한 잔 ☕',
    '도노트 보내기 🍩',
    '응원하기 💌',
    '후원하기 💝',
    'Buy me a coffee',
];

export default function WidgetPage() {
    const [style, setStyle] = useState('ticket');
    const [color, setColor] = useState('yellow');
    const [text, setText] = useState('커피 한 잔 ☕');
    const [customText, setCustomText] = useState('');
    const [copied, setCopied] = useState(false);

    const handle = 'devminsu'; // 실제로는 로그인한 사용자의 handle
    const displayText = customText || text;
    const selectedColor = colorOptions.find(c => c.id === color) || colorOptions[0];

    // 임베드 코드 생성
    const generateEmbedCode = (type: 'html' | 'markdown') => {
        const url = `https://donote.kr/${handle}`;
        const imgUrl = `https://donote.kr/widget/${handle}?style=${style}&color=${color}&text=${encodeURIComponent(displayText)}`;

        if (type === 'markdown') {
            return `[![${displayText}](${imgUrl})](${url})`;
        }
        return `<a href="${url}" target="_blank"><img src="${imgUrl}" alt="${displayText}" /></a>`;
    };

    // 클립보드 복사
    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* 설정 패널 */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {/* 스타일 선택 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                            <span>🎨</span> 위젯 스타일
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {widgetStyles.map((ws) => (
                                <button
                                    key={ws.id}
                                    onClick={() => setStyle(ws.id)}
                                    className={`p-4 rounded-xl border-2 transition-all text-center ${style === ws.id
                                        ? 'border-[#FF6B6B] bg-[#FFFACD]'
                                        : 'border-gray-200 hover:border-[#FFD95A]'
                                        }`}
                                >
                                    <span className="text-2xl block mb-1">{ws.emoji}</span>
                                    <span className="text-sm text-[#333] dark:text-white">{ws.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 색상 선택 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                            <span>🎨</span> 색상
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                            {colorOptions.map((co) => (
                                <button
                                    key={co.id}
                                    onClick={() => setColor(co.id)}
                                    className={`p-3 rounded-xl border-2 transition-all ${color === co.id
                                        ? 'border-[#FF6B6B] ring-2 ring-[#FF6B6B]/30'
                                        : 'border-gray-200'
                                        }`}
                                >
                                    <div
                                        className="w-full h-8 rounded-lg mb-2"
                                        style={{ backgroundColor: co.bg }}
                                    />
                                    <span className="text-xs text-[#666]">{co.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 문구 선택 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                            <span>✍️</span> 문구
                        </h3>

                        {/* 프리셋 */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {textOptions.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => { setText(t); setCustomText(''); }}
                                    className={`px-3 py-2 rounded-lg text-sm transition-all ${text === t && !customText
                                        ? 'bg-[#FFD95A] text-[#333]'
                                        : 'bg-gray-100 text-[#666] hover:bg-gray-200'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* 커스텀 입력 */}
                        <input
                            type="text"
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            placeholder="직접 입력하기..."
                            className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                            maxLength={30}
                        />
                    </div>
                </motion.div>

                {/* 미리보기 & 코드 */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {/* 미리보기 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                            <span>👁️</span> 미리보기
                        </h3>

                        <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center min-h-[200px]">
                            {/* 위젯 미리보기 */}
                            {style === 'ticket' && (
                                <div
                                    className="relative px-8 py-4 rounded-lg border-2 border-dashed shadow-md"
                                    style={{ backgroundColor: selectedColor.bg, color: selectedColor.text, borderColor: selectedColor.text === '#fff' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)' }}
                                >
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-gray-50 rounded-full"></div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🍩</span>
                                        <div className="text-left">
                                            <div className="text-xs opacity-70">To. {handle}</div>
                                            <div className="font-bold">{displayText}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {style === 'button' && (
                                <div
                                    className="px-6 py-3 rounded-full font-bold shadow-md flex items-center gap-2"
                                    style={{ backgroundColor: selectedColor.bg, color: selectedColor.text }}
                                >
                                    <span>🍩</span>
                                    <span>{displayText}</span>
                                </div>
                            )}

                            {style === 'mini' && (
                                <div
                                    className="px-4 py-2 rounded-lg text-sm font-medium shadow-md flex items-center gap-2"
                                    style={{ backgroundColor: selectedColor.bg, color: selectedColor.text }}
                                >
                                    <span>💌</span>
                                    <span>{displayText}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 임베드 코드 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                            <span>📋</span> 임베드 코드
                        </h3>

                        {/* HTML */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[#666]">HTML</span>
                                <button
                                    onClick={() => copyToClipboard(generateEmbedCode('html'))}
                                    className="text-sm text-[#FF6B6B] hover:underline"
                                >
                                    {copied ? '✓ 복사됨!' : '복사하기'}
                                </button>
                            </div>
                            <div className="p-3 bg-gray-900 rounded-lg overflow-x-auto">
                                <code className="text-sm text-green-400 whitespace-nowrap">
                                    {generateEmbedCode('html')}
                                </code>
                            </div>
                        </div>

                        {/* Markdown */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[#666]">Markdown (GitHub, 블로그)</span>
                                <button
                                    onClick={() => copyToClipboard(generateEmbedCode('markdown'))}
                                    className="text-sm text-[#FF6B6B] hover:underline"
                                >
                                    복사하기
                                </button>
                            </div>
                            <div className="p-3 bg-gray-900 rounded-lg overflow-x-auto">
                                <code className="text-sm text-green-400 whitespace-nowrap">
                                    {generateEmbedCode('markdown')}
                                </code>
                            </div>
                        </div>
                    </div>

                    {/* QR 코드 */}
                    <QRCodeGenerator
                        url={`https://donote.site/donate/${handle}`}
                        title="후원 QR 코드"
                    />

                    {/* 사용 방법 가이드 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                            <span>📖</span> 사용 방법
                        </h3>
                        <ol className="space-y-3 text-sm text-[#666] dark:text-gray-400">
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-[#FFD95A] rounded-full flex items-center justify-center text-[#333] font-bold text-xs">1</span>
                                <span>위젯 스타일과 색상을 선택하세요</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-[#FFD95A] rounded-full flex items-center justify-center text-[#333] font-bold text-xs">2</span>
                                <span>원하는 문구를 선택하거나 직접 입력하세요</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-[#FFD95A] rounded-full flex items-center justify-center text-[#333] font-bold text-xs">3</span>
                                <span>HTML 또는 Markdown 코드를 복사하세요</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-[#FFD95A] rounded-full flex items-center justify-center text-[#333] font-bold text-xs">4</span>
                                <span>GitHub README, 블로그, 포트폴리오에 붙여넣기!</span>
                            </li>
                        </ol>
                    </div>

                    {/* 안내 */}
                    <div className="p-4 bg-[#FFFACD] dark:bg-yellow-900/20 rounded-xl border-2 border-dashed border-[#FFD95A]">
                        <p className="text-sm text-[#333] dark:text-gray-300">
                            💡 <strong>팁:</strong> GitHub README, Velog, 티스토리 등 어디에든 붙여넣기만 하면 됩니다!
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
