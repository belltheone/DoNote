# 🗄️ Supabase 데이터베이스 설정 가이드 (초보자용)

> **이 가이드는 무엇인가요?**  
> 도노트 플랫폼이 실제로 데이터를 저장하고 읽어오려면 데이터베이스가 필요합니다.  
> 이 가이드를 따라하면 Supabase에 필요한 테이블들을 만들 수 있습니다.

---

## 📋 시작하기 전 체크리스트

- [ ] Supabase 계정이 있나요? → 없다면 [supabase.com](https://supabase.com)에서 가입
- [ ] 도노트 프로젝트가 Supabase에 생성되어 있나요?
- [ ] `.env.local` 파일에 Supabase URL과 Key가 설정되어 있나요?

---

## Step 1: Supabase Dashboard 접속하기

### 1.1 로그인
1. 웹 브라우저를 열고 **[supabase.com/dashboard](https://supabase.com/dashboard)** 로 이동합니다.
2. GitHub, Google 또는 이메일로 로그인합니다.

### 1.2 프로젝트 선택
1. 로그인하면 **프로젝트 목록**이 보입니다.
2. **도노트 프로젝트**를 클릭합니다.
   - 프로젝트 이름이 기억나지 않으면 `.env.local` 파일에서 `NEXT_PUBLIC_SUPABASE_URL`을 확인하세요.
   - URL에 포함된 문자열(예: `zehcktlaunggoisjjvjw`)이 프로젝트 ID입니다.

### 1.3 SQL Editor 열기
1. 화면 **왼쪽 사이드바**를 봅니다.
2. **"SQL Editor"** (데이터베이스 아이콘에 연필 모양)를 클릭합니다.
3. **"New query"** 버튼을 클릭하여 새 쿼리 창을 엽니다.

> 💡 **팁**: SQL Editor는 데이터베이스를 직접 조작할 수 있는 도구입니다.

---

## Step 2: 테이블 만들기 (가장 중요!)

> **테이블이란?**  
> 엑셀의 시트와 비슷합니다. 데이터를 행(row)과 열(column)로 저장합니다.

### 방법 A: 한 번에 모두 실행 (간편)

1. 프로젝트의 `supabase/schema.sql` 파일을 메모장이나 VS Code로 엽니다.
2. 파일의 **전체 내용을 복사** (Ctrl+A → Ctrl+C)합니다.
3. Supabase SQL Editor에 **붙여넣기** (Ctrl+V)합니다.
4. 오른쪽 위의 **"Run"** 버튼을 클릭합니다.
5. 하단에 "Success" 메시지가 나오면 완료!

---

### 방법 B: 하나씩 실행 (문제 해결 시 유용)

> 에러가 발생하면 어디서 문제가 생겼는지 찾기 쉽습니다.

#### 📦 테이블 1: creators (크리에이터 프로필)
```sql
-- 크리에이터 정보를 저장하는 테이블
-- 예: 닉네임, 프로필 사진, 소개글, 목표 금액 등

CREATE TABLE IF NOT EXISTS public.creators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    handle VARCHAR(50) UNIQUE NOT NULL,              -- @username 형태의 고유 주소
    display_name VARCHAR(100) NOT NULL,              -- 화면에 보이는 이름
    avatar TEXT DEFAULT '👨‍💻',                        -- 프로필 이모지/이미지
    bio TEXT,                                         -- 자기소개
    goal_title VARCHAR(200),                          -- 목표 제목 (예: "맥북 구매")
    goal_target INTEGER DEFAULT 0,                    -- 목표 금액
    social_links JSONB DEFAULT '{}',                  -- SNS 링크들
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**실행 방법:**  
1. 위 코드를 복사합니다.
2. SQL Editor에 붙여넣습니다.
3. **Run** 버튼을 클릭합니다.
4. "Success. No rows returned" 메시지가 나오면 성공!

---

#### 📦 테이블 2: donations (후원 내역)
```sql
-- 후원 메시지를 저장하는 테이블
-- 예: 누가, 얼마를, 무슨 메시지와 함께 보냈는지

CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES public.creators(id) ON DELETE CASCADE,  -- 어떤 크리에이터에게
    donor_name VARCHAR(100) NOT NULL,                 -- 후원자 닉네임
    donor_email VARCHAR(255),                         -- 후원자 이메일 (선택)
    amount INTEGER NOT NULL,                          -- 금액 (원 단위)
    message TEXT NOT NULL,                            -- 응원 메시지
    sticker VARCHAR(10) DEFAULT '💌',                 -- 스티커 이모지
    is_tip_included BOOLEAN DEFAULT FALSE,           -- 팁 포함 여부
    status VARCHAR(20) DEFAULT 'pending',             -- 결제 상태
    is_pinned BOOLEAN DEFAULT FALSE,                  -- 고정 여부
    payment_key VARCHAR(255),                         -- 결제 키
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

#### 📦 테이블 3: settlements (정산)
```sql
-- 정산 요청을 저장하는 테이블
-- 크리에이터가 수익금을 출금할 때 사용

CREATE TABLE IF NOT EXISTS public.settlements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES public.creators(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,                          -- 정산 요청 금액
    net_amount INTEGER NOT NULL,                      -- 수수료 제외 금액
    bank_name VARCHAR(50),                            -- 은행명
    account_number VARCHAR(50),                       -- 계좌번호
    account_holder VARCHAR(50),                       -- 예금주
    status VARCHAR(20) DEFAULT 'requested',           -- 상태: requested, processing, completed
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);
```

---

#### 📦 테이블 4: user_roles (사용자 권한)
```sql
-- 사용자 역할을 저장하는 테이블
-- 예: 일반 사용자, 크리에이터, 관리자

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'user',         -- user, creator, admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Step 3: 보안 설정 (RLS)

> **RLS란?**  
> Row Level Security의 약자입니다.  
> "누가 어떤 데이터를 볼 수 있는지" 규칙을 정합니다.  
> 예: 남의 정산 내역은 볼 수 없게 하기

### 3.1 RLS 활성화
```sql
-- 모든 테이블에 보안 활성화
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

**복사 → 붙여넣기 → Run!**

---

### 3.2 접근 규칙 만들기

#### Creators 테이블 규칙
```sql
-- 규칙 1: 누구나 크리에이터 목록을 볼 수 있음 (공개 프로필)
CREATE POLICY "Anyone can view creators"
    ON public.creators FOR SELECT
    USING (true);

-- 규칙 2: 본인 프로필만 수정 가능
CREATE POLICY "Users can update own creator profile"
    ON public.creators FOR UPDATE
    USING (auth.uid() = user_id);

-- 규칙 3: 본인 프로필만 생성 가능
CREATE POLICY "Users can create own creator profile"
    ON public.creators FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

---

#### Donations 테이블 규칙
```sql
-- 규칙 1: 누구나 후원 메시지를 볼 수 있음 (메시지 월)
CREATE POLICY "Anyone can view donations"
    ON public.donations FOR SELECT
    USING (true);

-- 규칙 2: 누구나 후원을 보낼 수 있음 (비회원도 가능)
CREATE POLICY "Anyone can create donations"
    ON public.donations FOR INSERT
    WITH CHECK (true);
```

---

#### Settlements 테이블 규칙
```sql
-- 본인 정산 내역만 볼 수 있음
CREATE POLICY "Users can view own settlements"
    ON public.settlements FOR SELECT
    USING (
        creator_id IN (
            SELECT id FROM public.creators WHERE user_id = auth.uid()
        )
    );

-- 본인만 정산 요청 가능
CREATE POLICY "Users can create own settlements"
    ON public.settlements FOR INSERT
    WITH CHECK (
        creator_id IN (
            SELECT id FROM public.creators WHERE user_id = auth.uid()
        )
    );
```

---

## Step 4: 성능 최적화 (인덱스)

> **인덱스란?**  
> 책의 목차와 같습니다. 데이터를 빠르게 찾을 수 있게 해줍니다.

```sql
-- 자주 검색하는 컬럼에 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_creators_handle ON public.creators(handle);
CREATE INDEX IF NOT EXISTS idx_creators_user_id ON public.creators(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_creator_id ON public.donations(creator_id);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at DESC);
```

**복사 → 붙여넣기 → Run!**

---

## Step 5: 실시간 알림 활성화 ⚡

> 이 설정을 하면 새 후원이 들어올 때 실시간으로 알림을 받을 수 있습니다!

### 방법 1: SQL로 활성화 ✅ (가장 확실한 방법)

SQL Editor에서 아래 쿼리를 실행합니다:

```sql
-- donations 테이블에 Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;

-- 필요한 경우 creators 테이블도 추가
ALTER PUBLICATION supabase_realtime ADD TABLE public.creators;
```

> ✅ "Success" 메시지가 나오면 완료!

### 방법 2: Dashboard에서 활성화 (2025년 12월 기준)

1. 왼쪽 사이드바에서 **"Database"** 클릭
2. **"Tables"** 선택하여 테이블 목록 표시
3. `donations` 테이블 오른쪽의 **점 3개 (⋮)** 클릭
4. **"Edit table"** 선택
5. **"Enable Realtime for this table"** 토글을 켬
6. **"Save"** 버튼 클릭

### 활성화 확인 방법

SQL Editor에서 아래 쿼리로 확인합니다:

```sql
-- Realtime이 활성화된 테이블 목록 확인
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

**예상 결과:**
| pubname           | tablename  |
|-------------------|------------|
| supabase_realtime | donations  |
| supabase_realtime | creators   |

---

## Step 6: 제대로 됐는지 확인하기 🔍

### 6.1 테이블 목록 확인
SQL Editor에서 아래 쿼리를 실행합니다:

```sql
-- 생성된 테이블 목록 보기
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**예상 결과:**
| table_name  |
|-------------|
| creators    |
| donations   |
| settlements |
| user_roles  |

---

### 6.2 Table Editor에서 확인
1. 왼쪽 사이드바 → **"Table Editor"** 클릭
2. 4개의 테이블이 목록에 보여야 합니다.
3. 각 테이블을 클릭하면 컬럼 구조를 확인할 수 있습니다.

---

## 🎯 완료 체크리스트

모든 항목을 완료했는지 확인하세요:

- [ ] **Step 2**: 4개 테이블 생성 (creators, donations, settlements, user_roles)
- [ ] **Step 3.1**: RLS 활성화 (4개 테이블 모두)
- [ ] **Step 3.2**: 접근 규칙 생성
- [ ] **Step 4**: 인덱스 생성 (4개)
- [ ] **Step 5**: donations 테이블 Realtime 활성화
- [ ] **Step 6**: 확인 쿼리로 검증

---

## ❓ 자주 묻는 질문 (FAQ)

### Q: "relation already exists" 에러가 나요
**A**: 이미 테이블이 존재한다는 뜻입니다. 정상입니다! `CREATE TABLE IF NOT EXISTS`를 사용했기 때문에 무시해도 됩니다.

### Q: "permission denied" 에러가 나요
**A**: 프로젝트 권한 문제입니다. Supabase Dashboard에서 본인 계정으로 로그인했는지 확인하세요.

### Q: 테이블을 잘못 만들었어요. 어떻게 삭제하나요?
**A**: 아래 SQL을 실행하면 테이블을 삭제합니다 (주의: 데이터도 삭제됨):
```sql
DROP TABLE IF EXISTS public.테이블이름 CASCADE;
```

### Q: 데이터를 넣어보고 싶어요
**A**: Table Editor에서 테이블을 클릭하고 **"Insert row"** 버튼을 눌러 테스트 데이터를 추가할 수 있습니다.

---

## 🚨 문제가 생겼을 때

1. **Supabase Logs 확인**
   - 왼쪽 사이드바 → **"Logs"** → **"Postgres"**
   - 에러 메시지를 확인합니다.

2. **SQL 문법 확인**
   - 세미콜론(`;`)을 빼먹지 않았는지 확인
   - 따옴표가 올바른지 확인 (`'` 작은따옴표 사용)

3. **처음부터 다시 시작**
   - 모든 테이블 삭제 후 다시 생성:
   ```sql
   DROP TABLE IF EXISTS public.settlements CASCADE;
   DROP TABLE IF EXISTS public.donations CASCADE;
   DROP TABLE IF EXISTS public.user_roles CASCADE;
   DROP TABLE IF EXISTS public.creators CASCADE;
   ```

---

## 🎉 완료!

모든 설정이 끝났습니다!  
이제 도노트 플랫폼이 실제 데이터베이스와 연결되어 작동합니다.

**다음 단계:**
1. 도노트 사이트에서 회원가입
2. 크리에이터 프로필 생성
3. 후원 테스트

도움이 필요하면 언제든 문의하세요! 🍩
