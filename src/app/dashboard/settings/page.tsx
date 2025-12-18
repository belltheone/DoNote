"use client";
// 설정 페이지 - 프로필 수정, 계정 관리

import { motion } from "framer-motion";
import { useState } from "react";

export default function SettingsPage() {
    const [displayName, setDisplayName] = useState('개발하는 민수');
    const [handle, setHandle] = useState('devminsu');
    const [bio, setBio] = useState('프론트엔드 개발자 | 오픈소스 기여자 | 기술 블로거');
    const [goalTitle, setGoalTitle] = useState('맥북 할부금 갚기');
    const [goalTarget, setGoalTarget] = useState(500000);
    const [saved, setSaved] = useState(false);

    // 저장 처리
    const handleSave = () => {
        // 실제로는 API 호출
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* 프로필 설정 */}
            <motion.div
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
                    <span>👤</span> 프로필 설정
                </h3>

                {/* 아바타 */}
                <div className="text-center mb-6">
                    <div className="relative inline-block">
                        <div className="w-24 h-24 rounded-full bg-[#FFFACD] flex items-center justify-center text-5xl shadow-md">
                            👨‍💻
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#FF6B6B] rounded-full text-white flex items-center justify-center shadow-md hover:bg-[#FF5252] transition-colors">
                            ✏️
                        </button>
                    </div>
                    <p className="text-sm text-[#999] mt-2">클릭하여 아바타 변경</p>
                </div>

                {/* 입력 필드들 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#666] mb-2">
                            표시 이름
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD95A] focus:outline-none transition-colors"
                            placeholder="표시될 이름"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#666] mb-2">
                            핸들 (URL)
                        </label>
                        <div className="flex items-center">
                            <span className="px-4 py-3 bg-gray-100 rounded-l-xl text-[#666] border-2 border-r-0 border-gray-200">
                                donote.kr/@
                            </span>
                            <input
                                type="text"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                className="flex-1 px-4 py-3 rounded-r-xl border-2 border-gray-200 focus:border-[#FFD95A] focus:outline-none transition-colors"
                                placeholder="handle"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#666] mb-2">
                            자기소개
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD95A] focus:outline-none transition-colors resize-none h-24"
                            placeholder="간단한 자기소개를 작성해주세요"
                            maxLength={100}
                        />
                        <p className="text-right text-xs text-[#999] mt-1">{bio.length}/100</p>
                    </div>
                </div>
            </motion.div>

            {/* 목표 설정 */}
            <motion.div
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
                    <span>🎯</span> 목표 설정
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#666] mb-2">
                            목표 제목 (위트 있게!)
                        </label>
                        <input
                            type="text"
                            value={goalTitle}
                            onChange={(e) => setGoalTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD95A] focus:outline-none transition-colors"
                            placeholder="예: 맥북 할부금 갚기"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#666] mb-2">
                            목표 금액
                        </label>
                        <div className="flex items-center">
                            <span className="px-4 py-3 bg-gray-100 rounded-l-xl text-[#666] border-2 border-r-0 border-gray-200">
                                ₩
                            </span>
                            <input
                                type="number"
                                value={goalTarget}
                                onChange={(e) => setGoalTarget(parseInt(e.target.value) || 0)}
                                className="flex-1 px-4 py-3 rounded-r-xl border-2 border-gray-200 focus:border-[#FFD95A] focus:outline-none transition-colors"
                                placeholder="500000"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* 소셜 링크 */}
            <motion.div
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="text-lg font-bold text-[#333] mb-6 flex items-center gap-2">
                    <span>🔗</span> 소셜 링크
                </h3>

                <div className="space-y-4">
                    {[
                        { label: 'GitHub', icon: '🐙', placeholder: 'https://github.com/username' },
                        { label: '블로그', icon: '📝', placeholder: 'https://blog.example.com' },
                        { label: 'Twitter', icon: '🐦', placeholder: 'https://twitter.com/username' },
                    ].map((link) => (
                        <div key={link.label} className="flex items-center gap-2">
                            <span className="text-xl">{link.icon}</span>
                            <input
                                type="url"
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FFD95A] focus:outline-none transition-colors"
                                placeholder={link.placeholder}
                            />
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* 저장 버튼 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <button
                    onClick={handleSave}
                    className="w-full py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold text-lg hover:bg-[#FF5252] transition-colors shadow-md"
                >
                    {saved ? '✓ 저장되었습니다!' : '변경사항 저장'}
                </button>
            </motion.div>

            {/* 계정 관리 */}
            <motion.div
                className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h3 className="text-lg font-bold text-[#333] mb-4 flex items-center gap-2">
                    <span>⚙️</span> 계정 관리
                </h3>

                <div className="space-y-3">
                    <button className="w-full py-3 bg-white rounded-xl text-[#666] font-medium border border-gray-200 hover:border-gray-300 transition-colors text-left px-4 flex items-center justify-between">
                        <span>🔒 비밀번호 변경</span>
                        <span>→</span>
                    </button>
                    <button className="w-full py-3 bg-white rounded-xl text-[#666] font-medium border border-gray-200 hover:border-gray-300 transition-colors text-left px-4 flex items-center justify-between">
                        <span>📧 이메일 변경</span>
                        <span>→</span>
                    </button>
                    <button className="w-full py-3 bg-white rounded-xl text-red-500 font-medium border border-red-200 hover:bg-red-50 transition-colors text-left px-4 flex items-center justify-between">
                        <span>🗑️ 계정 삭제</span>
                        <span>→</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
