# Supabase Database 설정 가이드

## 개요
도노트 플랫폼의 실제 데이터베이스를 설정하는 가이드입니다.

---

## Step 1: Supabase Dashboard 접속

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 (zehcktlaunggoisjjvjw)
3. 좌측 메뉴에서 **SQL Editor** 클릭

---

## Step 2: Schema 실행

### 방법 1: 파일 직접 복사
```sql
-- supabase/schema.sql 파일의 전체 내용을 복사하여 붙여넣기
-- "RUN" 버튼 클릭
```

### 방법 2: 단계별 실행 (권장)

#### 2.1 크리에이터 테이블
```sql
create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  handle text not null unique,
  display_name text not null,
  avatar text,
  bio text,
  goal_title text,
  goal_target integer default 0,
  goal_current integer default 0,
  theme text default 'yellow',
  social_links jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### 2.2 후원 테이블
```sql
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.creators(id) not null,
  supporter_nickname text not null,
  message text not null,
  amount integer not null,
  sticker text,
  payment_id text,
  status text default 'completed',
  is_pinned boolean default false,
  created_at timestamptz default now()
);
```

#### 2.3 정산 테이블
```sql
create table if not exists public.settlements (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.creators(id) not null,
  amount integer not null,
  status text default 'pending',
  requested_at timestamptz default now(),
  completed_at timestamptz
);
```

#### 2.4 사용자 역할 테이블
```sql
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  role text not null default 'user',
  created_at timestamptz default now()
);
```

---

## Step 3: RLS (Row Level Security) 정책 활성화

### 3.1 테이블별 RLS 활성화
```sql
alter table public.creators enable row level security;
alter table public.donations enable row level security;
alter table public.settlements enable row level security;
alter table public.user_roles enable row level security;
```

### 3.2 정책 생성

#### Creators 정책
```sql
-- 누구나 조회 가능
create policy "Anyone can view creators"
  on public.creators for select
  using (true);

-- 본인만 수정 가능
create policy "Users can update own creator profile"
  on public.creators for update
  using (auth.uid() = user_id);

-- 본인만 생성 가능
create policy "Users can create own creator profile"
  on public.creators for insert
  with check (auth.uid() = user_id);
```

#### Donations 정책
```sql
-- 누구나 조회 가능
create policy "Anyone can view donations"
  on public.donations for select
  using (true);

-- 인증된 사용자만 생성 가능
create policy "Authenticated users can create donations"
  on public.donations for insert
  with check (auth.role() = 'authenticated');
```

---

## Step 4: 인덱스 생성 (성능 최적화)

```sql
create index if not exists idx_creators_handle on public.creators(handle);
create index if not exists idx_creators_user_id on public.creators(user_id);
create index if not exists idx_donations_creator_id on public.donations(creator_id);
create index if not exists idx_donations_created_at on public.donations(created_at desc);
```

---

## Step 5: Realtime 활성화

1. Supabase Dashboard → **Database** → **Replication**
2. `donations` 테이블 찾기
3. **Enable Realtime** 토글 ON

---

## Step 6: 확인

### SQL Query로 확인
```sql
-- 테이블 목록 확인
select table_name 
from information_schema.tables 
where table_schema = 'public';

-- RLS 정책 확인
select * from pg_policies 
where schemaname = 'public';
```

---

## 완료 체크리스트

- [ ] 4개 테이블 생성 완료
- [ ] RLS 정책 활성화
- [ ] 인덱스 생성
- [ ] Realtime 활성화 (donations)
- [ ] 테스트 데이터 삽입 (선택)

---

> [!TIP]
> 문제가 발생하면 Supabase Dashboard의 **Logs** 탭에서 에러를 확인하세요.
