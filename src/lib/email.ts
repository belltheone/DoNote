// 이메일 서비스 - Resend 연동
// 새 후원 도착 알림, 정산 완료 알림 등

import { Resend } from "resend";

// Resend 인스턴스 생성
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

// 발신자 이메일
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@donote.site";

// 이메일 전송 결과 타입
interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

/**
 * 새 후원 도착 알림 이메일 발송
 */
export async function sendDonationNotification({
    creatorEmail,
    creatorName: _creatorName,
    donorName,
    amount,
    message,
    sticker,
}: {
    creatorEmail: string;
    creatorName: string;
    donorName: string;
    amount: number;
    message: string;
    sticker: string;
}): Promise<EmailResult> {
    if (!resend) {
        console.log("Resend API 키가 설정되지 않았습니다.");
        return { success: false, error: "Email service not configured" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `도노트 <${FROM_EMAIL}>`,
            to: creatorEmail,
            subject: `🍩 새로운 후원이 도착했어요! - ${donorName}님의 마음`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #FF6B6B, #FFD95A); border-radius: 12px; color: white; }
                        .content { background: #FFFACD; border-radius: 12px; padding: 30px; margin-top: 20px; }
                        .sticker { font-size: 48px; text-align: center; margin-bottom: 20px; }
                        .message { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #FF6B6B; }
                        .amount { text-align: center; font-size: 24px; color: #FF6B6B; font-weight: bold; margin: 20px 0; }
                        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
                        .button { display: inline-block; background: #FF6B6B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🍩 새로운 후원이 도착했어요!</h1>
                        </div>
                        <div class="content">
                            <div class="sticker">${sticker}</div>
                            <p><strong>${donorName}</strong>님이 후원을 보내셨어요!</p>
                            <div class="message">
                                <p>"${message}"</p>
                            </div>
                            <div class="amount">₩${amount.toLocaleString()}</div>
                            <div style="text-align: center;">
                                <a href="https://www.donote.site/dashboard" class="button">대시보드에서 확인하기</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>이 이메일은 도노트(Donote)에서 자동으로 발송되었습니다.</p>
                            <p>수신을 원하지 않으시면 대시보드 설정에서 알림을 끌 수 있습니다.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error("이메일 전송 실패:", error);
            return { success: false, error: error.message };
        }

        return { success: true, messageId: data?.id };
    } catch (err) {
        console.error("이메일 전송 오류:", err);
        return { success: false, error: String(err) };
    }
}

/**
 * 정산 완료 알림 이메일 발송
 */
export async function sendSettlementNotification({
    creatorEmail,
    creatorName,
    amount,
    bankInfo,
}: {
    creatorEmail: string;
    creatorName: string;
    amount: number;
    bankInfo: string;
}): Promise<EmailResult> {
    if (!resend) {
        return { success: false, error: "Email service not configured" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `도노트 <${FROM_EMAIL}>`,
            to: creatorEmail,
            subject: `💰 정산이 완료되었어요! - ₩${amount.toLocaleString()}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #4ECDC4, #45B7D1); border-radius: 12px; color: white; }
                        .content { background: #E8F5E9; border-radius: 12px; padding: 30px; margin-top: 20px; }
                        .amount { text-align: center; font-size: 32px; color: #4ECDC4; font-weight: bold; margin: 20px 0; }
                        .bank-info { background: white; padding: 20px; border-radius: 8px; text-align: center; }
                        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>💰 정산이 완료되었어요!</h1>
                        </div>
                        <div class="content">
                            <p>${creatorName}님, 정산금이 입금되었습니다!</p>
                            <div class="amount">₩${amount.toLocaleString()}</div>
                            <div class="bank-info">
                                <p><strong>입금 계좌</strong></p>
                                <p>${bankInfo}</p>
                            </div>
                        </div>
                        <div class="footer">
                            <p>이 이메일은 도노트(Donote)에서 자동으로 발송되었습니다.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, messageId: data?.id };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

/**
 * 환영 이메일 발송
 */
export async function sendWelcomeEmail({
    email,
    name,
    handle,
}: {
    email: string;
    name: string;
    handle: string;
}): Promise<EmailResult> {
    if (!resend) {
        return { success: false, error: "Email service not configured" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `도노트 <${FROM_EMAIL}>`,
            to: email,
            subject: `🎉 ${name}님, 도노트에 오신 걸 환영해요!`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #FF6B6B, #FFD95A); border-radius: 12px; color: white; }
                        .content { background: white; border-radius: 12px; padding: 30px; margin-top: 20px; border: 2px dashed #FFD95A; }
                        .link { display: inline-block; background: #FF6B6B; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; margin: 20px 0; font-weight: bold; }
                        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🍩 도노트에 오신 걸 환영해요!</h1>
                        </div>
                        <div class="content">
                            <h2>${name}님, 반가워요! 🎉</h2>
                            <p>도노트(Donote)에 가입해주셔서 감사합니다.</p>
                            <p>이제 팬들에게 후원을 받을 수 있어요!</p>
                            <p><strong>나만의 후원 페이지:</strong></p>
                            <p><a href="https://www.donote.site/${handle}">donote.site/${handle}</a></p>
                            <div style="text-align: center;">
                                <a href="https://www.donote.site/dashboard" class="link">대시보드로 이동</a>
                            </div>
                        </div>
                        <div class="footer">
                            <p>이 이메일은 도노트(Donote)에서 자동으로 발송되었습니다.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, messageId: data?.id };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}
