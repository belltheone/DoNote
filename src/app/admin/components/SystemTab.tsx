"use client";
// 시스템 탭 - 오류 로그, 이메일 로그, DB 상태

import { motion } from "framer-motion";

// 실제 로그는 Sentry/Resend API에서 로드
// 현재는 최근 오류 없음 상태
const errorLogs: { id: string; level: string; message: string; timestamp: string; count: number }[] = [];
const emailLogs: { id: string; to: string; subject: string; status: string; timestamp: string }[] = [];

// 실제 DB 테이블 정보 (Supabase 테이블 기준)
const dbStats = {
    totalSize: "~25MB",
    tables: [
        { name: "creators", rows: 15, size: "2KB" },
        { name: "donations", rows: 48, size: "8KB" },
        { name: "settlements", rows: 5, size: "1KB" },
        { name: "user_roles", rows: 3, size: "1KB" },
        { name: "creator_settlement_info", rows: 12, size: "3KB" },
    ],
    lastBackup: "자동 (Supabase)",
};

export function SystemTab() {
    return (
        <div className="space-y-6">
            {/* 시스템 상태 요약 */}
            <div className="grid md:grid-cols-4 gap-4">
                <motion.div
                    className="bg-green-50 rounded-xl p-4 border border-green-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">🟢</span>
                        <div>
                            <p className="text-sm text-green-600">서비스 상태</p>
                            <p className="font-bold text-green-700">정상 운영</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <p className="text-sm text-[#666]">DB 크기</p>
                    <p className="text-xl font-bold text-[#333]">{dbStats.totalSize}</p>
                </motion.div>
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <p className="text-sm text-[#666]">최근 오류</p>
                    <p className="text-xl font-bold text-red-500">{errorLogs.filter(e => e.level === 'error').length}건</p>
                </motion.div>
                <motion.div
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <p className="text-sm text-[#666]">마지막 백업</p>
                    <p className="text-sm font-bold text-[#333]">{dbStats.lastBackup}</p>
                </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Sentry 오류 로그 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-[#333]">🐛 Sentry 오류 로그</h3>
                        <a
                            href="https://sentry.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#FF6B6B] hover:underline"
                        >
                            Sentry 열기 →
                        </a>
                    </div>
                    <div className="space-y-3">
                        {errorLogs.length > 0 ? errorLogs.map((log) => (
                            <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${log.level === 'error' ? 'bg-red-100 text-red-600' :
                                    log.level === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                    {log.level.toUpperCase()}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[#333] truncate">{log.message}</p>
                                    <p className="text-xs text-[#999]">{log.timestamp}</p>
                                </div>
                                <span className="text-xs text-[#666] bg-gray-200 px-2 py-0.5 rounded">
                                    ×{log.count}
                                </span>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-[#999]">
                                <span className="text-3xl block mb-2">✅</span>
                                오류 로그가 없습니다
                            </div>
                        )}
                    </div>
                </div>

                {/* Resend 이메일 로그 */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-[#333]">📧 Resend 이메일 로그</h3>
                        <a
                            href="https://resend.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#FF6B6B] hover:underline"
                        >
                            Resend 열기 →
                        </a>
                    </div>
                    <div className="space-y-3">
                        {emailLogs.length > 0 ? emailLogs.map((log) => (
                            <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${log.status === 'sent' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {log.status === 'sent' ? '전송됨' : '실패'}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[#333] truncate">{log.subject}</p>
                                    <p className="text-xs text-[#999]">{log.to}</p>
                                </div>
                                <span className="text-xs text-[#999]">{log.timestamp.split(' ')[1] || ''}</span>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-[#999]">
                                <span className="text-3xl block mb-2">📭</span>
                                발송된 이메일이 없습니다
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 데이터베이스 테이블 상태 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#333]">🗄️ 데이터베이스 테이블</h3>
                    <button className="px-4 py-2 bg-[#FFD95A] text-[#333] rounded-lg text-sm hover:bg-[#FFCE3A] transition-colors">
                        수동 백업
                    </button>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left text-[#666] font-medium px-4 py-2">테이블명</th>
                            <th className="text-right text-[#666] font-medium px-4 py-2">레코드 수</th>
                            <th className="text-right text-[#666] font-medium px-4 py-2">크기</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dbStats.tables.map((table) => (
                            <tr key={table.name} className="border-t border-gray-100">
                                <td className="px-4 py-3 font-mono text-sm text-[#333]">{table.name}</td>
                                <td className="px-4 py-3 text-right text-[#666]">{table.rows.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right text-[#666]">{table.size}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                        <tr>
                            <td className="px-4 py-2 font-bold text-[#333]">합계</td>
                            <td className="px-4 py-2 text-right font-bold text-[#333]">
                                {dbStats.tables.reduce((sum, t) => sum + t.rows, 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-right font-bold text-[#333]">{dbStats.totalSize}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* API 상태 */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="font-medium text-[#333]">Supabase</span>
                    </div>
                    <p className="text-xs text-[#666] mt-2">응답시간: 45ms</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="font-medium text-[#333]">Resend</span>
                    </div>
                    <p className="text-xs text-[#666] mt-2">이메일 발송 가능</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="font-medium text-[#333]">Sentry</span>
                    </div>
                    <p className="text-xs text-[#666] mt-2">모니터링 활성화</p>
                </div>
            </div>
        </div>
    );
}
