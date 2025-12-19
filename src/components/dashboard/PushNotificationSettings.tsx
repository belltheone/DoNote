"use client";
// 푸시 알림 설정 컴포넌트
// 새 후원 알림 구독/해제 기능

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Props 타입
interface PushNotificationSettingsProps {
    className?: string;
}

// 푸시 알림 설정 컴포넌트
export function PushNotificationSettings({
    className = "",
}: PushNotificationSettingsProps) {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>("default");

    // 브라우저 지원 여부 및 구독 상태 확인
    useEffect(() => {
        const checkSupport = async () => {
            if ('Notification' in window && 'serviceWorker' in navigator) {
                setIsSupported(true);
                setPermission(Notification.permission);

                // 기존 구독 확인
                if (Notification.permission === 'granted') {
                    const registration = await navigator.serviceWorker.ready;
                    const subscription = await registration.pushManager.getSubscription();
                    setIsSubscribed(!!subscription);
                }
            }
        };

        checkSupport();
    }, []);

    // 알림 구독 처리
    const handleSubscribe = async () => {
        if (!isSupported) return;

        setIsLoading(true);

        try {
            // 알림 권한 요청
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result === 'granted') {
                // 서비스 워커 등록
                const registration = await navigator.serviceWorker.register('/sw.js');

                // 푸시 구독
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
                });

                // 서버에 구독 정보 전송 (TODO: API 구현)
                console.log('Push subscription:', subscription);
                setIsSubscribed(true);
            }
        } catch (error) {
            console.error('푸시 알림 구독 실패:', error);
        }

        setIsLoading(false);
    };

    // 알림 구독 해제
    const handleUnsubscribe = async () => {
        setIsLoading(true);

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await subscription.unsubscribe();
                setIsSubscribed(false);
            }
        } catch (error) {
            console.error('구독 해제 실패:', error);
        }

        setIsLoading(false);
    };

    return (
        <motion.div
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🔔</span>
                <div>
                    <h3 className="text-lg font-bold text-[#333] dark:text-white">푸시 알림</h3>
                    <p className="text-xs text-[#666] dark:text-gray-400">새 후원이 들어오면 알려드려요</p>
                </div>
            </div>

            {/* 지원 여부 */}
            {!isSupported ? (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                    <span className="text-3xl mb-2 block">🚫</span>
                    <p className="text-sm text-[#666] dark:text-gray-400">
                        이 브라우저는 푸시 알림을 지원하지 않습니다.
                    </p>
                </div>
            ) : permission === 'denied' ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                    <span className="text-3xl mb-2 block">⛔</span>
                    <p className="text-sm text-red-600 dark:text-red-400">
                        알림이 차단되었습니다. 브라우저 설정에서 허용해주세요.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* 상태 표시 */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isSubscribed ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className="text-sm text-[#333] dark:text-white">
                                {isSubscribed ? '알림이 활성화되었습니다' : '알림이 비활성화되었습니다'}
                            </span>
                        </div>
                    </div>

                    {/* 토글 버튼 */}
                    <button
                        onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-medium transition-colors ${isSubscribed
                                ? 'bg-gray-200 dark:bg-gray-600 text-[#333] dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500'
                                : 'bg-[#FF6B6B] text-white hover:bg-[#FF5252]'
                            } disabled:opacity-50`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                처리 중...
                            </span>
                        ) : isSubscribed ? (
                            '알림 끄기'
                        ) : (
                            '알림 켜기'
                        )}
                    </button>

                    {/* 안내 */}
                    <div className="p-3 bg-[#FFFACD] dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-xs text-[#666] dark:text-gray-300">
                            💡 새 후원이 들어오면 브라우저 알림으로 바로 확인할 수 있어요!
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default PushNotificationSettings;
