// PortOne 결제 모듈
// V2 SDK를 사용한 결제 처리

import * as PortOne from "@portone/browser-sdk/v2";
import { supabase } from "./supabase";

// 환경 변수
const STORE_ID = process.env.NEXT_PUBLIC_PORTONE_STORE_ID || '';
const CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY || '';

// 결제 요청 파라미터 타입
export interface PaymentRequest {
    orderId: string;          // 주문 ID (고유값)
    orderName: string;        // 주문명 (예: "개발하는 민수님에게 후원")
    amount: number;           // 결제 금액
    buyerName: string;        // 구매자 이름
    buyerEmail?: string;      // 구매자 이메일 (선택)
    creatorId: string;        // 크리에이터 ID
    message: string;          // 후원 메시지
    sticker: string;          // 스티커 이모지
    isTipIncluded: boolean;   // 도노트 팁 포함 여부
    tipAmount?: number;       // 도노트 팁 금액 (기본 500원)
}

// 결제 결과 타입
export interface PaymentResult {
    success: boolean;
    paymentId?: string;
    message?: string;
    error?: string;
}

// 고유 주문 ID 생성
export function generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `DONOTE_${timestamp}_${random}`.toUpperCase();
}

// 결제 요청
export async function requestPayment(params: PaymentRequest): Promise<PaymentResult> {
    try {
        // PortOne V2 결제 요청
        const response = await PortOne.requestPayment({
            storeId: STORE_ID,
            channelKey: CHANNEL_KEY,
            paymentId: params.orderId,
            orderName: params.orderName,
            totalAmount: params.amount,
            currency: "CURRENCY_KRW",
            payMethod: "CARD",
            customer: {
                fullName: params.buyerName,
                email: params.buyerEmail,
            },
            customData: {
                creatorId: params.creatorId,
                message: params.message,
                sticker: params.sticker,
                isTipIncluded: params.isTipIncluded,
            },
        });

        // 결제 응답 처리
        if (response?.code) {
            // 오류 발생
            return {
                success: false,
                error: response.message || '결제 중 오류가 발생했습니다.',
            };
        }

        // 결제 성공 - DB에 저장
        const { error: dbError } = await supabase
            .from('donations')
            .insert({
                creator_id: params.creatorId,
                donor_name: params.buyerName,
                donor_email: params.buyerEmail || null,
                amount: params.amount,
                message: params.message,
                sticker: params.sticker,
                is_tip_included: params.isTipIncluded,
                status: 'paid',
                payment_key: response?.paymentId || params.orderId,
                created_at: new Date().toISOString(),
            });

        if (dbError) {
            console.error('결제 정보 저장 오류:', dbError);
            // 결제는 성공했지만 DB 저장 실패
            return {
                success: true,
                paymentId: response?.paymentId || params.orderId,
                message: '결제는 완료되었으나 기록 저장에 실패했습니다. 관리자에게 문의해주세요.',
            };
        }

        return {
            success: true,
            paymentId: response?.paymentId || params.orderId,
            message: '결제가 완료되었습니다!',
        };

    } catch (error) {
        console.error('결제 요청 오류:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.',
        };
    }
}

// 결제 취소 (환불)
export async function cancelPayment(paymentId: string, reason: string): Promise<boolean> {
    try {
        // 실제로는 서버 사이드에서 PortOne API 호출 필요
        // 여기서는 DB 상태만 업데이트
        const { error } = await supabase
            .from('donations')
            .update({ status: 'cancelled' })
            .eq('payment_key', paymentId);

        if (error) {
            console.error('결제 취소 오류:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('결제 취소 오류:', error);
        return false;
    }
}
