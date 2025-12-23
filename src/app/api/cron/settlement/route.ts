// 자동 정산 Cron Job API
// Vercel Cron Job으로 매월 지정일에 실행
// vercel.json에 cron 설정 필요

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 동적 라우트로 설정 (빌드 시 실행 방지)
export const dynamic = 'force-dynamic';

// Cron 인증 확인
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
    try {
        // Cron 인증 확인
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Supabase Admin Client (런타임에 초기화)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        console.log('[Auto Settlement] 자동 정산 작업 시작...');

        // 1. 정산 정보가 등록된 크리에이터 목록 조회
        const { data: settlementInfos, error: infoError } = await supabaseAdmin
            .from('settlement_info')
            .select('*');

        if (infoError) {
            console.error('[Auto Settlement] 정산 정보 조회 오류:', infoError);
            throw infoError;
        }

        if (!settlementInfos || settlementInfos.length === 0) {
            console.log('[Auto Settlement] 정산 가능한 크리에이터가 없습니다.');
            return NextResponse.json({
                success: true,
                message: '정산 가능한 크리에이터 없음',
                processed: 0
            });
        }

        const FEE_RATE = 0.05; // 5% 수수료
        const MIN_SETTLEMENT_AMOUNT = 10000; // 최소 정산 금액

        let processedCount = 0;
        let totalSettledAmount = 0;
        const errors: string[] = [];

        for (const info of settlementInfos) {
            try {
                const creatorId = info.creator_id;

                // 2. 해당 크리에이터의 총 후원금 계산
                const { data: donations, error: donationError } = await supabaseAdmin
                    .from('donations')
                    .select('amount')
                    .eq('creator_id', creatorId)
                    .eq('status', 'completed');

                if (donationError) throw donationError;

                const totalDonations = donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;

                // 3. 기존 정산된 금액 계산
                const { data: settlements, error: settlementError } = await supabaseAdmin
                    .from('settlements')
                    .select('amount')
                    .eq('creator_id', creatorId)
                    .neq('status', 'rejected');

                if (settlementError) throw settlementError;

                const settledAmount = settlements?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;

                // 4. 정산 가능 금액 계산
                const availableAmount = totalDonations - settledAmount;

                // 5. 최소 금액 미만이면 스킵 (이월)
                if (availableAmount < MIN_SETTLEMENT_AMOUNT) {
                    console.log(`[Auto Settlement] ${creatorId}: ₩${availableAmount} (최소 미달, 이월)`);
                    continue;
                }

                // 6. 수수료 계산
                const fee = Math.round(availableAmount * FEE_RATE);
                const netAmount = availableAmount - fee;

                // 7. 정산 레코드 생성
                const { error: insertError } = await supabaseAdmin
                    .from('settlements')
                    .insert({
                        creator_id: creatorId,
                        amount: availableAmount,
                        fee: fee,
                        net_amount: netAmount,
                        status: 'approved', // 자동 정산은 바로 승인 상태
                        requested_at: new Date().toISOString(),
                    });

                if (insertError) throw insertError;

                processedCount++;
                totalSettledAmount += netAmount;
                console.log(`[Auto Settlement] ${creatorId}: ₩${availableAmount} → ₩${netAmount} (수수료 ₩${fee})`);

                // TODO: 이메일 알림 발송
                // await sendSettlementNotificationEmail(info.email, netAmount);

            } catch (err) {
                const errorMsg = `${info.creator_id}: ${err}`;
                console.error('[Auto Settlement] 개별 처리 오류:', errorMsg);
                errors.push(errorMsg);
            }
        }

        console.log(`[Auto Settlement] 완료: ${processedCount}명, 총 ₩${totalSettledAmount}`);

        return NextResponse.json({
            success: true,
            message: '자동 정산 완료',
            processed: processedCount,
            totalSettledAmount: totalSettledAmount,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('[Auto Settlement] 전체 오류:', error);
        return NextResponse.json(
            { error: '자동 정산 처리 중 오류 발생', details: String(error) },
            { status: 500 }
        );
    }
}
