"use client";
// 설정 페이지 - 프로필 수정, 테마 커스터마이징, 계정 관리
// 다크 모드 지원

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { supabase, upsertCreatorProfile } from "@/lib/supabase";
import { toast } from "sonner";

// 아바타 옵션
const avatarOptions = ["👨‍💻", "👩‍💻", "🧑‍🎨", "👨‍🎤", "👩‍🎤", "🐱", "🐶", "🦊", "🐻", "🐼", "🐨", "🦁", "🦄", "🌟", "🎮", "🎨"];

// 테마 색상 옵션
const themeColors = [
    { name: "코랄", primary: "#FF6B6B", secondary: "#FFD95A" },
    { name: "오션", primary: "#4ECDC4", secondary: "#45B7D1" },
    { name: "라벤더", primary: "#9B59B6", secondary: "#E8DAEF" },
    { name: "민트", primary: "#1ABC9C", secondary: "#A3E4D7" },
    { name: "선셋", primary: "#E74C3C", secondary: "#F39C12" },
    { name: "포레스트", primary: "#27AE60", secondary: "#82E0AA" },
];

export default function SettingsPage() {
    const { user } = useAuthStore();

    // 프로필 상태
    const [avatar, setAvatar] = useState("👨‍💻");
    const [displayName, setDisplayName] = useState("");
    const [handle, setHandle] = useState("");
    const [bio, setBio] = useState("");
    const [goalTitle, setGoalTitle] = useState("");
    const [goalTarget, setGoalTarget] = useState(500000);

    // 테마 상태
    const [selectedTheme, setSelectedTheme] = useState(0);

    // 소셜 링크
    const [socialLinks, setSocialLinks] = useState({
        github: "",
        blog: "",
        twitter: "",
        youtube: "",
        instagram: "",
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 프로필 로드
    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;

            const { data } = await supabase
                .from('creators')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (data) {
                setAvatar(data.avatar || "👨‍💻");
                setDisplayName(data.display_name || "");
                setHandle(data.handle || "");
                setBio(data.bio || "");
                setGoalTitle(data.goal_title || "");
                setGoalTarget(data.goal_target || 500000);
                if (data.social_links) {
                    setSocialLinks({ ...socialLinks, ...data.social_links });
                }
            }
            setIsLoading(false);
        };
        loadProfile();
    }, [user]);

    // 저장 처리
    const handleSave = async () => {
        if (!user) {
            toast.error("로그인이 필요합니다");
            return;
        }

        setIsSaving(true);
        try {
            const result = await upsertCreatorProfile({
                userId: user.id,
                handle,
                displayName,
                avatar,
                bio,
                goalTitle,
                goalTarget,
                socialLinks,
            });

            if (result) {
                toast.success("설정이 저장되었습니다! ✨");
            } else {
                toast.error("저장에 실패했습니다");
            }
        } catch {
            toast.error("오류가 발생했습니다");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="animate-pulse space-y-6">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64" />
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-48" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* 프로필 설정 */}
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="text-lg font-bold text-[#333] dark:text-white mb-6 flex items-center gap-2">
                    <span>👤</span> 프로필 설정
                </h3>

                {/* 아바타 선택 */}
                <div className="mb-6">
                    <p className="text-sm font-medium text-[#666] dark:text-gray-400 mb-3">
                        프로필 이모지
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {avatarOptions.map((emoji) => (
                            <button
                                key={emoji}
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

                {/* 입력 필드들 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                            표시 이름
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                            placeholder="표시될 이름"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                            핸들 (URL)
                        </label>
                        <div className="flex items-center">
                            <span className="px-4 py-3 bg-gray-100 dark:bg-gray-600 rounded-l-xl text-[#666] dark:text-gray-300 border-2 border-r-0 border-gray-200 dark:border-gray-600">
                                donote.site/
                            </span>
                            <input
                                type="text"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                className="flex-1 px-4 py-3 rounded-r-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                                placeholder="handle"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                            자기소개
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors resize-none h-24"
                            placeholder="간단한 자기소개를 작성해주세요"
                            maxLength={100}
                        />
                        <p className="text-right text-xs text-[#999] dark:text-gray-500 mt-1">{bio.length}/100</p>
                    </div>
                </div>
            </motion.div>

            {/* 테마 커스터마이징 */}
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="text-lg font-bold text-[#333] dark:text-white mb-6 flex items-center gap-2">
                    <span>🎨</span> 테마 커스터마이징
                </h3>

                <p className="text-sm text-[#666] dark:text-gray-400 mb-4">
                    후원 페이지에 적용될 테마 색상을 선택하세요
                </p>

                <div className="grid grid-cols-3 gap-3">
                    {themeColors.map((theme, index) => (
                        <button
                            key={theme.name}
                            onClick={() => setSelectedTheme(index)}
                            className={`p-4 rounded-xl border-2 transition-all ${selectedTheme === index
                                ? 'border-[#333] dark:border-white scale-105'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex gap-2 mb-2">
                                <div
                                    className="w-6 h-6 rounded-full"
                                    style={{ backgroundColor: theme.primary }}
                                />
                                <div
                                    className="w-6 h-6 rounded-full"
                                    style={{ backgroundColor: theme.secondary }}
                                />
                            </div>
                            <p className="text-sm font-medium text-[#333] dark:text-white">{theme.name}</p>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* 목표 설정 */}
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="text-lg font-bold text-[#333] dark:text-white mb-6 flex items-center gap-2">
                    <span>🎯</span> 목표 설정
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                            목표 제목 (위트 있게!)
                        </label>
                        <input
                            type="text"
                            value={goalTitle}
                            onChange={(e) => setGoalTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                            placeholder="예: 맥북 할부금 갚기"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                            목표 금액
                        </label>
                        <div className="flex items-center">
                            <span className="px-4 py-3 bg-gray-100 dark:bg-gray-600 rounded-l-xl text-[#666] dark:text-gray-300 border-2 border-r-0 border-gray-200 dark:border-gray-600">
                                ₩
                            </span>
                            <input
                                type="number"
                                value={goalTarget}
                                onChange={(e) => setGoalTarget(parseInt(e.target.value) || 0)}
                                className="flex-1 px-4 py-3 rounded-r-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                                placeholder="500000"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 소셜 링크 */}
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-lg font-bold text-[#333] dark:text-white mb-6 flex items-center gap-2">
                    <span>🔗</span> 소셜 링크
                </h3>

                <div className="space-y-4">
                    {[
                        { key: 'github', label: 'GitHub', icon: '🐙', placeholder: 'https://github.com/username' },
                        { key: 'blog', label: '블로그', icon: '📝', placeholder: 'https://blog.example.com' },
                        { key: 'twitter', label: 'Twitter', icon: '🐦', placeholder: 'https://twitter.com/username' },
                        { key: 'youtube', label: 'YouTube', icon: '📺', placeholder: 'https://youtube.com/@channel' },
                        { key: 'instagram', label: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/username' },
                    ].map((link) => (
                        <div key={link.key} className="flex items-center gap-2">
                            <span className="text-xl w-8">{link.icon}</span>
                            <input
                                type="url"
                                value={socialLinks[link.key as keyof typeof socialLinks]}
                                onChange={(e) => setSocialLinks({ ...socialLinks, [link.key]: e.target.value })}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                                placeholder={link.placeholder}
                            />
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* 정산 정보 설정 */}
            <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
            >
                <h3 className="text-lg font-bold text-[#333] dark:text-white mb-2 flex items-center gap-2">
                    <span>💳</span> 정산 정보
                </h3>
                <p className="text-sm text-[#999] dark:text-gray-500 mb-6">
                    후원금을 받으시려면 정산에 필요한 정보를 입력해주세요.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                            성명 <span className="text-red-500">*</span>
                        </label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors" placeholder="실명을 입력해주세요" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                            주민등록번호 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <input type="text" maxLength={6} className="w-28 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors text-center" placeholder="앞 6자리" />
                            <span className="text-[#666]">-</span>
                            <input type="password" maxLength={7} className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors text-center" placeholder="뒤 7자리" />
                        </div>
                        <p className="text-xs text-[#999] dark:text-gray-500 mt-1">⚠️ 세금 신고를 위해 필요합니다. 암호화되어 안전하게 저장됩니다.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">주소 <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors" placeholder="도로명 주소를 입력해주세요" />
                    </div>

                    <hr className="border-gray-200 dark:border-gray-600 my-4" />

                    <div>
                        <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">은행명 <span className="text-red-500">*</span></label>
                        <select className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors">
                            <option value="">은행을 선택해주세요</option>
                            <option value="카카오뱅크">카카오뱅크</option>
                            <option value="토스뱅크">토스뱅크</option>
                            <option value="케이뱅크">케이뱅크</option>
                            <option value="국민은행">국민은행</option>
                            <option value="신한은행">신한은행</option>
                            <option value="우리은행">우리은행</option>
                            <option value="하나은행">하나은행</option>
                            <option value="농협은행">농협은행</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">계좌번호 <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors" placeholder="-없이 숫자만 입력" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">예금주명 <span className="text-red-500">*</span></label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors" placeholder="예금주명을 입력해주세요" />
                        <p className="text-xs text-[#999] dark:text-gray-500 mt-1">⚠️ 본인 명의 계좌만 등록 가능합니다.</p>
                    </div>

                    <div className="p-4 bg-[#FFFACD] dark:bg-yellow-900/20 rounded-xl border-2 border-dashed border-[#FFD95A]">
                        <p className="text-sm text-[#666] dark:text-gray-300">
                            🔐 <strong>본인인증 안내:</strong> 정산 신청 시 본인인증 절차가 진행됩니다.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* 저장 버튼 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold text-lg hover:bg-[#FF5252] transition-colors shadow-md disabled:opacity-50"
                >
                    {isSaving ? '저장 중...' : '✨ 변경사항 저장'}
                </button>
            </motion.div>

            {/* 계정 관리 */}
            <motion.div
                className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                    <span>⚙️</span> 계정 관리
                </h3>

                <div className="space-y-3">
                    <button className="w-full py-3 bg-white dark:bg-gray-700 rounded-xl text-[#666] dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-600 hover:border-gray-300 transition-colors text-left px-4 flex items-center justify-between">
                        <span>🔒 비밀번호 변경</span>
                        <span>→</span>
                    </button>
                    <button className="w-full py-3 bg-white dark:bg-gray-700 rounded-xl text-[#666] dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-600 hover:border-gray-300 transition-colors text-left px-4 flex items-center justify-between">
                        <span>📧 이메일 변경</span>
                        <span>→</span>
                    </button>
                    <button className="w-full py-3 bg-white dark:bg-gray-700 rounded-xl text-red-500 font-medium border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left px-4 flex items-center justify-between">
                        <span>🗑️ 계정 삭제</span>
                        <span>→</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
