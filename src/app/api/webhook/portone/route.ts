// 포트원 결제 웹훅 API
// 결제 완료, 취소 등 이벤트 발생 시 포트원에서 호출하는 엔드포인트
// 참고: https://developers.portone.io/opi/ko/integration/webhook/readme-v1

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 동적 라우트로 설정 (빌드 시 실행 방지)
export const dynamic = 'force-dynamic';

// 포트원 API 설정
const PORTONE_API_SECRET = process.env.PORTONE_API_SECRET;

// 웹훅 요청 본문 타입
interface WebhookBody {
    imp_uid: string;      // 포트원 결제 고유번호
    merchant_uid: string; // 주문번호
    status: 'ready' | 'paid' | 'cancelled' | 'failed'; // 결제 상태
    cancellation_id?: string; // 취소 시 취소 ID
}

// 포트원 액세스 토큰 발급
async function getPortOneAccessToken(): Promise<string> {
    const response = await fetch('https://api.iamport.kr/users/getToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            imp_key: process.env.NEXT_PUBLIC_PORTONE_IMP_CODE,
            imp_secret: PORTONE_API_SECRET,
        }),
    });

    const data = await response.json();
    if (data.code !== 0) {
        throw new Error(`포트원 토큰 발급 실패: ${data.message}`);
    }
    return data.response.access_token;
}

// 포트원에서 결제 정보 조회
async function getPaymentData(impUid: string, accessToken: string) {
    const response = await fetch(`https://api.iamport.kr/payments/${impUid}`, {
        headers: { 'Authorization': accessToken },
    });

    const data = await response.json();
    if (data.code !== 0) {
        throw new Error(`결제 정보 조회 실패: ${data.message}`);
    }
    return data.response;
}

export async function POST(request: Request) {
    try {
        // 1. 웹훅 요청 본문 파싱
        const body: WebhookBody = await request.json();
        const { imp_uid, merchant_uid, status } = body;

        console.log('[Webhook] 수신:', { imp_uid, merchant_uid, status });

        // 필수 값 확인
        if (!imp_uid || !merchant_uid) {
            return NextResponse.json(
                { error: 'imp_uid와 merchant_uid가 필요합니다.' },
                { status: 400 }
            );
        }

        // 2. 포트원에서 실제 결제 정보 조회 (웹훅 검증)
        const accessToken = await getPortOneAccessToken();
        const paymentData = await getPaymentData(imp_uid, accessToken);

        console.log('[Webhook] 결제 정보:', {
            imp_uid: paymentData.imp_uid,
            amount: paymentData.amount,
            status: paymentData.status,
        });

        // 3. Supabase 클라이언트 초기화
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 4. 결제 상태에 따라 처리
        switch (paymentData.status) {
            case 'paid': {
                // 결제 완료 처리
                console.log('[Webhook] 결제 완료 처리:', merchant_uid);

                // merchant_uid에서 정보 추출 (형식: donation_{creatorId}_{timestamp})
                const parts = merchant_uid.split('_');
                if (parts.length < 3 || parts[0] !== 'donation') {
                    console.log('[Webhook] 후원 결제가 아닌 건:', merchant_uid);
                    return NextResponse.json({ status: 'ignored', message: '후원 결제가 아님' });
                }

                // donations 테이블에서 해당 주문 확인 및 상태 업데이트
                const { data: donation, error: findError } = await supabaseAdmin
                    .from('donations')
                    .select('*')
                    .eq('payment_id', imp_uid)
                    .single();

                if (findError && findError.code !== 'PGRST116') {
                    console.error('[Webhook] 후원 조회 오류:', findError);
                }

                if (donation) {
                    // 이미 결제된 건인지 확인
                    if (donation.status === 'completed') {
                        console.log('[Webhook] 이미 처리된 결제:', imp_uid);
                        return NextResponse.json({ status: 'already_processed' });
                    }

                    // 금액 검증
                    if (donation.amount !== paymentData.amount) {
                        console.error('[Webhook] 금액 불일치!', {
                            expected: donation.amount,
                            actual: paymentData.amount,
                        });
                        return NextResponse.json(
                            { error: '결제 금액 불일치 - 위변조 의심' },
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
                        console.error('[Webhook] 상태 업데이트 오류:', updateError);
                        throw updateError;
                    }

                    console.log('[Webhook] 결제 완료 처리 성공:', donation.id);
                } else {
                    // 새로운 후원 건 생성 (클라이언트에서 미리 생성하지 않은 경우)
                    console.log('[Webhook] 새 후원 건 - 미구현');
                }

                return NextResponse.json({
                    status: 'success',
                    message: '결제 완료 처리됨',
                });
            }

            case 'cancelled': {
                // 결제 취소 처리
                console.log('[Webhook] 결제 취소 처리:', merchant_uid);

                const { error: cancelError } = await supabaseAdmin
                    .from('donations')
                    .update({
                        status: 'cancelled',
                        cancelled_at: new Date().toISOString(),
                    })
                    .eq('payment_id', imp_uid);

                if (cancelError) {
                    console.error('[Webhook] 취소 처리 오류:', cancelError);
                    throw cancelError;
                }

                return NextResponse.json({
                    status: 'success',
                    message: '결제 취소 처리됨',
                });
            }

            case 'ready': {
                // 가상계좌 발급 (현재 미사용)
                console.log('[Webhook] 가상계좌 발급:', merchant_uid);
                return NextResponse.json({
                    status: 'success',
                    message: '가상계좌 발급 처리됨',
                });
            }

            case 'failed': {
                // 결제 실패
                console.log('[Webhook] 결제 실패:', merchant_uid);

                const { error: failError } = await supabaseAdmin
                    .from('donations')
                    .update({ status: 'failed' })
                    .eq('payment_id', imp_uid);

                if (failError) {
                    console.error('[Webhook] 실패 처리 오류:', failError);
                }

                return NextResponse.json({
                    status: 'success',
                    message: '결제 실패 처리됨',
                });
            }

            default:
                console.log('[Webhook] 알 수 없는 상태:', paymentData.status);
                return NextResponse.json({
                    status: 'unknown',
                    message: `처리되지 않은 상태: ${paymentData.status}`,
                });
        }

    } catch (error) {
        console.error('[Webhook] 처리 오류:', error);
        return NextResponse.json(
            { error: '웹훅 처리 중 오류 발생', details: String(error) },
            { status: 500 }
        );
    }
}
