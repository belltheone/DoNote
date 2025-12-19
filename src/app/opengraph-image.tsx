// 기본 OG 이미지 생성
// 랜딩 페이지 및 일반 페이지용

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD95A 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* 메인 카드 */}
                <div
                    style={{
                        background: 'white',
                        borderRadius: '32px',
                        padding: '60px 100px',
                        boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* 로고 */}
                    <div
                        style={{
                            fontSize: '100px',
                            marginBottom: '20px',
                        }}
                    >
                        🍩
                    </div>

                    {/* 타이틀 */}
                    <div
                        style={{
                            fontSize: '56px',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '16px',
                        }}
                    >
                        도노트 (Donote)
                    </div>

                    {/* 서브타이틀 */}
                    <div
                        style={{
                            fontSize: '32px',
                            color: '#666',
                        }}
                    >
                        마음을 적는 가장 가벼운 후원
                    </div>
                </div>

                {/* 하단 특징 */}
                <div
                    style={{
                        display: 'flex',
                        gap: '40px',
                        marginTop: '50px',
                    }}
                >
                    {['💳 토스페이 결제', '💌 감성 편지', '🎫 위젯 제공'].map((text, i) => (
                        <div
                            key={i}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '12px',
                                padding: '12px 24px',
                                color: 'white',
                                fontSize: '20px',
                                fontWeight: 'bold',
                            }}
                        >
                            {text}
                        </div>
                    ))}
                </div>

                {/* 브랜딩 */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        fontSize: '28px',
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: 'bold',
                    }}
                >
                    donote.site
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
