"use client";
// 크리에이터 온보딩 페이지 - 프로필 생성
// 소셜 로그인 후 처음 접속 시 표시

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { supabase, upsertCreatorProfile } from "@/lib/supabase";
import { Header } from "@/components/layout/Header";
import { OnboardingProgress } from "@/components/ui/OnboardingProgress";
import { toast } from "sonner";

// 아바타 이모지 옵션
const avatarOptions = ["👨‍💻", "👩‍💻", "🧑‍🎨", "👨‍🎤", "👩‍🎤", "🐱", "🐶", "🦊", "🐻", "🐼", "🐨", "🦁"];

export default function OnboardingPage() {
    const router = useRouter();
    const { user, isLoading } = useAuthStore();

    // 폼 상태
    const [handle, setHandle] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [avatar, setAvatar] = useState('👨‍💻');
    const [bio, setBio] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [handleError, setHandleError] = useState('');

    // 사용자 정보로 기본값 설정
    useEffect(() => {
        if (user) {
            setDisplayName(user.user_metadata?.full_name || '');
            // 이메일에서 핸들 추천
            const emailHandle = user.email?.split('@')[0] || '';
            setHandle(emailHandle.toLowerCase().replace(/[^a-z0-9]/g, ''));
        }
    }, [user]);

    // 핸들 유효성 검사
    const validateHandle = (value: string) => {
        if (value.length < 3) {
            setHandleError('3자 이상 입력해주세요');
            return false;
        }
        if (!/^[a-z0-9_]+$/.test(value)) {
            setHandleError('영문 소문자, 숫자, 밑줄만 사용 가능합니다');
            return false;
        }
        setHandleError('');
        return true;
    };

    // 핸들 중복 확인
    const checkHandleAvailability = async (handle: string): Promise<boolean> => {
        const { data } = await supabase
            .from('creators')
            .select('handle')
            .eq('handle', handle)
            .single();

        return !data; // 데이터가 없으면 사용 가능
    };

    // 프로필 저장
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateHandle(handle)) return;
        if (!displayName.trim()) {
            toast.error('표시 이름을 입력해주세요');
            return;
        }
        if (!user) {
            toast.error('로그인이 필요합니다');
            return;
        }

        setIsSubmitting(true);

        try {
            // 핸들 중복 확인
            const isAvailable = await checkHandleAvailability(handle);
            if (!isAvailable) {
                setHandleError('이미 사용 중인 핸들입니다');
                setIsSubmitting(false);
                return;
            }

            // 프로필 저장
            const profile = await upsertCreatorProfile({
                userId: user.id,
                handle,
                displayName,
                avatar,
                bio,
            });

            if (profile) {
                toast.success('프로필이 생성되었습니다! 🎉');
                router.push('/dashboard');
            } else {
                toast.error('프로필 생성에 실패했습니다');
            }
        } catch (error) {
            console.error('프로필 저장 오류:', error);
            toast.error('오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 로딩 중
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex items-center justify-center">
                <motion.div
                    className="text-4xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    🍩
                </motion.div>
            </div>
        );
    }

    // 로그인 필요
    if (!user) {
        router.push('/auth');
        return null;
    }

    // 진행률 계산
    const progressSteps = useMemo(() => [
        { label: "프로필", icon: "😊" },
        { label: "핸들", icon: "🔗" },
        { label: "정보", icon: "📝" },
        { label: "완료", icon: "🎉" },
    ], []);

    const currentProgress = useMemo(() => {
        let step = 1; // 기본 시작 단계
        if (avatar !== '👨‍💻') step++; // 아바타 선택함
        if (handle.length >= 3 && !handleError) step++; // 핸들 입력함
        if (displayName.trim()) step++; // 이름 입력함
        return step;
    }, [avatar, handle, handleError, displayName]);

    return (
        <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* 진행률 표시 */}
                    <OnboardingProgress
                        currentStep={currentProgress}
                        totalSteps={4}
                        steps={progressSteps}
                    />

                    {/* 헤더 */}
                    <div className="text-center mb-8">
                        <motion.div
                            className="text-6xl mb-4"
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🍩
                        </motion.div>
                        <h1 className="text-2xl font-bold text-[#333] dark:text-white mb-2">
                            환영합니다! 🎉
                        </h1>
                        <p className="text-[#666] dark:text-gray-400">
                            크리에이터 프로필을 만들어주세요
                        </p>
                    </div>

                    {/* 폼 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 relative">
                        {/* 테이프 장식 */}
                        <div className="absolute -top-2 left-8 w-16 h-3 bg-[#FFD95A]/80 rounded transform -rotate-2" />
                        <div className="absolute -top-2 right-8 w-16 h-3 bg-[#FF6B6B]/60 rounded transform rotate-2" />

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* 아바타 선택 */}
                            <div>
                                <label className="block text-sm font-medium text-[#333] dark:text-white mb-3">
                                    프로필 이모지
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {avatarOptions.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setAvatar(emoji)}
                                            className={`w-12 h-12 text-2xl rounded-xl transition-all ${avatar === emoji
                                                ? 'bg-[#FFD95A] ring-2 ring-[#FF6B6B] scale-110'
                                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 핸들 */}
                            <div>
                                <label className="block text-sm font-medium text-[#333] dark:text-white mb-2">
                                    핸들 (URL)
                                </label>
                                <div className="flex items-center">
                                    <span className="text-[#666] dark:text-gray-400 mr-2">donote.site/</span>
                                    <input
                                        type="text"
                                        value={handle}
                                        onChange={(e) => {
                                            const v = e.target.value.toLowerCase();
                                            setHandle(v);
                                            validateHandle(v);
                                        }}
                                        className={`flex-1 px-4 py-3 rounded-xl border-2 ${handleError ? 'border-red-300' : 'border-gray-200 dark:border-gray-600'
                                            } dark:bg-gray-700 dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors`}
                                        placeholder="myhandle"
                                        maxLength={20}
                                    />
                                </div>
                                {handleError && (
                                    <p className="text-red-500 text-sm mt-1">{handleError}</p>
                                )}
                            </div>

                            {/* 표시 이름 */}
                            <div>
                                <label className="block text-sm font-medium text-[#333] dark:text-white mb-2">
                                    표시 이름
                                </label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                                    placeholder="개발하는 민수"
                                    maxLength={50}
                                />
                            </div>

                            {/* 소개 */}
                            <div>
                                <label className="block text-sm font-medium text-[#333] dark:text-white mb-2">
                                    한 줄 소개 (선택)
                                </label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors resize-none"
                                    placeholder="프론트엔드 개발자 | React, Next.js"
                                    rows={2}
                                    maxLength={100}
                                />
                            </div>

                            {/* 제출 버튼 */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !handle || !displayName}
                                className="w-full py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold hover:bg-[#FF5252] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? '생성 중...' : '🍩 시작하기'}
                            </button>
                        </form>
                    </div>

                    {/* 미리보기 */}
                    <div className="mt-8">
                        <p className="text-center text-[#666] dark:text-gray-400 text-sm mb-4">미리보기</p>
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-[#FFFACD] dark:bg-yellow-900/50 flex items-center justify-center text-3xl mb-3">
                                {avatar}
                            </div>
                            <h3 className="font-bold text-[#333] dark:text-white">{displayName || '표시 이름'}</h3>
                            <p className="text-[#666] dark:text-gray-400 text-sm">@{handle || 'handle'}</p>
                            {bio && <p className="text-[#999] dark:text-gray-500 text-sm mt-2">{bio}</p>}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
