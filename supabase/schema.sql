-- Supabase 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- 크리에이터 프로필 테이블
CREATE TABLE IF NOT EXISTS creators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    handle VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar TEXT DEFAULT '👨‍💻',
    bio TEXT,
    goal_title VARCHAR(200),
    goal_target INTEGER DEFAULT 0,
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 후원 테이블
CREATE TABLE IF NOT EXISTS donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    donor_name VARCHAR(100) NOT NULL,
    donor_email VARCHAR(255),
    amount INTEGER NOT NULL,
    message TEXT NOT NULL,
    sticker VARCHAR(10) DEFAULT '💌',
    is_tip_included BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending',
    is_pinned BOOLEAN DEFAULT FALSE,
    payment_key VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 정산 테이블
CREATE TABLE IF NOT EXISTS settlements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    net_amount INTEGER NOT NULL,
    bank_name VARCHAR(50),
    account_number VARCHAR(50),
    account_holder VARCHAR(50),
    status VARCHAR(20) DEFAULT 'requested',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- RLS (Row Level Security) 정책
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

-- 크리에이터 정책: 누구나 읽기, 본인만 수정
CREATE POLICY "Public creators are viewable by everyone" ON creators
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON creators
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON creators
    FOR UPDATE USING (auth.uid() = user_id);

-- 후원 정책: 누구나 읽기, 누구나 생성, 크리에이터만 핀 수정
CREATE POLICY "Donations are viewable by everyone" ON donations
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create donations" ON donations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Creators can update their donations" ON donations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM creators 
            WHERE creators.id = donations.creator_id 
            AND creators.user_id = auth.uid()
        )
    );

-- 정산 정책: 본인만 읽기/생성
CREATE POLICY "Users can view own settlements" ON settlements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM creators 
            WHERE creators.id = settlements.creator_id 
            AND creators.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can request settlements" ON settlements
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM creators 
            WHERE creators.id = settlements.creator_id 
            AND creators.user_id = auth.uid()
        )
    );

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_creators_handle ON creators(handle);
CREATE INDEX IF NOT EXISTS idx_creators_user_id ON creators(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_creator_id ON donations(creator_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_settlements_creator_id ON settlements(creator_id);

-- =====================================================
-- 사용자 역할(Role) 시스템
-- =====================================================

-- user_roles 테이블: 사용자 역할 관리
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user', -- 'admin', 'creator', 'user'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- user_roles RLS 정책
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 본인 역할 조회 가능
CREATE POLICY "Users can view own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- 관리자만 역할 생성/수정 가능 (서버 사이드에서 처리)
CREATE POLICY "Admins can manage roles" ON user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- user_roles 인덱스
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- =====================================================
-- 관리자 계정 초기화 (admin@admin.admin 계정 생성 후 실행)
-- 아래 쿼리는 관리자 계정 생성 후 별도로 실행하세요:
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'admin' FROM auth.users WHERE email = 'admin@admin.admin';
-- =====================================================
