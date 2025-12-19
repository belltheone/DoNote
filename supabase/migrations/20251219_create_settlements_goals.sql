-- =============================================
-- settlements 테이블 생성
-- 정산 신청 및 처리 기록
-- =============================================

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS settlements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    fee_amount INTEGER NOT NULL DEFAULT 0,
    net_amount INTEGER NOT NULL,
    bank_name VARCHAR(50),
    account_number VARCHAR(100),
    account_holder VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'rejected')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    memo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_settlements_creator_id ON settlements(creator_id);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON settlements(status);
CREATE INDEX IF NOT EXISTS idx_settlements_requested_at ON settlements(requested_at DESC);

-- 3. RLS 활성화
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책: 본인 정산만 조회
CREATE POLICY "Creators can view own settlements" ON settlements
    FOR SELECT
    USING (creator_id = auth.uid());

-- 5. RLS 정책: 본인 정산만 신청
CREATE POLICY "Creators can request settlements" ON settlements
    FOR INSERT
    WITH CHECK (creator_id = auth.uid());

-- 6. RLS 정책: 관리자만 정산 처리
CREATE POLICY "Admins can manage settlements" ON settlements
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 7. updated_at 자동 업데이트 트리거
CREATE TRIGGER update_settlements_updated_at
    BEFORE UPDATE ON settlements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- donation_goals 테이블 생성
-- 후원 목표 설정
-- =============================================

CREATE TABLE IF NOT EXISTS donation_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE UNIQUE NOT NULL,
    goal_amount INTEGER NOT NULL CHECK (goal_amount > 0),
    current_amount INTEGER NOT NULL DEFAULT 0,
    title VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_donation_goals_creator_id ON donation_goals(creator_id);

-- RLS
ALTER TABLE donation_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view donation goals" ON donation_goals
    FOR SELECT USING (is_active = true);

CREATE POLICY "Creators can manage own goals" ON donation_goals
    FOR ALL
    USING (creator_id IN (
        SELECT id FROM creators WHERE user_id = auth.uid()
    ));

-- updated_at 트리거
CREATE TRIGGER update_donation_goals_updated_at
    BEFORE UPDATE ON donation_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
