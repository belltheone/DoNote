// 동적 OG 이미지 생성
// 크리에이터 페이지용 소셜 미리보기 이미지
// Satori 요구사항: 모든 div는 display: flex 필요

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
    let username = 'unknown';

    try {
        const resolvedParams = await props.params;
        username = resolvedParams.username || 'unknown';
    } catch {
        username = 'error';
    }

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
                <div
                    style={{
                        background: 'white',
                        borderRadius: 32,
                        padding: '60px 100px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ display: 'flex', fontSize: 80, marginBottom: 20 }}>🍩</div>
                    <div style={{ display: 'flex', fontSize: 48, fontWeight: 'bold', color: '#333', marginBottom: 16 }}>
                        @{username}
                    </div>
                    <div style={{ display: 'flex', fontSize: 28, color: '#666' }}>
                        Support this creator
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        position: 'absolute',
                        bottom: 40,
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: 24,
                        fontWeight: 'bold',
                    }}
                >
                    donote.site
                </div>
            </div>
        ),
        { ...size }
    );
}
