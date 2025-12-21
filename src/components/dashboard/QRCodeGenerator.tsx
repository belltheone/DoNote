"use client";
// QR 코드 생성 컴포넌트
// 클라이언트 사이드 qrcode 라이브러리 사용 (CSP 문제 해결)

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import QRCode from "qrcode";

// QR 코드 Props
interface QRCodeGeneratorProps {
    url: string;
    size?: number;
    className?: string;
    showDownload?: boolean;
    title?: string;
}

// QR 코드 생성 컴포넌트
export function QRCodeGenerator({
    url,
    size = 200,
    className = "",
    showDownload = true,
    title = "후원 QR 코드",
}: QRCodeGeneratorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [qrDataUrl, setQrDataUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    // QR 코드 생성 (클라이언트 사이드 라이브러리 사용)
    useEffect(() => {
        const generateQR = async () => {
            setIsLoading(true);
            try {
                if (canvasRef.current && url) {
                    // QR 코드 생성 옵션
                    const options = {
                        width: size,
                        margin: 2,
                        color: {
                            dark: '#333333',
                            light: '#ffffff',
                        },
                    };

                    // Canvas에 직접 QR 코드 생성
                    await QRCode.toCanvas(canvasRef.current, url, options);

                    // Data URL 생성 (다운로드용)
                    const dataUrl = await QRCode.toDataURL(url, options);
                    setQrDataUrl(dataUrl);
                }
            } catch (error) {
                console.error('QR 코드 생성 실패:', error);
            }
            setIsLoading(false);
        };

        if (url) {
            generateQR();
        }
    }, [url, size]);

    // 다운로드 함수
    const handleDownload = () => {
        if (qrDataUrl) {
            const link = document.createElement('a');
            link.download = `donote-qr-${Date.now()}.png`;
            link.href = qrDataUrl;
            link.click();
        }
    };

    // 클립보드 복사
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            alert('링크가 복사되었습니다!');
        } catch {
            console.error('복사 실패');
        }
    };

    return (
        <motion.div
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* 헤더 */}
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📱</span>
                <h3 className="text-lg font-bold text-[#333] dark:text-white">{title}</h3>
            </div>

            {/* QR 코드 */}
            <div className="flex flex-col items-center">
                <div className="relative bg-white p-4 rounded-xl shadow-inner mb-4">
                    {isLoading ? (
                        <div className="w-[200px] h-[200px] flex items-center justify-center">
                            <div className="animate-spin w-8 h-8 border-4 border-[#FF6B6B] border-t-transparent rounded-full" />
                        </div>
                    ) : (
                        <canvas
                            ref={canvasRef}
                            className="rounded-lg"
                        />
                    )}

                    {/* 도노트 로고 오버레이 */}
                    {!isLoading && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-1 shadow-md">
                            <Image
                                src="/logo-140.png"
                                alt="도노트"
                                width={36}
                                height={36}
                                className="rounded"
                            />
                        </div>
                    )}
                </div>

                {/* URL 표시 */}
                <p className="text-xs text-[#666] dark:text-gray-400 mb-4 text-center break-all max-w-[250px]">
                    {url}
                </p>

                {/* 버튼 그룹 */}
                {showDownload && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-[#FF6B6B] text-white rounded-lg font-medium hover:bg-[#FF5252] transition-colors"
                        >
                            <span>📥</span> 다운로드
                        </button>
                        <button
                            onClick={copyLink}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-[#333] dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span>🔗</span> 링크 복사
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default QRCodeGenerator;
