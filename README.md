# 🍩 도노트 (Donote)

> 마음을 적는 가장 가벼운 후원 플랫폼

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/belltheone/DoNote)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📖 소개

도노트는 크리에이터와 팬을 연결하는 한국형 마이크로 스폰서십 플랫폼입니다.

- 💌 **편지처럼** - 단순 송금이 아닌 마음을 담은 메시지
- 🍩 **도넛처럼** - 가볍지만 달콤한 응원
- 🎫 **티켓처럼** - 어디서든 예쁜 배지로 후원 유도

## ✨ 주요 기능

### 크리에이터용
- 📝 **메시지 월** - 포스트잇 스타일의 후원 메시지 관리
- 📊 **분석 대시보드** - 시간대별 통계, 팬 랭킹
- 🎫 **위젯 생성기** - 블로그/GitHub용 임베드 위젯
- 🍯 **수확하기** - 간편한 정산 시스템

### 후원자용
- ✍️ **쪽지 쓰기** - 회원가입 없이 10초 후원
- 🎨 **스티커 선택** - 마음을 표현하는 이모지 스티커
- 💳 **간편 결제** - 토스페이 등 간편결제 지원

### 스트리머용
- 📺 **OBS 오버레이** - 실시간 알림 + 도넛 애니메이션

## 🛠 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Auth**: Supabase (예정)
- **Payment**: PortOne (예정)

## 🚀 시작하기

```bash
# 저장소 클론
git clone https://github.com/belltheone/DoNote.git
cd DoNote

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인하세요.

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── auth/               # 로그인 페이지
│   ├── dashboard/          # 크리에이터 대시보드
│   │   ├── messages/       # 메시지 월
│   │   ├── analytics/      # 분석
│   │   ├── settlement/     # 정산
│   │   ├── widget/         # 위젯 생성
│   │   └── settings/       # 설정
│   ├── [username]/         # 크리에이터 페이지
│   ├── donate/[username]/  # 후원 페이지
│   ├── obs/[username]/     # OBS 오버레이
│   └── widget/             # 위젯 데모
├── lib/
│   └── supabase.ts         # Supabase 클라이언트
└── types/
    └── global.d.ts         # 타입 선언
public/
└── widget/
    └── sdk.js              # 임베드 위젯 SDK
```

## 🎨 디자인 컨셉

**Digital Analog** - 디지털에서 아날로그의 따뜻함을 전달

- 📝 종이 질감의 배경
- 📌 포스트잇 스타일 카드
- 🎫 티켓 형태 위젯
- 🍯 수확하기 (정산) 컨셉

## 📱 페이지 미리보기

| 랜딩페이지 | 크리에이터 대시보드 | OBS 오버레이 |
|:---------:|:------------------:|:------------:|
| 3D 편지봉투 | 메시지 월 | 도넛 애니메이션 |
| 실시간 티커 | 분석 차트 | 실시간 알림 |

## 🔧 위젯 사용법

```html
<!-- SDK 로드 -->
<script src="https://donote.kr/widget/sdk.js"></script>

<!-- 위젯 삽입 -->
<donote-widget 
  handle="your-handle" 
  style-type="ticket" 
  theme="yellow"
  text="커피 한 잔 ☕">
</donote-widget>
```

또는 JavaScript API:

```javascript
Donote.create('#container', {
  handle: 'your-handle',
  style: 'button',
  theme: 'coral',
  text: '응원하기 💌'
});
```

## 📄 라이선스

MIT License - 자유롭게 사용하세요!

## 👥 기여

이슈와 PR은 언제나 환영합니다! 🎉

---

Made with 💌 in Korea
