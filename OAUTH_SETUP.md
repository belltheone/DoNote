# DoNote OAuth 설정 가이드

DoNote에서 소셜 로그인을 실제로 활성화하려면 Supabase Dashboard에서 OAuth 제공자를 설정해야 합니다.

---

## 📋 전제 조건

- Supabase 프로젝트가 생성되어 있어야 합니다.
- 각 OAuth 제공자의 개발자 계정이 필요합니다.

---

## 🔐 Google OAuth 설정

### 1단계: Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **API 및 서비스** > **사용자 인증 정보** 이동
4. **사용자 인증 정보 만들기** > **OAuth 클라이언트 ID** 선택
5. 애플리케이션 유형: **웹 애플리케이션**
6. **승인된 리디렉션 URI** 추가:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
7. **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사

### 2단계: Supabase Dashboard 설정

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 > **Authentication** > **Providers**
3. **Google** 활성화
4. Client ID와 Client Secret 입력
5. **Save** 클릭

---

## 🟢 GitHub OAuth 설정

### 1단계: GitHub 앱 생성

1. [GitHub Developer Settings](https://github.com/settings/developers) 접속
2. **OAuth Apps** > **New OAuth App** 클릭
3. 정보 입력:
   - **Application name**: DoNote
   - **Homepage URL**: `https://donote.site`
   - **Authorization callback URL**: 
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
4. **Register application** 클릭
5. **Client ID** 복사
6. **Generate a new client secret** 클릭 후 복사

### 2단계: Supabase Dashboard 설정

1. Supabase Dashboard > **Authentication** > **Providers**
2. **GitHub** 활성화
3. Client ID와 Client Secret 입력
4. **Save** 클릭

---

## � Kakao OAuth 설정 ⭐ (추천)

Supabase는 Kakao를 **기본 지원**합니다!

### 1단계: Kakao Developers 설정

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. **내 애플리케이션** > **애플리케이션 추가하기**
3. 앱 이름: DoNote
4. **플랫폼** > **Web** 추가
   - 사이트 도메인: `https://donote.site`
5. **카카오 로그인** 활성화
6. **Redirect URI** 추가:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
7. **REST API 키**와 **Client Secret** 복사 (보안 탭에서)

### 2단계: Supabase Dashboard 설정

1. Supabase Dashboard > **Authentication** > **Providers**
2. **Kakao** 활성화
3. Client ID (REST API 키)와 Client Secret 입력
4. **Save** 클릭

---

## �🟩 Naver OAuth 설정 (고급)

> ⚠️ Naver는 Supabase에서 기본 지원하지 않으므로 수동 처리가 필요합니다.

### 1단계: 네이버 개발자 센터 설정

1. [네이버 개발자 센터](https://developers.naver.com/main/) 접속
2. **Application** > **애플리케이션 등록** 클릭
3. **사용 API**: 네이버 로그인 선택
4. **제공 정보**: 이메일, 프로필 정보 등 선택
5. **서비스 URL**: `https://donote.site`
6. **Callback URL**: `https://donote.site/auth/naver/callback`

### 2단계: Edge Function 배포 필요

네이버는 Supabase에서 기본 지원되지 않으므로, Edge Function을 통해 직접 인증 플로우를 구현해야 합니다.

> 참고: 현재 버튼은 UI에만 존재하며, 실제 동작을 위해서는 추가 개발이 필요합니다.

---

## ✅ 확인 사항

- [ ] Supabase Dashboard에서 각 제공자가 활성화되어 있는지 확인
- [ ] Redirect URI가 정확히 입력되었는지 확인
- [ ] 프로덕션 도메인이 허용 목록에 있는지 확인

---

## 🔗 참고 링크

- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Google OAuth 설정 가이드](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [GitHub OAuth 설정 가이드](https://supabase.com/docs/guides/auth/social-login/auth-github)
- [Kakao OAuth 설정 가이드](https://supabase.com/docs/guides/auth/social-login/auth-kakao)
