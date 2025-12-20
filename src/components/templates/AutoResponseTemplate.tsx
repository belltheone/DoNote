"use client";
// 자동 응답 템플릿 관리
// 금액별/조건별 자동 감사 메시지

import { useState } from "react";
import { motion } from "framer-motion";

// 템플릿 타입
export interface AutoResponseTemplate {
    id: string;
    name: string;
    condition: "all" | "amount_gte" | "first_time" | "repeat";
    amountThreshold?: number;
    message: string;
    isEnabled: boolean;
}

// 기본 템플릿
export const defaultTemplates: AutoResponseTemplate[] = [
    {
        id: "default",
        name: "기본 감사 메시지",
        condition: "all",
        message:
            "안녕하세요 {donorName}님! 💌\n따뜻한 후원 정말 감사드려요.\n덕분에 더 좋은 콘텐츠를 만들 수 있어요!\n\n감사합니다 ❤️\n{creatorName} 드림",
        isEnabled: true,
    },
    {
        id: "big_donation",
        name: "큰 금액 후원 (1만원 이상)",
        condition: "amount_gte",
        amountThreshold: 10000,
        message:
            "{donorName}님! 💎\n정말 큰 응원을 보내주셨어요.\n마음 깊이 감사드립니다.\n\n앞으로도 좋은 모습 보여드릴게요!\n{creatorName} 드림",
        isEnabled: true,
    },
    {
        id: "first_time",
        name: "첫 후원자",
        condition: "first_time",
        message:
            "{donorName}님, 환영합니다! 🎉\n저의 첫 서포터가 되어주셔서 감격스러워요.\n이 인연을 오래 이어가고 싶습니다.\n\n진심으로 감사드려요!\n{creatorName} 드림",
        isEnabled: true,
    },
    {
        id: "repeat",
        name: "재후원자",
        condition: "repeat",
        message:
            "{donorName}님, 또 만났네요! 🌟\n다시 찾아주셔서 정말 감사해요.\n믿고 응원해주시는 만큼 열심히 하겠습니다.\n\n항상 감사해요!\n{creatorName} 드림",
        isEnabled: true,
    },
];

// 변수 치환 함수
export function replaceTemplateVariables(
    template: string,
    variables: Record<string, string>
): string {
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
        result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    });
    return result;
}

// 조건에 맞는 템플릿 선택
export function selectTemplate(
    templates: AutoResponseTemplate[],
    donation: {
        donorName: string;
        amount: number;
        isFirstTime: boolean;
        isRepeat: boolean;
    }
): AutoResponseTemplate | null {
    const enabledTemplates = templates.filter((t) => t.isEnabled);

    // 조건별 우선순위: first_time > repeat > amount_gte > all
    const firstTime = enabledTemplates.find(
        (t) => t.condition === "first_time" && donation.isFirstTime
    );
    if (firstTime) return firstTime;

    const repeat = enabledTemplates.find(
        (t) => t.condition === "repeat" && donation.isRepeat
    );
    if (repeat) return repeat;

    const amountGte = enabledTemplates
        .filter(
            (t) =>
                t.condition === "amount_gte" &&
                t.amountThreshold &&
                donation.amount >= t.amountThreshold
        )
        .sort((a, b) => (b.amountThreshold || 0) - (a.amountThreshold || 0))[0];
    if (amountGte) return amountGte;

    const all = enabledTemplates.find((t) => t.condition === "all");
    return all || null;
}

interface TemplateEditorProps {
    templates: AutoResponseTemplate[];
    onSave: (templates: AutoResponseTemplate[]) => void;
}

export function TemplateEditor({ templates, onSave }: TemplateEditorProps) {
    const [editingTemplates, setEditingTemplates] =
        useState<AutoResponseTemplate[]>(templates);
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setEditingTemplates((prev) =>
            prev.map((t) => (t.id === id ? { ...t, isEnabled: !t.isEnabled } : t))
        );
    };

    const handleMessageChange = (id: string, message: string) => {
        setEditingTemplates((prev) =>
            prev.map((t) => (t.id === id ? { ...t, message } : t))
        );
    };

    const handleSave = () => {
        onSave(editingTemplates);
        setEditingId(null);
    };

    return (
        <div className="space-y-4">
            {editingTemplates.map((template) => (
                <motion.div
                    key={template.id}
                    className={`p-4 rounded-xl border-2 ${template.isEnabled
                            ? "border-[#FFD95A] bg-[#FFFACD]/20"
                            : "border-gray-200 bg-gray-50 dark:bg-gray-800"
                        }`}
                    layout
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-[#333] dark:text-white">
                            {template.name}
                            {template.amountThreshold && (
                                <span className="ml-2 text-sm text-[#666] dark:text-gray-400">
                                    (₩{template.amountThreshold.toLocaleString()} 이상)
                                </span>
                            )}
                        </h3>
                        <button
                            onClick={() => handleToggle(template.id)}
                            className={`w-12 h-6 rounded-full transition-colors ${template.isEnabled ? "bg-[#4ECCA3]" : "bg-gray-300"
                                }`}
                        >
                            <motion.div
                                className="w-5 h-5 bg-white rounded-full shadow"
                                animate={{ x: template.isEnabled ? 26 : 2 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>

                    {editingId === template.id ? (
                        <div className="space-y-2">
                            <textarea
                                value={template.message}
                                onChange={(e) =>
                                    handleMessageChange(template.id, e.target.value)
                                }
                                className="w-full p-3 border rounded-lg resize-none h-32 text-sm dark:bg-gray-700 dark:text-white"
                            />
                            <p className="text-xs text-[#999]">
                                사용 가능 변수: {"{donorName}"}, {"{amount}"},{" "}
                                {"{creatorName}"}
                            </p>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-[#FFD95A] text-[#333] rounded-lg font-medium"
                            >
                                저장
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={() => setEditingId(template.id)}
                            className="text-sm text-[#666] dark:text-gray-400 whitespace-pre-wrap cursor-pointer hover:bg-white/50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
                        >
                            {template.message}
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}
