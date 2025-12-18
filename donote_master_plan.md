[Project] Donote: High-Fidelity Micro-Patronage Platform
Version: 1.0 (Kick-off Release)
App Name: 도노트 (Donote)
Repositories: donote_web (Platform), donote_sdk (Embeddable Widget)
Target Platform: Web (Responsive) / Widget (Cross-Site Embed)
Development Partner: Claude 3.7 (Strategic Architect)
Audience: Stakeholders, Principal Engineers, Brand Directors, Growth Leads

Executive Summary
1.1 Product Vision
**Donote(도노트)**는 차가운 핀테크 송금 시스템을 따뜻한 아날로그 감성으로 재해석한 **'감성 기반 마이크로 후원 플랫폼'**입니다.
'Donation(후원)'과 'Note(쪽지)'의 합성어인 이름처럼, 단순히 금전적 가치만 전달하는 것이 아니라, 크리에이터와 팬 사이의 **'정서적 연결(Emotional Connection)'**을 기술적으로 구현합니다.

1.2 Strategic Objectives

Emotional Fintech: 송금 행위를 '편지 쓰기'와 '선물하기' 경험으로 치환하여 결제 저항감(Payment Friction) 최소화.

Viral Engineering: "나도 달고 싶다"는 욕구를 자극하는 고감도 위젯을 통해 마케팅 비용 없이 유기적 성장(Organic Growth) 달성.

Seamless Checkout: 회원가입 없는 10초 게스트 결제(Guest Checkout) 시스템으로 이탈률 0% 도전.

Brand Identity & Creative Strategy
"Sending Warmth, Not Just Funds" (돈이 아닌 온기를 보냅니다)

2.1 Brand Philosophy (Essence)

Mission: 모든 창작자가 자신의 가치를 인정받고, 팬들의 응원을 시각적으로 체감할 수 있는 '디지털 우체통'을 만든다.

Core Values:

Analog Texture (질감): 종이, 연필, 테이프 등 아날로그 물성을 디지털로 완벽하게 구현.

Lightness (가벼움): 부담 없는 소액, 부담 없는 절차.

Visibility (시각화): 보이지 않는 마음(후원)을 쌓이는 쪽지(Note)로 시각화.

2.2 Visual Identity System (VIS)

2.2.1 Logo Design Concept: "The Sealed Promise"

Symbol: 도넛 모양의 **'Sealing Wax(실링 왁스)'**가 찍힌 편지봉투. 후원의 안전함과 소중함을 상징.

Wordmark: 잉크가 번진 듯한 부드러운 Serif 서체와 모던한 San-Serif의 조화.

2.2.2 Color System (Palette)

Primary Color: Cream Yellow (#FFD95A) - 포스트잇, 따뜻한 조명.

Accent Color: Coral Pink (#FF6B6B) - 도넛 토핑, 하트, 강조점.

Background: Paper White (#F9F9F9) - 눈이 편안한 미색지.

2.2.3 Graphic Motifs

The Wall: 핀터레스트 스타일의 메이슨리(Masonry) 레이아웃.

Stationery: 마스킹 테이프, 클립, 우표 등의 스큐어모피즘(Skeuomorphism) 요소.

2.3 Verbal Identity (Tone & Manner)

Persona: "The Warm Postman" (따뜻한 소식을 전하는 우체부).

Voice: 감성적이고 위트 있는 (Sentimental & Witty). 예: "결제" 대신 "마음 보내기", "정산" 대신 "수확하기".

Project Structure & Repository Strategy
3.1 Repository Architecture (Monorepo Strategy recommended)

Root Directory: Donote_Project/

apps/web: Next.js 기반의 메인 플랫폼 (크리에이터 페이지, 대시보드).

packages/widget: 외부 사이트 임베딩용 경량 JS SDK (Shadow DOM 활용).

packages/ui: 공통 디자인 시스템 (Tailwind + Framer Motion).

Web Platform Specification (Detailed)
4.1 SEO & Discoverability Strategy

Domain Strategy: donote.kr (Main), donote.io (Global expansion ready).

Technical SEO: SSR 기반의 동적 메타 태그 생성 (크리에이터별 페이지가 OG Image로 생성되어 공유 최적화).

Keyword Strategy: "개발자 커피", "블로그 후원 버튼", "Velog 후원", "티스토리 수익".

4.2 Landing Page Strategy (Interactive Storytelling)
방문자가 스크롤을 내리며 '편지 한 통'을 완성하는 경험을 제공합니다.

4.2.1 Hero Section (The Hook)

Headline: "당신의 글이 누군가에게는 영감이 되었습니다."

Visual: 화면 중앙에 거대한 3D 종이 질감의 편지봉투. 마우스 움직임에 따라 시차(Parallax) 효과로 열리며 도넛과 쪽지들이 쏟아져 나옴.

CTA: [내 우체통 만들기] (소셜 로그인으로 3초 만에 생성).

4.2.2 Feature Showcase (Problem & Solution)

Scenario: * Problem: 딱딱한 계좌번호 텍스트 3333-xx-xxxx... (복사하기도 귀찮음).

Solution: 예쁜 Donote 위젯 클릭 -> 감성적인 편지지 모달 팝업.

Visual: 계좌번호 텍스트가 펑! 터지며 예쁜 위젯으로 변신하는 모션 그래픽.

4.2.3 Social Proof (Live Wall)

Ticker: "방금 OO님이 도넛 3개를 선물했어요! 🍩" (실시간 웹소켓 알림).

Gallery: 유명 개발자, 디자이너들이 실제 사용 중인 '커스텀 위젯' 갤러리 전시.

4.2.4 Pricing (The Tip Model)

Creator Fee: 0% (Platform Fee) + PG Fee only. (파격적 제안).

Sustain Model: 후원자가 결제 시 "도노트 팀에게 커피 한 잔(500원) 더 쏘기" 옵션(기본 체크)으로 수익 창출.

4.3 User Portal (Creator Dashboard)

Message Wall: 받은 쪽지들을 드래그 앤 드롭으로 정리하고, 'Best 쪽지'를 핀으로 고정(Pinning).

Analytics: 단순 금액이 아닌 "가장 많이 후원받은 시간대", "최고의 팬" 등 인사이트 제공.

Settlement: 토스/카카오페이 인증을 통한 간편 실명 인증 및 1클릭 정산 신청.

Core Service & Widget Specification
5.1 Embeddable Widget Engine (packages/widget)

Tech: Vanilla JS + Web Components (Shadow DOM)으로 스타일 충돌 원천 봉쇄.

Performance: Gzip 기준 5kb 미만의 초경량 SDK. Lazy Loading 적용.

Customization: 크리에이터가 색상, 문구("커피 한잔" vs "맥주 한잔"), 모양(티켓형, 버튼형) 커스터마이징 가능.

5.2 OBS / Stream Overlay

Realtime: Supabase Realtime 구독을 통해 후원 발생 시 0.5초 내 방송 화면 송출.

Animation: 도넛이 화면 위에서 떨어져 쌓이는 물리 엔진(Matter.js) 적용 오버레이.

Technical Architecture & Stack
6.1 Frontend Architecture (Vercel)

Framework: Next.js 14 (App Router).

Styling: Tailwind CSS (Utility-first), Framer Motion (Micro-interactions).

State Management: Zustand (Global), TanStack Query (Server State).

Icons: Lucide React + Custom SVG Assets.

6.2 Backend & Data Layer (Supabase)

Database: PostgreSQL 15+.

Auth: Social Login Only (Kakao, Google, Github). 이메일 가입 제거로 진입 장벽 낮춤.

Storage: 크리에이터 프로필 이미지, 감사 GIF 저장.

Edge Functions: 결제 검증(Webhook), 알림 발송 등 서버리스 로직 처리.

6.3 Payment Gateway (Agile Integration)

Provider: PortOne (V2 API).

Methods: 카카오페이, 토스페이, 네이버페이, 삼성페이 (카드 번호 입력 UX 배제).

Flow: 비회원 결제(Guest Checkout) 프로세스 최적화.

Deployment & DevOps Pipeline
7.1 CI/CD Strategy

Platform: Vercel (Frontend & Edge Functions).

Workflow:

Feature Branch -> PR -> Preview Deployment (UI 검수).

Main Branch -> Production Deployment.

Monitoring: Sentry (Error Tracking), Vercel Analytics (User Behavior).

Data Schema (PostgreSQL)

-- 크리에이터 프로필 (확장성 고려)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  handle TEXT UNIQUE NOT NULL, -- donote.kr/@handle
  display_name TEXT NOT NULL,
  bio TEXT,
  theme_config JSONB DEFAULT '{}', -- 위젯 커스텀 설정
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 후원 트랜잭션 (원장)
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id),
  donor_name TEXT NOT NULL, -- 비회원일 경우 입력값
  donor_email TEXT, -- 선택적 수집
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'KRW',
  message TEXT, -- 응원 메시지
  sticker_id TEXT, -- 사용한 스티커 ID
  is_tip_included BOOLEAN DEFAULT FALSE, -- 플랫폼 팁 포함 여부
  status TEXT DEFAULT 'pending', -- pending, paid, cancelled
  pg_tx_id TEXT, -- PG사 거래 고유 번호
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 정산 원장
CREATE TABLE public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id),
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'requested', -- requested, processing, completed
  bank_info JSONB, -- 암호화된 계좌 정보
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);


Implementation Roadmap (Fast-Track)
Phase 1: Brand & Core MVP (Weeks 1-3)

Goal: 디자인 시스템 확립 및 "결제가 되는" 랜딩 페이지 배포.

W1: 로고/BI 확정, UI Kit(Figma) 제작, DB 스키마 설계.

W2: Next.js 보일러플레이트, 카카오 로그인 연동, Supabase 세팅.

W3: PortOne 연동, 비회원 결제 로직 구현, 마이페이지(수신함) 기초 구현.

Phase 2: The Widget & Viral Loop (Weeks 4-5)

Goal: 남의 블로그에 달 수 있는 "위젯" 개발.

W4: donote_sdk 개발 (Iframe/Shadow DOM), 임베드 코드 생성기 구현.

W5: 위젯 디자인 3종(기본, 티켓, 미니) 구현, OBS 오버레이 프로토타입.

Phase 3: Polish & Launch (Weeks 6-7)

Goal: 디테일(애니메이션) 보강 및 정식 오픈.

W6: 프론트엔드 인터랙션(Framer Motion) 고도화, 모바일 반응형 최적화.

W7: QA(결제 테스트), 정산 어드민 개발, Product Hunt 및 국내 커뮤니티 런칭.