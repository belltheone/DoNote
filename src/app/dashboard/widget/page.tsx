"use client";
// 위젯 생성 페이지 - 커스터마이징 및 임베드 코드 생성
// QR 코드, 다크모드 지원, 상세 가이드 포함

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { QRCodeGenerator } from "@/components/dashboard/QRCodeGenerator";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/lib/supabase";

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
    const { user } = useAuthStore();
    const [style, setStyle] = useState('ticket');
    const [color, setColor] = useState('yellow');
    const [text, setText] = useState('커피 한 잔 ☕');
    const [customText, setCustomText] = useState('');
    const [copied, setCopied] = useState(false);
    const [copiedType, setCopiedType] = useState<string | null>(null);
    const [handle, setHandle] = useState('demo');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoadingHandle, setIsLoadingHandle] = useState(true);

    // 실제 핸들 가져오기
    useEffect(() => {
        const fetchHandle = async () => {
            if (!user?.id) {
                setIsLoadingHandle(false);
                return;
            }

            const { data: creatorData } = await supabase
                .from('creators')
                .select('handle')
                .eq('user_id', user.id)
                .single();

            if (creatorData?.handle) {
                setHandle(creatorData.handle);
            }
            setIsLoadingHandle(false);
        };

        fetchHandle();
    }, [user]);

    const displayText = customText || text;
    const selectedColor = colorOptions.find(c => c.id === color) || colorOptions[0];

    // 임베드 코드 생성
    const generateEmbedCode = (type: 'html' | 'markdown') => {
        const url = `https://donote.site/${handle}`;
        const imgUrl = `https://donote.site/widget/${handle}?style=${style}&color=${color}&text=${encodeURIComponent(displayText)}`;

        if (type === 'markdown') {
            return `[![${displayText}](${imgUrl})](${url})`;
        }
        return `<a href="${url}" target="_blank"><img src="${imgUrl}" alt="${displayText}" /></a>`;
    };

    // 클립보드 복사
    const copyToClipboard = (code: string, type: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setCopiedType(type);
        setTimeout(() => {
            setCopied(false);
            setCopiedType(null);
        }, 2000);
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* 페이지 헤더 */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#333] dark:text-white flex items-center gap-2">
                    🎨 위젯 생성
                </h1>
                <p className="text-[#666] dark:text-gray-400 mt-1">
                    나만의 후원 위젯을 만들어 블로그, GitHub에 설치하세요
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* 왼쪽: 사용 방법 가이드 (상세) */}
                <motion.div
                    className="lg:col-span-1 space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {/* 위젯 사용 가이드 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                            📖 위젯 사용 가이드
                        </h3>
                        <div className="space-y-4">
                            {/* Step 1 */}
                            <div className="flex gap-3">
                                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#FFD95A] rounded-full flex items-center justify-center text-white font-bold text-sm shadow">1</span>
                                <div>
                                    <p className="font-medium text-[#333] dark:text-white">위젯 스타일 선택</p>
                                    <p className="text-sm text-[#666] dark:text-gray-400 mt-1">
                                        티켓형, 버튼형, 미니 중 원하는 디자인을 선택하세요. 티켓형은 README에, 버튼형은 블로그에 잘 어울려요.
                                    </p>
                                </div>
                            </div>
                            {/* Step 2 */}
                            <div className="flex gap-3">
                                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#FFD95A] rounded-full flex items-center justify-center text-white font-bold text-sm shadow">2</span>
                                <div>
                                    <p className="font-medium text-[#333] dark:text-white">색상 & 문구 설정</p>
                                    <p className="text-sm text-[#666] dark:text-gray-400 mt-1">
                                        사이트 분위기에 맞는 색상을 선택하고, 프리셋 문구를 사용하거나 직접 입력하세요.
                                    </p>
                                </div>
                            </div>
                            {/* Step 3 */}
                            <div className="flex gap-3">
                                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#FFD95A] rounded-full flex items-center justify-center text-white font-bold text-sm shadow">3</span>
                                <div>
                                    <p className="font-medium text-[#333] dark:text-white">임베드 코드 복사</p>
                                    <p className="text-sm text-[#666] dark:text-gray-400 mt-1">
                                        <strong>HTML</strong>: 일반 웹사이트, 네이버 블로그, 티스토리<br />
                                        <strong>Markdown</strong>: GitHub README, Velog, Notion
                                    </p>
                                </div>
                            </div>
                            {/* Step 4 */}
                            <div className="flex gap-3">
                                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#FFD95A] rounded-full flex items-center justify-center text-white font-bold text-sm shadow">4</span>
                                <div>
                                    <p className="font-medium text-[#333] dark:text-white">붙여넣기 완료!</p>
                                    <p className="text-sm text-[#666] dark:text-gray-400 mt-1">
                                        복사한 코드를 원하는 곳에 붙여넣으면 위젯이 표시됩니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR 코드 사용 가이드 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                            📱 QR 코드 활용법
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <span className="text-xl">🎬</span>
                                <div>
                                    <p className="font-medium text-[#333] dark:text-white">유튜브/트위치 방송</p>
                                    <p className="text-sm text-[#666] dark:text-gray-400">
                                        화면에 QR 코드를 띄워 시청자가 쉽게 후원할 수 있게 하세요.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-xl">🎵</span>
                                <div>
                                    <p className="font-medium text-[#333] dark:text-white">버스킹/공연</p>
                                    <p className="text-sm text-[#666] dark:text-gray-400">
                                        QR 코드를 프린트해서 팬들이 스캔할 수 있도록 하세요.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-xl">📇</span>
                                <div>
                                    <p className="font-medium text-[#333] dark:text-white">명함/굿즈</p>
                                    <p className="text-sm text-[#666] dark:text-gray-400">
                                        명함이나 굿즈에 QR 코드를 넣어 팬과 연결되세요.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-xl">📸</span>
                                <div>
                                    <p className="font-medium text-[#333] dark:text-white">SNS 게시물</p>
                                    <p className="text-sm text-[#666] dark:text-gray-400">
                                        인스타그램 스토리나 게시물에 QR 코드 이미지를 공유하세요.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 팁 박스 */}
                    <div className="p-4 bg-[#FFFACD] dark:bg-yellow-900/20 rounded-xl border-2 border-dashed border-[#FFD95A]">
                        <p className="text-sm text-[#333] dark:text-gray-300">
                            💡 <strong>Pro Tip:</strong> QR 코드 이미지는 PNG로 다운로드하여 어디서든 사용할 수 있어요!
                        </p>
                    </div>
                </motion.div>

                {/* 가운데: 설정 패널 */}
                <motion.div
                    className="lg:col-span-1 space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* 스타일 선택 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                            🎨 위젯 스타일
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
                            🎨 색상
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
                            ✍️ 문구
                        </h3>
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

                {/* 오른쪽: 미리보기 & 코드 */}
                <motion.div
                    className="lg:col-span-1 space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* 미리보기 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                            🔍 미리보기
                        </h3>
                        <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center min-h-[180px]">
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
                            📋 임베드 코드
                        </h3>

                        {/* HTML */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[#666]">HTML</span>
                                <button
                                    onClick={() => copyToClipboard(generateEmbedCode('html'), 'html')}
                                    className="text-sm text-[#FF6B6B] hover:underline"
                                >
                                    {copied && copiedType === 'html' ? '✓ 복사됨!' : '복사하기'}
                                </button>
                            </div>
                            <div className="p-3 bg-gray-900 rounded-lg overflow-x-auto">
                                <code className="text-xs text-green-400 whitespace-nowrap">
                                    {generateEmbedCode('html')}
                                </code>
                            </div>
                        </div>

                        {/* Markdown */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[#666]">Markdown</span>
                                <button
                                    onClick={() => copyToClipboard(generateEmbedCode('markdown'), 'markdown')}
                                    className="text-sm text-[#FF6B6B] hover:underline"
                                >
                                    {copied && copiedType === 'markdown' ? '✓ 복사됨!' : '복사하기'}
                                </button>
                            </div>
                            <div className="p-3 bg-gray-900 rounded-lg overflow-x-auto">
                                <code className="text-xs text-green-400 whitespace-nowrap">
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
                </motion.div>
            </div>
        </div>
    );
}
