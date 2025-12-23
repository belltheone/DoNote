// 포트원 V2 결제 웹훅 API
// 결제 완료, 취소 등 이벤트 발생 시 포트원에서 호출하는 엔드포인트
// 참고: https://developers.portone.io/opi/ko/integration/webhook/readme-v2

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as PortOne from '@portone/server-sdk';

// 동적 라우트로 설정 (빌드 시 실행 방지)
export const dynamic = 'force-dynamic';

// 포트원 API 설정
const PORTONE_API_SECRET = process.env.PORTONE_V2_API_SECRET || process.env.PORTONE_API_SECRET;
const PORTONE_WEBHOOK_SECRET = process.env.PORTONE_WEBHOOK_SECRET;

// V2 웹훅 요청 본문 타입 (2024-04-25 버전)
interface WebhookBodyV2 {
    type: string;           // Transaction.Paid, Transaction.Cancelled 등
    timestamp: string;      // RFC 3339 형식
    data: {
        storeId: string;    // 상점 ID
        paymentId?: string; // 결제 고유 번호 (고객사 채번)
        transactionId?: string; // 포트원 결제 시도 번호
        cancellationId?: string; // 취소 ID (optional)
        billingKey?: string; // 빌링키 (optional)
    };
}

export async function POST(request: Request) {
    // Supabase 클라이언트 초기화 (상단에서)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let logId: string | null = null;

    try {
        // 1. 웹훅 본문 가져오기
        const bodyText = await request.text();
        const body: WebhookBodyV2 = JSON.parse(bodyText);

        console.log('[Webhook V2] 수신:', {
            type: body.type,
            paymentId: body.data?.paymentId,
            timestamp: body.timestamp,
        });

        // 1-1. 웹훅 로그 저장 (수신 즉시)
        const { data: logData, error: logError } = await supabaseAdmin
            .from('webhook_logs')
            .insert({
                event_type: body.type,
                payment_id: body.data?.paymentId || null,
                data: body,
                status: 'received',
            })
            .select('id')
            .single();

        if (logError) {
            console.warn('[Webhook V2] 로그 저장 실패 (무시):', logError.message);
        } else {
            logId = logData?.id;
        }

        // 2. 웹훅 시그니처 검증 (선택사항 - 시크릿이 있는 경우)
        if (PORTONE_WEBHOOK_SECRET) {
            try {
                const headers: Record<string, string> = {};
                request.headers.forEach((value, key) => {
                    headers[key] = value;
                });

                await PortOne.Webhook.verify(
                    PORTONE_WEBHOOK_SECRET,
                    bodyText,
                    headers
                );
                console.log('[Webhook V2] 시그니처 검증 성공');
            } catch (verifyError) {
                console.error('[Webhook V2] 시그니처 검증 실패:', verifyError);
                return NextResponse.json(
                    { error: '웹훅 시그니처 검증 실패' },
                    { status: 400 }
                );
            }
        }

        // 결제 관련 이벤트가 아니면 무시
        if (!body.data?.paymentId) {
            console.log('[Webhook V2] 결제 관련 이벤트 아님:', body.type);
            return NextResponse.json({ status: 'ignored' });
        }

        const { paymentId } = body.data;

        // 3. 포트원 API로 결제 정보 조회 (검증용)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let paymentData: any = null;
        if (PORTONE_API_SECRET) {
            try {
                const apiResponse = await fetch(`https://api.portone.io/payments/${paymentId}`, {
                    headers: {
                        'Authorization': `PortOne ${PORTONE_API_SECRET}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (apiResponse.ok) {
                    paymentData = await apiResponse.json();
                    console.log('[Webhook V2] 포트원 결제 조회:', paymentData?.status);
                }
            } catch (apiError) {
                console.error('[Webhook V2] 포트원 API 오류:', apiError);
            }
        }

        // 5. 이벤트 타입에 따라 처리
        switch (body.type) {
            case 'Transaction.Paid': {
                // 결제 완료
                console.log('[Webhook V2] 결제 완료:', paymentId);

                // donations 테이블에서 해당 결제 찾기
                const { data: donation, error: findError } = await supabaseAdmin
                    .from('donations')
                    .select('*')
                    .eq('payment_id', paymentId)
                    .single();

                if (findError && findError.code !== 'PGRST116') {
                    console.error('[Webhook V2] 후원 조회 오류:', findError);
                }

                if (donation) {
                    // 이미 처리된 건인지 확인
                    if (donation.status === 'completed') {
                        console.log('[Webhook V2] 이미 처리된 결제:', paymentId);
                        return NextResponse.json({ status: 'already_processed' });
                    }

                    // 금액 검증 (포트원 API 응답이 있는 경우)
                    if (paymentData && donation.amount !== paymentData.amount?.total) {
                        console.error('[Webhook V2] 금액 불일치!', {
                            expected: donation.amount,
                            actual: paymentData.amount?.total,
                        });
                        return NextResponse.json(
                            { error: '결제 금액 불일치' },
                            { status: 400 }
                        );
                    }

                    // 결제 완료 상태로 업데이트
                    const { error: updateError } = await supabaseAdmin
                        .from('donations')
                        .update({
                            status: 'completed',
                            paid_at: new Date().toISOString(),
                        })
                        .eq('id', donation.id);

                    if (updateError) {
                        console.error('[Webhook V2] 상태 업데이트 오류:', updateError);
                        throw updateError;
                    }

                    console.log('[Webhook V2] 결제 완료 처리 성공:', donation.id);
                }

                // 로그 상태 업데이트
                if (logId) {
                    await supabaseAdmin
                        .from('webhook_logs')
                        .update({ status: 'processed', processed_at: new Date().toISOString() })
                        .eq('id', logId);
                }

                return NextResponse.json({ status: 'success', message: '결제 완료 처리됨' });
            }

            case 'Transaction.Cancelled':
            case 'Transaction.PartialCancelled': {
                // 결제 취소 (전체/부분)
                console.log('[Webhook V2] 결제 취소:', paymentId);

                const { error: cancelError } = await supabaseAdmin
                    .from('donations')
                    .update({
                        status: 'cancelled',
                        cancelled_at: new Date().toISOString(),
                    })
                    .eq('payment_id', paymentId);

                if (cancelError) {
                    console.error('[Webhook V2] 취소 처리 오류:', cancelError);
                    throw cancelError;
                }

                return NextResponse.json({ status: 'success', message: '결제 취소 처리됨' });
            }

            case 'Transaction.Failed': {
                // 결제 실패
                console.log('[Webhook V2] 결제 실패:', paymentId);

                const { error: failError } = await supabaseAdmin
                    .from('donations')
                    .update({ status: 'failed' })
                    .eq('payment_id', paymentId);

                if (failError) {
                    console.error('[Webhook V2] 실패 처리 오류:', failError);
                }

                return NextResponse.json({ status: 'success', message: '결제 실패 처리됨' });
            }

            case 'Transaction.VirtualAccountIssued': {
                // 가상계좌 발급
                console.log('[Webhook V2] 가상계좌 발급:', paymentId);
                return NextResponse.json({ status: 'success', message: '가상계좌 발급 처리됨' });
            }

            case 'Transaction.Ready': {
                // 결제창 열림 (우리는 처리하지 않음)
                console.log('[Webhook V2] 결제창 열림:', paymentId);
                return NextResponse.json({ status: 'ignored' });
            }

            default:
                console.log('[Webhook V2] 처리하지 않는 이벤트:', body.type);
                return NextResponse.json({ status: 'ignored', type: body.type });
        }

    } catch (error) {
        console.error('[Webhook V2] 처리 오류:', error);

        // 로그 상태를 error로 업데이트
        if (logId) {
            await supabaseAdmin
                .from('webhook_logs')
                .update({
                    status: 'error',
                    error_message: String(error),
                    processed_at: new Date().toISOString(),
                })
                .eq('id', logId);
        }

        return NextResponse.json(
            { error: '웹훅 처리 중 오류 발생', details: String(error) },
            { status: 500 }
        );
    }
}
