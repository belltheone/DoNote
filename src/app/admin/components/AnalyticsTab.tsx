"use client";
// 분석/통계 탭 - 방문자, 인기 크리에이터, 차트, 결제 알림

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { CreatorProfile, Donation } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";

// Props 타입
interface AnalyticsTabProps {
    creators: CreatorProfile[];
    donations: Donation[];
}

// GA4 통계 타입
interface GA4Stats {
    today: number;
    week: number;
    month: number;
    avgSessionDuration: string;
    bounceRate: string;
}

// 웹훅 로그 타입
interface WebhookLog {
    id: string;
    event_type: string;
    payment_id: string | null;
    status: 'received' | 'processed' | 'error';
    error_message: string | null;
    created_at: string;
}

// 이벤트 타입별 한글 라벨
const eventTypeLabels: Record<string, { label: string; emoji: string; color: string }> = {
    'Transaction.Paid': { label: '결제 완료', emoji: '✅', color: 'text-green-600' },
    'Transaction.Cancelled': { label: '결제 취소', emoji: '❌', color: 'text-red-600' },
    'Transaction.PartialCancelled': { label: '부분 취소', emoji: '⚠️', color: 'text-orange-600' },
    'Transaction.Failed': { label: '결제 실패', emoji: '💔', color: 'text-red-500' },
};

export function AnalyticsTab({ creators, donations }: AnalyticsTabProps) {
    // GA4 방문자 통계 상태
    const [visitorStats, setVisitorStats] = useState<GA4Stats | null>(null);
    const [ga4Loading, setGa4Loading] = useState(true);
    const [ga4Error, setGa4Error] = useState<string | null>(null);

    // 웹훅 로그 상태
    const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
    const [logsLoading, setLogsLoading] = useState(true);

    // GA4 데이터 로드
    useEffect(() => {
        const fetchGA4Data = async () => {
            try {
                const response = await fetch('/api/admin/analytics');
                const result = await response.json();

                if (result.success && result.data) {
                    setVisitorStats(result.data);
                } else {
                    setGa4Error(result.error || 'GA4 데이터를 가져오지 못했습니다.');
                }
            } catch (error) {
                console.error('GA4 API 오류:', error);
                setGa4Error('GA4 API 호출 중 오류가 발생했습니다.');
            } finally {
                setGa4Loading(false);
            }
        };

        fetchGA4Data();
    }, []);

    // 웹훅 로그 로드
    useEffect(() => {
        const fetchWebhookLogs = async () => {
            try {
                const { data, error } = await supabase
                    .from('webhook_logs')
                    .select('id, event_type, payment_id, status, error_message, created_at')
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (!error && data) {
                    setWebhookLogs(data);
                }
            } catch (err) {
                console.error('웹훅 로그 로드 오류:', err);
            } finally {
                setLogsLoading(false);
            }
        };

        fetchWebhookLogs();
    }, []);

    // 시간 포맷
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        if (minutes < 1) return '방금';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    };

    // 크리에이터별 통계 - 실제 데이터
    const creatorStats = creators.map(creator => {
        const creatorDonations = donations.filter(d => d.creatorId === creator.id);
        return {
            ...creator,
            totalAmount: creatorDonations.reduce((sum, d) => sum + d.amount, 0),
            count: creatorDonations.length,
        };
    }).sort((a, b) => b.totalAmount - a.totalAmount);

    // 일별 후원 데이터 - 실제 donations에서 계산
    const dailyData = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (13 - i));
        const dateStr = date.toISOString().split('T')[0];
        const dayDonations = donations.filter(d => d.createdAt.startsWith(dateStr));
        return {
            date: `${date.getMonth() + 1}/${date.getDate()}`,
            amount: dayDonations.reduce((sum, d) => sum + d.amount, 0),
            count: dayDonations.length,
        };
    });

    // 방문자 통계 표시 값
    const displayStats = {
        today: ga4Loading ? '...' : (visitorStats?.today?.toLocaleString() || '-'),
        week: ga4Loading ? '...' : (visitorStats?.week?.toLocaleString() || '-'),
        month: ga4Loading ? '...' : (visitorStats?.month?.toLocaleString() || '-'),
        avgSessionDuration: ga4Loading ? '...' : (visitorStats?.avgSessionDuration || '-'),
        bounceRate: ga4Loading ? '...' : (visitorStats?.bounceRate || '-'),
    };

    return (
        <div className="space-y-6">
            {/* 방문자 개요 */}
            <div className="grid md:grid-cols-5 gap-4">
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-sm text-[#666]">오늘 방문자</p>
                    <p className="text-2xl font-bold text-[#333] mt-1">{displayStats.today}</p>
                </motion.div>
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <p className="text-sm text-[#666]">주간 방문자</p>
                    <p className="text-2xl font-bold text-[#333] mt-1">{displayStats.week}</p>
                </motion.div>
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <p className="text-sm text-[#666]">월간 방문자</p>
                    <p className="text-2xl font-bold text-[#333] mt-1">{displayStats.month}</p>
                </motion.div>
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <p className="text-sm text-[#666]">평균 체류시간</p>
                    <p className="text-2xl font-bold text-[#333] mt-1">{displayStats.avgSessionDuration}</p>
                </motion.div>
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <p className="text-sm text-[#666]">이탈률</p>
                    <p className="text-2xl font-bold text-[#333] mt-1">{displayStats.bounceRate}</p>
                </motion.div>
            </div>

            {/* 14일 후원 추이 차트 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#333] mb-4">📈 최근 14일 후원 추이</h3>
                <div className="h-48 flex items-end justify-between gap-1">
                    {dailyData.map((data, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-xs text-[#999]">₩{Math.floor(data.amount / 1000)}k</span>
                            <motion.div
                                className="w-full bg-gradient-to-t from-[#FF6B6B] to-[#FFD95A] rounded-t"
                                initial={{ height: 0 }}
                                animate={{ height: `${(data.amount / 150000) * 100}%` }}
                                transition={{ delay: i * 0.03, duration: 0.4 }}
                            />
                            <span className="text-xs text-[#666] whitespace-nowrap">{data.date}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* TOP 10 크리에이터 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-[#333] mb-4">👑 TOP 10 인기 크리에이터</h3>
                    <div className="space-y-3">
                        {creatorStats.slice(0, 10).map((creator, i) => (
                            <div key={creator.id} className="flex items-center gap-3">
                                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-[#FFD95A] text-[#333]' :
                                    i === 1 ? 'bg-gray-300 text-[#333]' :
                                        i === 2 ? 'bg-[#CD7F32] text-white' :
                                            'bg-gray-100 text-[#666]'
                                    }`}>
                                    {i + 1}
                                </span>
                                <span className="text-xl">{creator.avatar}</span>
                                <span className="flex-1 font-medium text-[#333] truncate">{creator.displayName}</span>
                                <span className="text-sm font-bold text-[#FF6B6B]">
                                    ₩{creator.totalAmount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                        {creatorStats.length === 0 && (
                            <p className="text-center text-[#666] py-4">데이터가 없습니다.</p>
                        )}
                    </div>
                </div>

                {/* 일별 통계 테이블 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-[#333] mb-4">📊 일별 후원 통계</h3>
                    <div className="max-h-80 overflow-y-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="text-left text-[#666] font-medium px-3 py-2">날짜</th>
                                    <th className="text-right text-[#666] font-medium px-3 py-2">건수</th>
                                    <th className="text-right text-[#666] font-medium px-3 py-2">금액</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyData.slice().reverse().map((data, i) => (
                                    <tr key={i} className="border-t border-gray-100">
                                        <td className="px-3 py-2 text-[#333]">{data.date}</td>
                                        <td className="px-3 py-2 text-right text-[#666]">{data.count}건</td>
                                        <td className="px-3 py-2 text-right font-medium text-[#FF6B6B]">
                                            ₩{data.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* GA4 연동 상태 */}
            {ga4Error ? (
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <div className="flex items-start gap-4">
                        <span className="text-3xl">⚠️</span>
                        <div>
                            <h4 className="font-bold text-red-600">GA4 연동 오류</h4>
                            <p className="text-sm text-red-500 mt-1">
                                {ga4Error}
                            </p>
                            <p className="text-xs text-[#999] mt-2">
                                환경변수(GA4_PROPERTY_ID, GOOGLE_APPLICATION_CREDENTIALS_JSON)를 확인해주세요.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-r from-[#4CAF50]/10 to-[#8BC34A]/10 rounded-xl p-6 border border-[#4CAF50]/30">
                    <div className="flex items-start gap-4">
                        <span className="text-3xl">✅</span>
                        <div>
                            <h4 className="font-bold text-[#333]">Google Analytics 4 연동 완료</h4>
                            <p className="text-sm text-[#666] mt-1">
                                GA4 데이터를 실시간으로 가져오고 있습니다. 더 자세한 분석은 GA4 대시보드에서 확인하세요.
                            </p>
                            <a
                                href="https://analytics.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-3 px-4 py-2 bg-[#4CAF50] text-white rounded-lg text-sm hover:bg-[#45a049] transition-colors"
                            >
                                GA4 대시보드 열기 →
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* 결제 알림 (최근 웹훅 로그) */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#333] mb-4">🔔 최근 결제 알림</h3>
                {logsLoading ? (
                    <div className="text-center py-4">
                        <div className="animate-spin w-6 h-6 border-2 border-[#FF6B6B] border-t-transparent rounded-full mx-auto" />
                    </div>
                ) : webhookLogs.length === 0 ? (
                    <p className="text-[#999] text-sm text-center py-4">
                        아직 수신된 결제 알림이 없습니다.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {webhookLogs.map((log) => {
                            const eventInfo = eventTypeLabels[log.event_type] || {
                                label: log.event_type,
                                emoji: '📌',
                                color: 'text-gray-600',
                            };
                            return (
                                <div
                                    key={log.id}
                                    className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <span>{eventInfo.emoji}</span>
                                        <span className={`font-medium ${eventInfo.color}`}>
                                            {eventInfo.label}
                                        </span>
                                        {log.payment_id && (
                                            <code className="text-xs bg-gray-200 px-1 rounded">
                                                {log.payment_id.substring(0, 20)}...
                                            </code>
                                        )}
                                    </div>
                                    <span className="text-xs text-[#999]">
                                        {formatTime(log.created_at)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
