"use client";
// 콘텐츠 관리 탭 - 블로그, FAQ, 공지사항 CRUD

import { motion } from "framer-motion";
import { useState } from "react";

// 콘텐츠 타입
interface BlogPost {
    id: string;
    title: string;
    category: string;
    status: "draft" | "published";
    createdAt: string;
}

interface FAQ {
    id: string;
    question: string;
    answer: string;
    order: number;
}

interface Notice {
    id: string;
    title: string;
    type: "info" | "warning" | "success";
    active: boolean;
    createdAt: string;
}

// 실제 블로그 글 데이터 (blog/page.tsx와 동기화)
const initialBlogPosts: BlogPost[] = [
    { id: "1", title: "도노트, 마음을 전하는 새로운 방법", category: "서비스 소개", status: "published", createdAt: "2025-12-21" },
    { id: "2", title: "후원을 받기 시작하는 5가지 방법", category: "크리에이터 팁", status: "published", createdAt: "2025-12-21" },
    { id: "3", title: "도노트 정식 출시 및 주요 기능 안내", category: "업데이트", status: "published", createdAt: "2025-12-21" },
];

// FAQ 데이터 (faq/page.tsx와 동기화)
const initialFaqs: FAQ[] = [
    { id: "1", question: "도노트는 어떤 서비스인가요?", answer: "도노트는 크리에이터와 팬을 연결하는 후원 플랫폼입니다.", order: 1 },
    { id: "2", question: "수수료는 얼마인가요?", answer: "후원 금액의 5%가 수수료로 부과됩니다.", order: 2 },
    { id: "3", question: "정산은 어떻게 받나요?", answer: "최소 10,000원 이상 모이면 등록된 계좌로 정산 신청이 가능합니다.", order: 3 },
];

// 공지사항 데이터
const initialNotices: Notice[] = [
    { id: "1", title: "도노트 서비스 정식 오픈!", type: "success", active: true, createdAt: "2025-12-21" },
    { id: "2", title: "연말 이벤트 진행 중", type: "info", active: true, createdAt: "2025-12-20" },
];

export function ContentTab() {
    const [activeSection, setActiveSection] = useState<"blog" | "faq" | "notice">("blog");
    const [blogPosts] = useState<BlogPost[]>(initialBlogPosts);
    const [faqs] = useState<FAQ[]>(initialFaqs);
    const [notices] = useState<Notice[]>(initialNotices);

    return (
        <div className="space-y-6">
            {/* 섹션 탭 */}
            <div className="flex gap-2">
                {[
                    { id: "blog", label: "블로그 관리", icon: "📝" },
                    { id: "faq", label: "FAQ 관리", icon: "❓" },
                    { id: "notice", label: "공지사항", icon: "📢" },
                ].map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id as typeof activeSection)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${activeSection === section.id
                            ? 'bg-[#FFD95A] text-[#333]'
                            : 'bg-gray-100 text-[#666] hover:bg-gray-200'
                            }`}
                    >
                        {section.icon} {section.label}
                    </button>
                ))}
            </div>

            {/* 블로그 관리 */}
            {activeSection === "blog" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[#333]">블로그 글 목록</h3>
                        <button className="px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#e55555] transition-colors">
                            + 새 글 작성
                        </button>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left text-[#666] font-medium px-4 py-3">제목</th>
                                    <th className="text-left text-[#666] font-medium px-4 py-3">카테고리</th>
                                    <th className="text-center text-[#666] font-medium px-4 py-3">상태</th>
                                    <th className="text-right text-[#666] font-medium px-4 py-3">작성일</th>
                                    <th className="text-center text-[#666] font-medium px-4 py-3">액션</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogPosts.map((post) => (
                                    <tr key={post.id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-4 py-4 font-medium text-[#333]">{post.title}</td>
                                        <td className="px-4 py-4 text-[#666]">{post.category}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {post.status === 'published' ? '발행됨' : '임시저장'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right text-[#999]">{post.createdAt}</td>
                                        <td className="px-4 py-4 text-center">
                                            <button className="px-3 py-1 bg-gray-100 text-[#666] rounded text-sm mr-2">수정</button>
                                            <button className="px-3 py-1 bg-red-100 text-red-500 rounded text-sm">삭제</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* FAQ 관리 */}
            {activeSection === "faq" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[#333]">FAQ 목록</h3>
                        <button className="px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#e55555] transition-colors">
                            + FAQ 추가
                        </button>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <div className="flex items-start gap-4">
                                    <span className="w-8 h-8 bg-[#FFD95A] rounded-full flex items-center justify-center text-[#333] font-bold">
                                        {faq.order}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-medium text-[#333]">{faq.question}</p>
                                        <p className="text-sm text-[#666] mt-1">{faq.answer}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-gray-100 text-[#666] rounded text-sm">수정</button>
                                        <button className="px-3 py-1 bg-red-100 text-red-500 rounded text-sm">삭제</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* 공지사항 */}
            {activeSection === "notice" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-[#333]">공지사항</h3>
                        <button className="px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#e55555] transition-colors">
                            + 공지 추가
                        </button>
                    </div>
                    <div className="space-y-3">
                        {notices.map((notice) => (
                            <div key={notice.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${notice.type === 'success' ? 'bg-green-100 text-green-600' :
                                    notice.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                    {notice.type === 'success' ? '성공' : notice.type === 'warning' ? '주의' : '정보'}
                                </span>
                                <span className="flex-1 font-medium text-[#333]">{notice.title}</span>
                                <span className={`px-2 py-1 rounded text-xs ${notice.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                    {notice.active ? '활성' : '비활성'}
                                </span>
                                <span className="text-sm text-[#999]">{notice.createdAt}</span>
                                <button className="px-3 py-1 bg-gray-100 text-[#666] rounded text-sm">수정</button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
