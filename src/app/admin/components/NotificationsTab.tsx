"use client";
// 결제 알림 탭 - 웹훅 로그 확인
// 포트원 결제 웹훅 이벤트를 실시간으로 확인

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// 웹훅 로그 타입
interface WebhookLog {
    id: string;
    event_type: string;
    payment_id: string | null;
    data: {
        type: string;
        timestamp: string;
        data: {
            paymentId?: string;
            storeId?: string;
        };
    };
    status: 'received' | 'processed' | 'error';
    error_message: string | null;
    processed_at: string | null;
    created_at: string;
}

// Props 타입
interface NotificationsTabProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabaseClient: any;
}

// 이벤트 타입별 한글 라벨
const eventTypeLabels: Record<string, { label: string; emoji: string; color: string }> = {
    'Transaction.Paid': { label: '결제 완료', emoji: '✅', color: 'text-green-600' },
    'Transaction.Cancelled': { label: '결제 취소', emoji: '❌', color: 'text-red-600' },
    'Transaction.PartialCancelled': { label: '부분 취소', emoji: '⚠️', color: 'text-orange-600' },
    'Transaction.Failed': { label: '결제 실패', emoji: '💔', color: 'text-red-500' },
    'Transaction.VirtualAccountIssued': { label: '가상계좌 발급', emoji: '🏦', color: 'text-blue-600' },
    'Transaction.Ready': { label: '결제창 열림', emoji: '🔔', color: 'text-gray-500' },
};

// 상태별 스타일
const statusStyles: Record<string, string> = {
    'received': 'bg-yellow-100 text-yellow-700',
    'processed': 'bg-green-100 text-green-700',
    'error': 'bg-red-100 text-red-700',
};

export function NotificationsTab({ supabaseClient }: NotificationsTabProps) {
    const [logs, setLogs] = useState<WebhookLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'paid' | 'cancelled' | 'error'>('all');

    // 로그 데이터 로드
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                let query = supabaseClient
                    .from('webhook_logs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(100);

                // 필터 적용
                if (filter === 'paid') {
                    query = query.eq('event_type', 'Transaction.Paid');
                } else if (filter === 'cancelled') {
                    query = query.in('event_type', ['Transaction.Cancelled', 'Transaction.PartialCancelled']);
                } else if (filter === 'error') {
                    query = query.eq('status', 'error');
                }

                const { data, error } = await query;

                if (error) {
                    console.error('웹훅 로그 조회 오류:', error);
                } else {
                    setLogs(data || []);
                }
            } catch (err) {
                console.error('웹훅 로그 로드 오류:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [supabaseClient, filter]);

    // 시간 포맷
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '방금';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days < 7) return `${days}일 전`;
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#333]">🔔 결제 알림</h2>
                    <p className="text-sm text-[#666]">포트원 결제 웹훅 이벤트 로그</p>
                </div>

                {/* 필터 */}
                <div className="flex gap-2 flex-wrap">
                    {[
                        { key: 'all', label: '전체', emoji: '📋' },
                        { key: 'paid', label: '결제 완료', emoji: '✅' },
                        { key: 'cancelled', label: '취소', emoji: '❌' },
                        { key: 'error', label: '오류', emoji: '⚠️' },
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setFilter(item.key as typeof filter)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === item.key
                                ? 'bg-[#FF6B6B] text-white'
                                : 'bg-gray-100 text-[#666] hover:bg-gray-200'
                                }`}
                        >
                            {item.emoji} {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 로딩 */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-[#FF6B6B] border-t-transparent rounded-full mx-auto" />
                    <p className="text-[#666] mt-4">로그 불러오는 중...</p>
                </div>
            ) : logs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <p className="text-4xl mb-4">📭</p>
                    <p className="text-[#666]">아직 수신된 웹훅이 없습니다.</p>
                    <p className="text-sm text-[#999] mt-2">
                        포트원 콘솔에서 웹훅 URL을 등록하면 결제 알림이 여기에 표시됩니다.
                    </p>
                </div>
            ) : (
                /* 로그 목록 */
                <div className="space-y-3">
                    {logs.map((log, index) => {
                        const eventInfo = eventTypeLabels[log.event_type] || {
                            label: log.event_type,
                            emoji: '📌',
                            color: 'text-gray-600',
                        };

                        return (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{eventInfo.emoji}</span>
                                        <div>
                                            <p className={`font-semibold ${eventInfo.color}`}>
                                                {eventInfo.label}
                                            </p>
                                            {log.payment_id && (
                                                <p className="text-sm text-[#666] mt-1">
                                                    주문번호: <code className="bg-gray-100 px-1 rounded">{log.payment_id}</code>
                                                </p>
                                            )}
                                            {log.error_message && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    오류: {log.error_message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[log.status]}`}>
                                            {log.status === 'received' && '수신됨'}
                                            {log.status === 'processed' && '처리됨'}
                                            {log.status === 'error' && '오류'}
                                        </span>
                                        <p className="text-xs text-[#999] mt-2">
                                            {formatTime(log.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* 안내 */}
            <div className="bg-gradient-to-r from-[#FF6B6B]/10 to-[#FFD95A]/10 rounded-xl p-4 border border-[#FFD95A]/30">
                <p className="text-sm text-[#666]">
                    💡 <strong>실시간 알림</strong>: 결제가 완료되면 자동으로 이 목록에 추가됩니다.
                    페이지를 새로고침하면 최신 로그를 확인할 수 있습니다.
                </p>
            </div>
        </div>
    );
}
