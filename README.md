# 🍩 도노트 (DoNote)

> **마음을 적는 가장 가벼운 후원 플랫폼**  
> 크리에이터와 팬을 잇는 따뜻한 디지털-아날로그 후원 서비스

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-green)](https://supabase.com/)
[![PortOne](https://img.shields.io/badge/PortOne-Payment-blue)](https://portone.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📖 소개

도노트(DoNote)는 복잡한 절차 없이 팬들이 크리에이터에게 감사의 마음을 전할 수 있는 마이크로 스폰서십 플랫폼입니다. 편지봉투를 여는 듯한 감성적인 UI와 도넛처럼 달콤한 후원 경험을 제공합니다.

- 💌 **편지 같은 후원**: 단순 송금이 아닌, 마음을 담은 메시지와 스티커 전달
- 🍩 **도넛 같은 응원**: 부담 없는 소액 후원과 500원 팁 문화
- 📺 **방송 연동**: OBS 위젯을 통한 실시간 방송 알림 및 TTS

## ✨ 주요 기능 (구현 완료)

### 1. 크리에이터 대시보드
- **종합 분석 (Analytics)**: 최근 7일/30일 후원 추이를 차트로 시각화 (Recharts)
- **메시지 월 (Messsage Wall)**: 팬들이 보낸 후원 메시지를 포스트잇 형태로 관리 및 고정
- **수확하기 (Settlement)**: 수익금 정산 요청 및 이력 관리 (반자동 시스템)
- **위젯 설정**: OBS 알림, 프로필 QR 코드, 임베드 배지 커스터마이징

### 2. 정산 시스템 (Settlement)
크리에이터 수익 창출을 위한 투명하고 안전한 정산 시스템을 구축했습니다.
- **반자동 정산 프로세스**: `정보 입력` → `정산 요청` → `관리자 승인` → `지급 완료`
- **세법 준수**: 원천징수(3.3%) 신고를 위한 필수 정보 수집 (실명, 주민등록번호, 주소)
- **보안**: 주민등록번호 뒷자리 및 계좌번호 등 민감 정보 암호화 저장 (Supabase AES)

> **💡 정산 정보 안내**
>
> 대한민국 소득세법에 따라 원천징수 이행을 위해 다음 정보가 필수적으로 요구됩니다:
> - **성명 (실명)**: 예금주와 일치해야 함
> - **주민등록번호**: 국세청 거주자 사업소득 지급명세서 제출용
> - **주소**: 지방소득세 납세지 기준
> - **계좌 정보**: 본인 명의 계좌 필수 (오입금 방지)

### 3. 후원 페이지 & 결제
- **개인화 페이지**: `donote.site/donate/[username]` 형태의 전용 후원 페이지
- **간편 결제**: PortOne V2 연동으로 카카오페이, 토스페이 등 지원
- **소통 강화**: 메시지 작성, 닉네임 설정, 감정 표현 스티커 선택
- **팁(Tip) 기능**: 플랫폼 운영을 돕는 "도노트에게 500원 팁 주기" 옵션

### 4. 방송용 위젯 (OBS)
- **실시간 알림**: 후원 발생 시 즉시 화면에 도넛 애니메이션과 메시지 표시
- **TTS 지원**: 후원 메시지 음성 읽어주기 기능
- **커스터마이징**: 알림 지속 시간, 소리 크기 등 설정 가능

## 🛠 기술 스택

| 분류 | 기술 | 비고 |
| :--- | :--- | :--- |
| **Framework** | Next.js 15.1 (App Router) | React 19, Turbopack |
| **Language** | TypeScript | 엄격한 타입 체크 |
| **Styling** | Tailwind CSS | 다크모드, 반응형 디자인 |
| **Animation** | Framer Motion | 페이지 전환, 인터랙션 |
| **Backend / Auth** | Supabase | PostgreSQL, Auth, RLS, Edge Functions |
| **Payment** | PortOne V2 | 결제 연동 및 검증 |
| **State** | Zustand | 전역 상태 관리 (인증, 위젯 설정) |
| **Image** | Next/Image, Next/OG | 이미지 최적화, 동적 OG 이미지 생성 |

## 🚀 설치 및 실행 방법

### 환경 변수 설정 (.env.local)
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수를 설정하세요.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PORTONE_STORE_ID=your_store_id
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=your_channel_key
PORTONE_API_SECRET=your_api_secret
```

### 개발 서버 실행

```bash
# 1. 저장소 클론
git clone https://github.com/belltheone/DoNote.git
cd DoNote

# 2. 의존성 설치
npm install

# 3. 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── (public)/           # 랜딩, 소개 등 공개 페이지
│   ├── admin/              # 관리자 대시보드 (정산 승인 등)
│   ├── auth/               # 로그인, 회원가입
│   ├── dashboard/          # 크리에이터 전용 공간 (메시지, 정산, 설정)
│   ├── donate/[username]/  # 후원 페이지 (메타데이터, OG 이미지 포함)
│   ├── obs/[username]/     # OBS 브라우저 소스용 페이지
│   └── api/                # Next.js API Routes (결제 검증 등)
├── components/             # 재사용 가능한 UI 컴포넌트
├── lib/                    # 유틸리티, Supabase 클라이언트, 결제 로직
├── store/                  # Zustand 스토어
└── types/                  # TypeScript 타입 정의
```

## 👥 기여 방법 (Contribution)

이 프로젝트에 기여하고 싶으신가요?
1. 이슈(Issue)를 등록하여 버그나 기능을 제안해주세요.
2. 프로젝트를 Fork 하고, 새로운 브랜치에서 작업하세요.
3. Pull Request(PR)를 보내주시면 검토 후 병합합니다.

## 📄 라이선스

MIT License © 2024 DoNote Team.
자유롭게 수정 및 배포가 가능합니다.

---

<p align="center">
  Made with 🍩 and ❤️ in Korea
</p>
