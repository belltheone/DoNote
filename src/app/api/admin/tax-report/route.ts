// 관리자 세금 보고서 API
// 크리에이터별 원천징수 내역 조회 및 CSV 다운로드

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 동적 라우트 설정
export const dynamic = 'force-dynamic';

// Supabase Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 날짜 헬퍼 함수
function getDateRange(year: number, month?: number): { start: string; end: string } {
    if (month) {
        // 특정 월
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);
        return {
            start: start.toISOString(),
            end: end.toISOString()
        };
    } else {
        // 연간
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31, 23, 59, 59);
        return {
            start: start.toISOString(),
            end: end.toISOString()
        };
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
        const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined;
        const format = searchParams.get('format') || 'json';

        const { start, end } = getDateRange(year, month);

        // 1. 기간 내 정산 내역 조회
        const { data: settlements, error: settlementError } = await supabaseAdmin
            .from('settlements')
            .select('*')
            .gte('requested_at', start)
            .lte('requested_at', end)
            .in('status', ['approved', 'completed']);

        if (settlementError) {
            console.error('정산 내역 조회 오류:', settlementError);
            throw settlementError;
        }

        // 2. 크리에이터 정산 정보 조회
        const { data: settlementInfos, error: infoError } = await supabaseAdmin
            .from('creator_settlement_info')
            .select('*');

        if (infoError) {
            console.error('정산 정보 조회 오류:', infoError);
            throw infoError;
        }

        // 3. 크리에이터 프로필 조회
        const { data: creators, error: creatorError } = await supabaseAdmin
            .from('creators')
            .select('id, user_id, display_name, handle');

        if (creatorError) {
            console.error('크리에이터 조회 오류:', creatorError);
            throw creatorError;
        }

        // 4. 데이터 조인 및 집계
        const infoMap = new Map(settlementInfos?.map(i => [i.creator_id, i]) || []);
        const creatorMap = new Map(creators?.map(c => [c.user_id, c]) || []);

        // 크리에이터별 정산 합계
        const creatorSummary = new Map<string, {
            creatorId: string;
            displayName: string;
            handle: string;
            creatorType: string;
            realName: string;
            ssnFront: string;
            businessRegistrationNumber: string;
            totalAmount: number;
            totalFee: number;
            totalWithholdingTax: number;
            totalNetAmount: number;
            settlementCount: number;
        }>();

        settlements?.forEach(s => {
            const creatorId = s.creator_id;
            const info = infoMap.get(creatorId);
            const creator = creatorMap.get(creatorId);

            const existing = creatorSummary.get(creatorId) || {
                creatorId,
                displayName: creator?.display_name || '알 수 없음',
                handle: creator?.handle || '',
                creatorType: info?.creator_type || 'individual',
                realName: info?.real_name || '',
                ssnFront: info?.ssn_front || '',
                businessRegistrationNumber: info?.business_registration_number || '',
                totalAmount: 0,
                totalFee: 0,
                totalWithholdingTax: 0,
                totalNetAmount: 0,
                settlementCount: 0
            };

            existing.totalAmount += s.amount || 0;
            existing.totalFee += s.fee || 0;
            existing.totalWithholdingTax += s.withholding_tax || 0;
            existing.totalNetAmount += s.net_amount || 0;
            existing.settlementCount += 1;

            creatorSummary.set(creatorId, existing);
        });

        const reportData = Array.from(creatorSummary.values());

        // 5. 전체 합계
        const totals = {
            totalAmount: reportData.reduce((sum, r) => sum + r.totalAmount, 0),
            totalFee: reportData.reduce((sum, r) => sum + r.totalFee, 0),
            totalWithholdingTax: reportData.reduce((sum, r) => sum + r.totalWithholdingTax, 0),
            totalNetAmount: reportData.reduce((sum, r) => sum + r.totalNetAmount, 0),
            creatorCount: reportData.length,
            settlementCount: reportData.reduce((sum, r) => sum + r.settlementCount, 0)
        };

        // 6. CSV 형식으로 변환 (요청 시)
        if (format === 'csv') {
            const periodStr = month ? `${year}년 ${month}월` : `${year}년 연간`;
            const headers = [
                '크리에이터명', '핸들', '유형', '실명', '생년월일(앞6자리)', '사업자번호',
                '정산건수', '총 정산금액', '플랫폼 수수료', '원천징수세', '실 지급액'
            ];

            const rows = reportData.map(r => [
                r.displayName,
                `@${r.handle}`,
                r.creatorType === 'business' ? '사업자' : '개인',
                r.realName,
                r.ssnFront,
                r.businessRegistrationNumber || '-',
                r.settlementCount,
                r.totalAmount,
                r.totalFee,
                r.totalWithholdingTax,
                r.totalNetAmount
            ]);

            // 합계 행 추가
            rows.push([
                '합계', '', '', '', '', '',
                totals.settlementCount,
                totals.totalAmount,
                totals.totalFee,
                totals.totalWithholdingTax,
                totals.totalNetAmount
            ]);

            // BOM + CSV 문자열 생성
            const BOM = '\uFEFF';
            const csvContent = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

            return new NextResponse(csvContent, {
                headers: {
                    'Content-Type': 'text/csv; charset=utf-8',
                    'Content-Disposition': `attachment; filename="tax_report_${year}${month ? '_' + month : ''}.csv"`
                }
            });
        }

        // JSON 응답
        return NextResponse.json({
            success: true,
            period: {
                year,
                month,
                start,
                end
            },
            data: reportData,
            totals
        });

    } catch (error) {
        console.error('[Tax Report] 오류:', error);
        return NextResponse.json(
            { error: '세금 보고서 생성 오류', details: String(error) },
            { status: 500 }
        );
    }
}
