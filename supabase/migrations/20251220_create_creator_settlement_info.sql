-- 크리에이터 정산 정보 테이블
-- 민감 정보를 안전하게 저장하기 위한 스키마

-- 정산 정보 테이블
CREATE TABLE IF NOT EXISTS creator_settlement_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- 개인 정보 (세금 신고용)
    real_name TEXT NOT NULL,                -- 실명
    ssn_front TEXT NOT NULL,                -- 주민번호 앞 6자리
    ssn_back_encrypted TEXT NOT NULL,       -- 주민번호 뒤 7자리 (암호화)
    address TEXT NOT NULL,                  -- 주소
    phone_number TEXT NOT NULL,             -- 휴대폰 번호
    
    -- 은행 정보
    bank_name TEXT NOT NULL,                -- 은행명
    account_number_encrypted TEXT NOT NULL, -- 계좌번호 (암호화)
    account_holder TEXT NOT NULL,           -- 예금주명
    
    -- 인증 상태
    is_verified BOOLEAN DEFAULT FALSE,      -- 본인인증 완료 여부
    verified_at TIMESTAMPTZ,                -- 인증 완료 시각
    
    -- 타임스탬프
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 한 크리에이터당 하나의 정산 정보만
    UNIQUE(creator_id)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_creator_settlement_info_creator 
ON creator_settlement_info(creator_id);

-- 업데이트 트리거
CREATE OR REPLACE FUNCTION update_creator_settlement_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_creator_settlement_info_updated_at
    BEFORE UPDATE ON creator_settlement_info
    FOR EACH ROW
    EXECUTE FUNCTION update_creator_settlement_info_updated_at();

-- RLS 정책
ALTER TABLE creator_settlement_info ENABLE ROW LEVEL SECURITY;

-- 크리에이터 본인만 자신의 정산 정보 조회/수정 가능
CREATE POLICY "Users can view own settlement info"
    ON creator_settlement_info FOR SELECT
    USING (auth.uid() = creator_id);

CREATE POLICY "Users can insert own settlement info"
    ON creator_settlement_info FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own settlement info"
    ON creator_settlement_info FOR UPDATE
    USING (auth.uid() = creator_id);

-- 관리자는 모든 정산 정보 조회 가능 (정산 처리용)
CREATE POLICY "Admins can view all settlement info"
    ON creator_settlement_info FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- user_roles 테이블에 account_type 컬럼 추가 (없으면)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_roles' 
        AND column_name = 'account_type'
    ) THEN
        ALTER TABLE user_roles 
        ADD COLUMN account_type TEXT DEFAULT 'creator' 
        CHECK (account_type IN ('creator', 'supporter'));
    END IF;
END $$;

-- 코멘트 추가
COMMENT ON TABLE creator_settlement_info IS '크리에이터 정산 정보 (민감 정보 포함)';
COMMENT ON COLUMN creator_settlement_info.ssn_back_encrypted IS '주민번호 뒤 7자리 - 반드시 암호화하여 저장';
COMMENT ON COLUMN creator_settlement_info.account_number_encrypted IS '계좌번호 - 반드시 암호화하여 저장';
