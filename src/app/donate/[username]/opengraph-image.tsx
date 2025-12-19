// 동적 OG 이미지 생성
// 크리에이터 페이지용 소셜 미리보기 이미지

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// 이미지 크기 설정  
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

// OG 이미지 생성 함수
export default async function OGImage(props: {
    params: Promise<{ username: string }>
}) {
    const { username } = await props.params;

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
                }}
            >
                <div
                    style={{
                        background: 'white',
                        borderRadius: 24,
                        padding: '48px 64px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ fontSize: 72, marginBottom: 16 }}>🍩</div>
                    <div style={{ fontSize: 42, fontWeight: 700, color: '#333', marginBottom: 8 }}>
                        @{username}
                    </div>
                    <div style={{ fontSize: 24, color: '#666', marginBottom: 24 }}>
                        님에게 후원하기
                    </div>
                    <div
                        style={{
                            background: '#FF6B6B',
                            borderRadius: 12,
                            padding: '12px 32px',
                            color: 'white',
                            fontSize: 20,
                            fontWeight: 600,
                        }}
                    >
                        💌 쪽지 보내기
                    </div>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        bottom: 32,
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: 22,
                        fontWeight: 600,
                    }}
                >
                    donote.site
                </div>
            </div>
        ),
        { ...size }
    );
}
