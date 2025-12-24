"use client";
// 정산 관리 페이지 - 정산 정보 등록 및 정산 내역 확인
// 매월 자동 정산 시스템

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import {
    getMyDonations,
    getMySettlements,
    requestSettlement,
    getSettlementInfo,
    upsertSettlementInfo,
    getRealStats,
    SettlementStatus
} from "@/lib/supabase";
import { toast } from "sonner";
import { AddressSearch } from "@/components/common/AddressSearch";
import { verifyAccountHolder, BANK_LIST } from "@/lib/portone-verify";
import { requestIdentityVerification } from "@/lib/portone-identity";

export default function SettlementPage() {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingInfo, setIsSavingInfo] = useState(false);

    // 탭 상태: info (정산 정보 입력) / request (정산 신청)
    const [activeTab, setActiveTab] = useState<'info' | 'request'>('info');

    // 통계 및 정산 데이터
    const [stats, setStats] = useState({ totalAmount: 0, thisMonthAmount: 0, totalNotes: 0, thisMonthNotes: 0 });
    const [settlements, setSettlements] = useState<{ id: string; amount: number; netAmount: number; status: SettlementStatus; requestedAt: string; completedAt?: string; }[]>([]);
    const [hasSettlementInfo, setHasSettlementInfo] = useState(false);

    // 정산 정보 폼 상태
    const [settlementForm, setSettlementForm] = useState({
        creatorType: 'individual' as 'individual' | 'business',  // 크리에이터 유형
        realName: '',
        ssnFront: '',
        ssnBack: '',
        businessRegistrationNumber: '',  // 사업자등록번호
        address: '',
        addressDetail: '',  // 상세주소 추가
        phoneNumber: '',
        bankName: '',
        accountNumber: '',
        accountHolder: '',
    });

    // 계좌 인증 상태
    const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
    const [accountVerified, setAccountVerified] = useState(false);

    // 본인인증 상태
    const [isVerifyingIdentity, setIsVerifyingIdentity] = useState(false);
    const [identityVerified, setIdentityVerified] = useState(false);

    // 정산 가능 금액 계산
    const settledAmount = settlements.filter(s => s.status !== 'rejected').reduce((sum, s) => sum + s.amount, 0);
    const availableAmount = Math.max(0, stats.totalAmount - settledAmount);

    // 수수료 계산 (플랫폼 5%)
    const platformFee = Math.round(availableAmount * 0.05);
    const netAmount = availableAmount - platformFee;

    // 데이터 로드
    useEffect(() => {
        const loadData = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                // 내 후원 목록
                const donations = await getMyDonations(user.id);
                const realStats = await getRealStats(donations);
                setStats(realStats);

                // 내 정산 내역
                const mySettlements = await getMySettlements(user.id);
                setSettlements(mySettlements);

                // 정산 정보 조회
                const info = await getSettlementInfo(user.id);
                if (info) {
                    setHasSettlementInfo(true);
                    setSettlementForm({
                        creatorType: info.creatorType || 'individual',
                        realName: info.realName || '',
                        ssnFront: info.ssnFront || '',
                        ssnBack: '', // 보안상 뒤 7자리는 표시하지 않음
                        businessRegistrationNumber: info.businessRegistrationNumber || '',
                        address: info.address || '',
                        addressDetail: '', // 상세주소 (기존 데이터에는 없을 수 있음)
                        phoneNumber: info.phoneNumber || '',
                        bankName: info.bankName || '',
                        accountNumber: '', // 보안상 계좌번호는 표시하지 않음
                        accountHolder: info.accountHolder || '',
                    });
                    setAccountVerified(true); // 기존 정보가 있으면 인증 완료 상태
                    setActiveTab('request'); // 정산 정보가 있으면 정산 신청 탭으로
                }
            } catch (error) {
                console.error('데이터 로드 오류:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user]);

    // 본인인증 처리
    const handleVerifyIdentity = async () => {
        setIsVerifyingIdentity(true);
        try {
            const result = await requestIdentityVerification();

            if (result.success) {
                // 인증된 정보로 폼 업데이트
                setSettlementForm({
                    ...settlementForm,
                    realName: result.name || settlementForm.realName,
                    phoneNumber: result.phoneNumber || settlementForm.phoneNumber,
                });
                setIdentityVerified(true);
                toast.success(`본인인증 완료: ${result.name}`);
            } else {
                toast.error(result.message || '본인인증에 실패했습니다.');
            }
        } catch {
            toast.error('본인인증 중 오류가 발생했습니다.');
        } finally {
            setIsVerifyingIdentity(false);
        }
    };

    // 계좌 인증 처리
    const handleVerifyAccount = async () => {
        if (!settlementForm.bankName || !settlementForm.accountNumber) {
            toast.error('은행과 계좌번호를 먼저 입력해주세요.');
            return;
        }

        // 생년월일 추출 (주민번호 앞 6자리 → YYYY-MM-DD)
        const ssnFront = settlementForm.ssnFront;
        let birthdate = '';
        if (ssnFront && ssnFront.length === 6) {
            const yy = ssnFront.substring(0, 2);
            const mm = ssnFront.substring(2, 4);
            const dd = ssnFront.substring(4, 6);
            // 2000년대생인지 1900년대생인지 판단 (간단히 80 이상이면 19xx)
            const year = parseInt(yy) >= 50 ? `19${yy}` : `20${yy}`;
            birthdate = `${year}-${mm}-${dd}`;
        }

        setIsVerifyingAccount(true);
        try {
            const result = await verifyAccountHolder(
                settlementForm.bankName,
                settlementForm.accountNumber,
                birthdate || undefined
            );

            if (result.success && result.holderName) {
                setSettlementForm({ ...settlementForm, accountHolder: result.holderName });
                setAccountVerified(true);
                toast.success(`예금주 확인 완료: ${result.holderName}`);
            } else {
                toast.error(result.message || '계좌 인증에 실패했습니다.');
            }
        } catch {
            toast.error('계좌 인증 중 오류가 발생했습니다.');
        } finally {
            setIsVerifyingAccount(false);
        }
    };

    // 정산 정보 저장
    const handleSaveSettlementInfo = async () => {
        if (!user) return;

        // 유효성 검사
        if (!settlementForm.realName || !settlementForm.ssnFront || !settlementForm.ssnBack ||
            !settlementForm.address || !settlementForm.phoneNumber ||
            !settlementForm.bankName || !settlementForm.accountNumber || !settlementForm.accountHolder) {
            toast.error('모든 필수 항목을 입력해주세요.');
            return;
        }

        // 사업자인 경우 사업자등록번호 필수
        if (settlementForm.creatorType === 'business' && !settlementForm.businessRegistrationNumber) {
            toast.error('사업자등록번호를 입력해주세요.');
            return;
        }

        if (settlementForm.ssnFront.length !== 6 || settlementForm.ssnBack.length !== 7) {
            toast.error('주민등록번호를 정확히 입력해주세요.');
            return;
        }

        if (!accountVerified) {
            toast.error('계좌 인증을 먼저 완료해주세요.');
            return;
        }

        setIsSavingInfo(true);
        try {
            // 상세주소가 있으면 합치기
            const fullAddress = settlementForm.addressDetail
                ? `${settlementForm.address} ${settlementForm.addressDetail}`
                : settlementForm.address;

            const success = await upsertSettlementInfo({
                creatorId: user.id,
                creatorType: settlementForm.creatorType,
                realName: settlementForm.realName,
                ssnFront: settlementForm.ssnFront,
                ssnBackEncrypted: settlementForm.ssnBack, // 실제로는 서버에서 암호화
                businessRegistrationNumber: settlementForm.creatorType === 'business'
                    ? settlementForm.businessRegistrationNumber
                    : undefined,
                address: fullAddress,
                phoneNumber: settlementForm.phoneNumber,
                bankName: settlementForm.bankName,
                accountNumberEncrypted: settlementForm.accountNumber, // 실제로는 서버에서 암호화
                accountHolder: settlementForm.accountHolder,
            });

            if (success) {
                toast.success('정산 정보가 저장되었습니다!');
                setHasSettlementInfo(true);
                setActiveTab('request');
            } else {
                toast.error('정산 정보 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('정산 정보 저장 오류:', error);
            toast.error('오류가 발생했습니다.');
        } finally {
            setIsSavingInfo(false);
        }
    };

    // 정산 신청 처리
    const handleRequestSettlement = async () => {
        if (!user) return;

        if (!hasSettlementInfo) {
            toast.error('정산 정보를 먼저 등록해주세요.');
            setActiveTab('info');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await requestSettlement(user.id, availableAmount);

            if (result.success) {
                toast.success(result.message);
                // 정산 목록 새로고침
                const mySettlements = await getMySettlements(user.id);
                setSettlements(mySettlements);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('정산 요청 오류:', error);
            toast.error('정산 요청에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 상태별 배지 표시
    const getStatusBadge = (status: SettlementStatus) => {
        switch (status) {
            case 'pending':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-medium">⏳ 대기중</span>;
            case 'approved':
                return <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">✓ 승인됨</span>;
            case 'completed':
                return <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">✓ 완료</span>;
            case 'rejected':
                return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">✕ 거절</span>;
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto animate-pulse space-y-6">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-48" />
                <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-16" />
                <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* 페이지 헤더 */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2 className="text-2xl font-bold text-[#333] dark:text-white flex items-center gap-2">
                    <span>💳</span> 정산 관리
                </h2>
                <p className="text-[#666] dark:text-gray-400 mt-1">정산 정보를 등록하고 정산 내역을 확인하세요</p>
            </motion.div>

            {/* 정산 가능 금액 카드 */}
            <motion.div
                className="bg-gradient-to-r from-[#FFD95A] to-[#FFE082] rounded-2xl p-8 shadow-lg relative overflow-hidden mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="absolute top-4 right-4 text-6xl opacity-20">💳</div>

                <p className="text-[#333]/70 text-sm mb-2">정산 가능 금액</p>
                <p className="text-5xl font-bold text-[#333] mb-4">
                    ₩{availableAmount.toLocaleString()}
                </p>

                <div className="flex items-center gap-4 text-sm">
                    <span className="text-[#333]/70">
                        총 후원: ₩{stats.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[#333]/50">|</span>
                    <span className="text-[#333]/70">
                        기 정산: ₩{settledAmount.toLocaleString()}
                    </span>
                </div>
            </motion.div>

            {/* 탭 네비게이션 */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${activeTab === 'info'
                        ? 'bg-[#FF6B6B] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-[#666] dark:text-gray-300'
                        }`}
                >
                    {hasSettlementInfo ? '✓ ' : ''}정산 정보 {hasSettlementInfo ? '(등록완료)' : '입력'}
                </button>
                <button
                    onClick={() => setActiveTab('request')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${activeTab === 'request'
                        ? 'bg-[#FF6B6B] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-[#666] dark:text-gray-300'
                        }`}
                >
                    정산 내역
                </button>
            </div>

            {/* 매월 자동 정산 안내 배너 */}
            <motion.div
                className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-4 border border-green-200 dark:border-green-700 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-start gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                        <h4 className="font-bold text-green-800 dark:text-green-300">매월 자동 정산 시스템</h4>
                        <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                            모든 크리에이터에게 <strong>매월 15일</strong>에 자동으로 정산됩니다.<br />
                            최소 정산 금액(₩10,000) 미만은 다음달로 이월됩니다.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* 정산 정보 입력 탭 */}
            {activeTab === 'info' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-2 flex items-center gap-2">
                            <span>📋</span> 정산 정보 입력
                        </h3>
                        <p className="text-sm text-[#999] dark:text-gray-500 mb-6">
                            후원금을 받으시려면 아래 정보를 입력해주세요.
                        </p>

                        <div className="space-y-4">
                            {/* 크리에이터 유형 선택 */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-3">
                                    크리에이터 유형 <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-4">
                                    <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${settlementForm.creatorType === 'individual'
                                        ? 'border-[#FF6B6B] bg-[#FF6B6B]/10'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-[#FF6B6B]/50'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="creatorType"
                                            value="individual"
                                            checked={settlementForm.creatorType === 'individual'}
                                            onChange={() => setSettlementForm({ ...settlementForm, creatorType: 'individual', businessRegistrationNumber: '' })}
                                            className="w-4 h-4 text-[#FF6B6B]"
                                        />
                                        <div>
                                            <p className="font-medium text-[#333] dark:text-white">👤 개인 (프리랜서)</p>
                                            <p className="text-xs text-[#999] dark:text-gray-500">원천징수 3.3% 적용</p>
                                        </div>
                                    </label>
                                    <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${settlementForm.creatorType === 'business'
                                        ? 'border-[#FF6B6B] bg-[#FF6B6B]/10'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-[#FF6B6B]/50'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="creatorType"
                                            value="business"
                                            checked={settlementForm.creatorType === 'business'}
                                            onChange={() => setSettlementForm({ ...settlementForm, creatorType: 'business' })}
                                            className="w-4 h-4 text-[#FF6B6B]"
                                        />
                                        <div>
                                            <p className="font-medium text-[#333] dark:text-white">🏢 사업자</p>
                                            <p className="text-xs text-[#999] dark:text-gray-500">세금계산서 발행</p>
                                        </div>
                                    </label>
                                </div>
                                {settlementForm.creatorType === 'individual' && (
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
                                        ℹ️ 개인 크리에이터는 정산 시 원천징수세(소득세 3% + 주민세 0.3%)가 공제됩니다.
                                    </p>
                                )}
                                {settlementForm.creatorType === 'business' && (
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-3">
                                        ℹ️ 사업자는 원천징수 없이 세금계산서를 발행하여 정산받을 수 있습니다.
                                    </p>
                                )}
                            </div>

                            {/* 사업자등록번호 (사업자인 경우만) */}
                            {settlementForm.creatorType === 'business' && (
                                <div>
                                    <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                                        사업자등록번호 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settlementForm.businessRegistrationNumber}
                                        onChange={(e) => setSettlementForm({
                                            ...settlementForm,
                                            businessRegistrationNumber: e.target.value.replace(/[^0-9-]/g, '')
                                        })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                                        placeholder="000-00-00000"
                                        maxLength={12}
                                    />
                                    <p className="text-xs text-[#999] dark:text-gray-500 mt-1">
                                        세금계산서 발행을 위해 필요합니다. 정산 시 별도로 세금계산서를 요청드립니다.
                                    </p>
                                </div>
                            )}

                            {/* 성명 */}
                            <div>
                                <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                                    성명 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={settlementForm.realName}
                                    onChange={(e) => setSettlementForm({ ...settlementForm, realName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                                    placeholder="실명을 입력해주세요"
                                />
                            </div>

                            {/* 주민등록번호 */}
                            <div>
                                <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                                    주민등록번호 <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={settlementForm.ssnFront}
                                        onChange={(e) => setSettlementForm({ ...settlementForm, ssnFront: e.target.value.replace(/\D/g, '') })}
                                        className="w-28 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors text-center"
                                        placeholder="앞 6자리"
                                    />
                                    <span className="text-[#666]">-</span>
                                    <input
                                        type="password"
                                        maxLength={7}
                                        value={settlementForm.ssnBack}
                                        onChange={(e) => setSettlementForm({ ...settlementForm, ssnBack: e.target.value.replace(/\D/g, '') })}
                                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors text-center"
                                        placeholder="뒤 7자리"
                                    />
                                </div>
                                <p className="text-xs text-[#999] dark:text-gray-500 mt-1">
                                    ⚠️ 원천징수세(3.3%) 신고를 위해 필요합니다. 개인정보는 암호화되어 안전하게 보관됩니다.
                                </p>
                            </div>

                            {/* 주소 */}
                            <div>
                                <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                                    주소 <span className="text-red-500">*</span>
                                </label>
                                <AddressSearch
                                    value={settlementForm.address}
                                    placeholder="주소 검색을 클릭하세요"
                                    onComplete={(data) => setSettlementForm({
                                        ...settlementForm,
                                        address: `(${data.zonecode}) ${data.address}`
                                    })}
                                />
                                {/* 상세주소 */}
                                <input
                                    type="text"
                                    value={settlementForm.addressDetail}
                                    onChange={(e) => setSettlementForm({ ...settlementForm, addressDetail: e.target.value })}
                                    className="w-full mt-2 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors"
                                    placeholder="상세주소 입력 (동/호수 등)"
                                />
                            </div>

                            {/* 휴대폰 번호 + 본인인증 */}
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                                <h4 className="font-medium text-[#333] dark:text-white mb-4 flex items-center gap-2">
                                    📱 본인인증
                                    {identityVerified && (
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">✓ 인증완료</span>
                                    )}
                                </h4>

                                {!identityVerified ? (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-[#666] dark:text-gray-400 mb-4">
                                            정산을 받으시려면 본인인증이 필요합니다.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleVerifyIdentity}
                                            disabled={isVerifyingIdentity}
                                            className="px-6 py-3 bg-[#FF6B6B] text-white rounded-xl font-medium hover:bg-[#FF5252] transition-colors disabled:opacity-50"
                                        >
                                            {isVerifyingIdentity ? '인증 중...' : '📱 본인인증 하기'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                                                휴대폰 번호 (인증됨)
                                            </label>
                                            <input
                                                type="tel"
                                                value={settlementForm.phoneNumber}
                                                readOnly
                                                className="w-full px-4 py-3 rounded-xl border-2 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 text-[#333] dark:text-white cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <hr className="border-gray-200 dark:border-gray-600 my-4" />

                            {/* 계좌 정보 섹션 */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <h4 className="font-medium text-[#333] dark:text-white mb-4 flex items-center gap-2">
                                    🏦 계좌 정보
                                    {accountVerified && (
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">✓ 인증완료</span>
                                    )}
                                </h4>

                                {/* 은행명 */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                                        은행명 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={settlementForm.bankName}
                                        onChange={(e) => {
                                            setSettlementForm({ ...settlementForm, bankName: e.target.value });
                                            setAccountVerified(false); // 은행 변경 시 인증 해제
                                        }}
                                        disabled={accountVerified}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors disabled:opacity-60"
                                    >
                                        <option value="">은행을 선택해주세요</option>
                                        {BANK_LIST.map((bank) => (
                                            <option key={bank} value={bank}>{bank}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 계좌번호 */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                                        계좌번호 <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={settlementForm.accountNumber}
                                            onChange={(e) => {
                                                setSettlementForm({ ...settlementForm, accountNumber: e.target.value.replace(/\D/g, '') });
                                                setAccountVerified(false); // 계좌번호 변경 시 인증 해제
                                            }}
                                            disabled={accountVerified}
                                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-[#333] dark:text-white focus:border-[#FFD95A] focus:outline-none transition-colors disabled:opacity-60"
                                            placeholder="-없이 숫자만 입력"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleVerifyAccount}
                                            disabled={isVerifyingAccount || accountVerified}
                                            className="px-4 py-3 bg-[#FF6B6B] text-white rounded-xl font-medium hover:bg-[#FF5252] transition-colors disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {isVerifyingAccount ? '인증 중...' : accountVerified ? '✓ 인증됨' : '🔍 계좌 인증'}
                                        </button>
                                    </div>
                                </div>

                                {/* 예금주명 */}
                                <div>
                                    <label className="block text-sm font-medium text-[#666] dark:text-gray-400 mb-2">
                                        예금주명 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={settlementForm.accountHolder}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-[#333] dark:text-white cursor-not-allowed"
                                        placeholder="계좌 인증 후 자동 입력됩니다"
                                    />
                                    <p className="text-xs text-[#999] dark:text-gray-500 mt-1">⚠️ 본인 명의 계좌만 등록 가능합니다.</p>
                                </div>
                            </div>

                            {/* 저장 버튼 */}
                            <button
                                onClick={handleSaveSettlementInfo}
                                disabled={isSavingInfo}
                                className="w-full py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold text-lg hover:bg-[#FF5252] transition-all shadow-md disabled:opacity-50"
                            >
                                {isSavingInfo ? '저장 중...' : '✓ 정산 정보 저장'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* 정산 신청 탭 */}
            {activeTab === 'request' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* 정산 정보 미등록 경고 */}
                    {!hasSettlementInfo && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-dashed border-red-300 rounded-xl">
                            <p className="text-red-600 dark:text-red-400 font-medium mb-2">⚠️ 정산 정보가 등록되지 않았습니다</p>
                            <p className="text-sm text-red-500 dark:text-red-300 mb-3">
                                정산을 받으시려면 먼저 정산 정보를 등록해주세요.
                            </p>
                            <button
                                onClick={() => setActiveTab('info')}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                                정산 정보 입력하기 →
                            </button>
                        </div>
                    )}

                    {/* 정산 요약 */}
                    {availableAmount >= 1000 && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="text-center text-sm text-[#999] dark:text-gray-500 mb-3">--- 정산 예상 금액 ---</div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[#666] dark:text-gray-400">
                                    <span>정산 요청 금액</span>
                                    <span>₩{availableAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[#999] dark:text-gray-500 text-sm">
                                    <span>플랫폼 수수료 (5%)</span>
                                    <span className="text-red-500">-₩{platformFee.toLocaleString()}</span>
                                </div>
                                <div className="pt-3 border-t border-dashed border-gray-300 dark:border-gray-600 flex justify-between font-bold text-[#333] dark:text-white">
                                    <span>실 입금액</span>
                                    <span className="text-[#FF6B6B]">₩{netAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 정산 신청 버튼 */}
                    <button
                        onClick={handleRequestSettlement}
                        disabled={availableAmount < 1000 || !hasSettlementInfo || isSubmitting}
                        className="w-full py-4 bg-[#FF6B6B] rounded-xl text-white font-semibold text-lg hover:bg-[#FF5252] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="inline-block"
                            >⏳</motion.span>
                        ) : availableAmount >= 1000 ? (
                            hasSettlementInfo ? '💰 정산 신청하기' : '정산 정보를 먼저 입력해주세요'
                        ) : (
                            '최소 정산 금액: ₩1,000'
                        )}
                    </button>

                    {/* 정산 내역 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-[#333] dark:text-white mb-4 flex items-center gap-2">
                            <span>📋</span> 정산 내역
                        </h3>

                        {settlements.length > 0 ? (
                            <div className="space-y-3">
                                {settlements.map((settlement) => (
                                    <div
                                        key={settlement.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                                    >
                                        <div>
                                            <p className="font-bold text-[#333] dark:text-white">
                                                ₩{settlement.amount.toLocaleString()}
                                                <span className="text-sm font-normal text-[#999] dark:text-gray-400 ml-2">
                                                    (실 수령: ₩{settlement.netAmount.toLocaleString()})
                                                </span>
                                            </p>
                                            <p className="text-xs text-[#999] dark:text-gray-500">
                                                {new Date(settlement.requestedAt).toLocaleDateString('ko-KR')} 신청
                                                {settlement.completedAt && ` → ${new Date(settlement.completedAt).toLocaleDateString('ko-KR')} 완료`}
                                            </p>
                                        </div>
                                        {getStatusBadge(settlement.status)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-[#999] dark:text-gray-500">
                                아직 정산 내역이 없어요
                            </div>
                        )}
                    </div>

                    {/* 안내 */}
                    <div className="bg-[#FFFACD] dark:bg-yellow-900/20 rounded-xl p-4 border-2 border-dashed border-[#FFD95A]">
                        <p className="text-sm text-[#666] dark:text-gray-300">
                            💡 <strong>자동 정산 안내</strong>: 매월 15일에 자동으로 정산이 진행됩니다. 정산 정보가 등록되어 있어야 합니다.
                        </p>
                        <p className="text-xs text-[#999] dark:text-gray-500 mt-2">
                            ※ 플랫폼 수수료 5%가 차감됩니다. 최소 정산 금액은 ₩10,000입니다.
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
