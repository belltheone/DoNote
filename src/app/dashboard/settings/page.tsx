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
    const [profileImage, setProfileImage] = useState<string | null>(null); // 프로필 이미지 URL
    const [useEmoji, setUseEmoji] = useState(true); // 이모지 vs 이미지
    const [displayName, setDisplayName] = useState("");
    const [handle, setHandle] = useState("");
    const [bio, setBio] = useState("");
    const [goalTitle, setGoalTitle] = useState("");
    const [goalTarget, setGoalTarget] = useState(500000);

    // 테마 상태
    const [selectedTheme, setSelectedTheme] = useState(0);

    // 정산 계좌 정보는 정산하기 페이지에서 관리

    // 소셜 링크 (고정)
    const [socialLinks, setSocialLinks] = useState({
        github: "",
        blog: "",
        twitter: "",
        youtube: "",
        instagram: "",
    });

    // 커스텀 링크 (동적 추가)
    const [customLinks, setCustomLinks] = useState<Array<{ name: string; url: string }>>([]);

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // 계정 관리 모달 상태
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // 프로필 이미지 업로드 핸들러
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
                setUseEmoji(false);
            };
            reader.readAsDataURL(file);
        }
    };

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
                    setSocialLinks(prev => ({ ...prev, ...data.social_links }));
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

    // 비밀번호 변경 처리
    const handlePasswordChange = async () => {
        if (newPassword.length < 6) {
            toast.error("비밀번호는 6자 이상이어야 합니다");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("비밀번호가 일치하지 않습니다");
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;

            toast.success("비밀번호가 변경되었습니다! 🔐");
            setShowPasswordModal(false);
            setNewPassword('');
            setConfirmPassword('');
        } catch {
            toast.error("비밀번호 변경에 실패했습니다");
        }
    };

    // 이메일 변경 처리
    const handleEmailChange = async () => {
        if (!newEmail || !newEmail.includes('@')) {
            toast.error("올바른 이메일을 입력해주세요");
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({ email: newEmail });
            if (error) throw error;

            toast.success("인증 메일이 발송되었습니다. 확인해주세요! 📧");
            setShowEmailModal(false);
            setNewEmail('');
        } catch {
            toast.error("이메일 변경에 실패했습니다");
        }
    };

    // 계정 삭제 처리 (확인 문구 필요)
    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== '삭제합니다') {
            toast.error("'삭제합니다'를 정확히 입력해주세요");
            return;
        }

        toast.error("계정 삭제는 관리자에게 문의해주세요");
        setShowDeleteModal(false);
        setDeleteConfirmText('');
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

                {/* 프로필 이미지/이모지 선택 */}
                <div className="mb-6">
                    <p className="text-sm font-medium text-[#666] dark:text-gray-400 mb-3">
                        프로필 이미지
                    </p>

                    {/* 이모지/이미지 전환 탭 */}
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setUseEmoji(true)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${useEmoji
                                ? 'bg-[#FFD95A] text-[#333]'
                                : 'bg-gray-100 dark:bg-gray-700 text-[#666] dark:text-gray-400'
                                }`}
                        >
                            😀 이모지
                        </button>
                        <button
                            onClick={() => setUseEmoji(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!useEmoji
                                ? 'bg-[#FFD95A] text-[#333]'
                                : 'bg-gray-100 dark:bg-gray-700 text-[#666] dark:text-gray-400'
                                }`}
                        >
                            📷 사진 업로드
                        </button>
                    </div>

                    {useEmoji ? (
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
                    ) : (
                        <div className="flex items-center gap-4">
                            {/* 프로필 이미지 미리보기 */}
                            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                                {profileImage ? (
                                    <img src={profileImage} alt="프로필" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl text-gray-400">👤</span>
                                )}
                            </div>
                            <label className="px-4 py-2 bg-[#FF6B6B] text-white rounded-lg cursor-pointer hover:bg-[#FF5252] transition-colors">
                                📷 사진 선택
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* 입력 필드들 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                            표시 이름 <span className="text-[#FF6B6B]">*</span>
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
                            핸들 (URL) <span className="text-[#FF6B6B]">*</span>
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

                {/* 테마 미리보기 */}
                <div className="mt-6 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4">
                    <p className="text-sm text-[#666] dark:text-gray-400 mb-3">📱 미리보기</p>
                    <div
                        className="rounded-xl p-4 text-white"
                        style={{ background: `linear-gradient(135deg, ${themeColors[selectedTheme].primary}, ${themeColors[selectedTheme].secondary})` }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">{useEmoji ? avatar : '👤'}</span>
                            <div>
                                <p className="font-bold">{displayName || '내 이름'}</p>
                                <p className="text-sm opacity-80">@{handle || 'handle'}</p>
                            </div>
                        </div>
                        <button
                            className="w-full py-2 rounded-lg font-semibold"
                            style={{ backgroundColor: themeColors[selectedTheme].secondary, color: '#333' }}
                        >
                            🍩 후원하기
                        </button>
                    </div>
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

                {/* 기본 소셜 링크 */}
                <div className="space-y-4 mb-6">
                    {[
                        { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
                        { key: 'blog', label: '블로그', placeholder: 'https://blog.example.com' },
                        { key: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/username' },
                        { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
                        { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
                    ].map((link) => (
                        <div key={link.key} className="flex items-center gap-2">
                            <span className="text-sm font-medium w-20 text-[#666] dark:text-gray-400">{link.label}</span>
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

                {/* 커스텀 링크 */}
                {customLinks.length > 0 && (
                    <div className="space-y-4 mb-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-medium text-[#666] dark:text-gray-400">직접 추가한 링크</p>
                        {customLinks.map((link, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={link.name}
                                    onChange={(e) => {
                                        const updated = [...customLinks];
                                        updated[index].name = e.target.value;
                                        setCustomLinks(updated);
                                    }}
                                    className="w-24 px-3 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors text-sm"
                                    placeholder="사이트명"
                                />
                                <input
                                    type="url"
                                    value={link.url}
                                    onChange={(e) => {
                                        const updated = [...customLinks];
                                        updated[index].url = e.target.value;
                                        setCustomLinks(updated);
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                                    placeholder="https://example.com"
                                />
                                <button
                                    onClick={() => setCustomLinks(customLinks.filter((_, i) => i !== index))}
                                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* 링크 추가 버튼 */}
                <button
                    onClick={() => setCustomLinks([...customLinks, { name: '', url: '' }])}
                    className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-[#666] dark:text-gray-400 hover:border-[#FFD95A] hover:text-[#333] dark:hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                    <span>+</span> 링크 추가
                </button>
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
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full py-3 bg-white dark:bg-gray-700 rounded-xl text-[#666] dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-600 hover:border-gray-300 transition-colors text-left px-4 flex items-center justify-between"
                    >
                        <span>🔒 비밀번호 변경</span>
                        <span>→</span>
                    </button>
                    <button
                        onClick={() => setShowEmailModal(true)}
                        className="w-full py-3 bg-white dark:bg-gray-700 rounded-xl text-[#666] dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-600 hover:border-gray-300 transition-colors text-left px-4 flex items-center justify-between"
                    >
                        <span>📧 이메일 변경</span>
                        <span>→</span>
                    </button>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full py-3 bg-white dark:bg-gray-700 rounded-xl text-red-500 font-medium border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left px-4 flex items-center justify-between"
                    >
                        <span>🗑️ 계정 삭제</span>
                        <span>→</span>
                    </button>
                </div>
            </motion.div>

            {/* 비밀번호 변경 모달 */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h3 className="text-xl font-bold text-[#333] dark:text-white mb-4">🔒 비밀번호 변경</h3>
                        <div className="space-y-4">
                            <input
                                type="password"
                                placeholder="새 비밀번호 (6자 이상)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none"
                            />
                            <input
                                type="password"
                                placeholder="비밀번호 확인"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => { setShowPasswordModal(false); setNewPassword(''); setConfirmPassword(''); }}
                                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-[#666] dark:text-gray-300 font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                className="flex-1 py-3 bg-[#FF6B6B] rounded-xl text-white font-medium hover:bg-[#FF5252]"
                            >
                                변경
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* 이메일 변경 모달 */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h3 className="text-xl font-bold text-[#333] dark:text-white mb-4">📧 이메일 변경</h3>
                        <p className="text-sm text-[#666] dark:text-gray-400 mb-4">새 이메일로 인증 메일이 발송됩니다.</p>
                        <input
                            type="email"
                            placeholder="새 이메일 주소"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none"
                        />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => { setShowEmailModal(false); setNewEmail(''); }}
                                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-[#666] dark:text-gray-300 font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleEmailChange}
                                className="flex-1 py-3 bg-[#FF6B6B] rounded-xl text-white font-medium hover:bg-[#FF5252]"
                            >
                                변경
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* 계정 삭제 모달 */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h3 className="text-xl font-bold text-red-500 mb-4">🗑️ 계정 삭제</h3>
                        <p className="text-sm text-[#666] dark:text-gray-400 mb-4">
                            계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.<br />
                            계속하려면 아래에 <strong>&apos;삭제합니다&apos;</strong>를 입력하세요.
                        </p>
                        <input
                            type="text"
                            placeholder="삭제합니다"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-red-200 dark:border-red-900 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-red-500 focus:outline-none"
                        />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-[#666] dark:text-gray-300 font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex-1 py-3 bg-red-500 rounded-xl text-white font-medium hover:bg-red-600"
                            >
                                삭제
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
