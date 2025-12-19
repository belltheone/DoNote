-- =============================================
-- user_roles 테이블 생성
-- 사용자별 역할 관리 (admin, creator, user)
-- =============================================

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'creator', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 인덱스 생성 (빠른 조회를 위해)
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- 3. RLS (Row Level Security) 활성화
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책: 모든 사용자가 자신의 역할 조회 가능
CREATE POLICY "Users can read own role" ON user_roles
    FOR SELECT 
    USING (auth.uid() = user_id);

-- 5. RLS 정책: 관리자만 역할 수정 가능
CREATE POLICY "Admins can manage all roles" ON user_roles
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 6. updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 초기 데이터: 현재 관리자 계정 추가
-- 아래 이메일을 실제 관리자 이메일로 변경하세요!
-- =============================================

-- 관리자 역할 추가 (이메일로 user_id 찾아서 삽입)
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'admin' 
-- FROM auth.users 
-- WHERE email = 'your-admin@email.com'
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
