-- RedPill AI Database Schema
-- Migration: 001_initial_schema
-- Created: 2024-12-09

-- ============================================
-- 1. USERS TABLE
-- Stores linked wallet addresses and user info
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT NOT NULL UNIQUE,
    telegram_user_id BIGINT UNIQUE,
    telegram_username TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_balance_check TIMESTAMPTZ,
    cached_balance BIGINT DEFAULT 0,
    cached_tier TEXT DEFAULT 'none' CHECK (cached_tier IN ('none', 'basic', 'full', 'god')),
    is_banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT
);

-- Index for fast wallet lookups
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_telegram ON users(telegram_user_id);

-- ============================================
-- 2. RATE LIMITS TABLE
-- Persistent rate limiting across restarts
-- ============================================
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    request_count INTEGER DEFAULT 0,
    window_start TIMESTAMPTZ DEFAULT NOW(),
    window_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_wallet_window UNIQUE (wallet_address, window_start)
);

-- Index for fast rate limit checks
CREATE INDEX IF NOT EXISTS idx_rate_limits_wallet ON rate_limits(wallet_address);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_end);

-- ============================================
-- 3. ACTIVITY LOG TABLE
-- Track all user actions for analytics
-- ============================================
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN (
        'image_generation',
        'meme_generation',
        'thread_writing',
        'voice_cloning',
        'vocal_removal',
        'balance_check',
        'wallet_link'
    )),
    action_details JSONB DEFAULT '{}',
    model_used TEXT,
    tokens_used INTEGER,
    cost_usd DECIMAL(10, 6),
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_activity_wallet ON activity_log(wallet_address);
CREATE INDEX IF NOT EXISTS idx_activity_type ON activity_log(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_success ON activity_log(success);

-- ============================================
-- 4. GENERATED CONTENT TABLE
-- Store references to generated content
-- ============================================
CREATE TABLE IF NOT EXISTS generated_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN (
        'image',
        'meme',
        'thread',
        'voice_clone',
        'vocal_stems'
    )),
    prompt TEXT,
    result_url TEXT,
    result_data JSONB,
    model_used TEXT,
    generation_params JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user content history
CREATE INDEX IF NOT EXISTS idx_content_wallet ON generated_content(wallet_address);
CREATE INDEX IF NOT EXISTS idx_content_type ON generated_content(content_type);
CREATE INDEX IF NOT EXISTS idx_content_created ON generated_content(created_at DESC);

-- ============================================
-- 5. API USAGE STATS TABLE
-- Track API provider usage and costs
-- ============================================
CREATE TABLE IF NOT EXISTS api_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    request_count INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    total_cost_usd DECIMAL(10, 6) DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_provider_date UNIQUE (provider, endpoint, date)
);

-- Index for usage queries
CREATE INDEX IF NOT EXISTS idx_api_usage_provider ON api_usage(provider);
CREATE INDEX IF NOT EXISTS idx_api_usage_date ON api_usage(date DESC);

-- ============================================
-- 6. TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rate_limits_updated_at
    BEFORE UPDATE ON rate_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_usage_updated_at
    BEFORE UPDATE ON api_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Service role has full access (for backend operations)
-- These policies allow the service role key to perform all operations

CREATE POLICY "Service role full access to users"
    ON users FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to rate_limits"
    ON rate_limits FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to activity_log"
    ON activity_log FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to generated_content"
    ON generated_content FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to api_usage"
    ON api_usage FOR ALL
    USING (auth.role() = 'service_role');

-- Anon users can read their own data (if authenticated via wallet signing)
-- For now, we use service role for all operations

-- ============================================
-- 8. HELPER FUNCTIONS
-- ============================================

-- Function to clean up expired rate limits
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limits WHERE window_end < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(p_wallet TEXT)
RETURNS TABLE (
    total_generations BIGINT,
    images_generated BIGINT,
    memes_generated BIGINT,
    threads_written BIGINT,
    first_activity TIMESTAMPTZ,
    last_activity TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT as total_generations,
        COUNT(*) FILTER (WHERE action_type = 'image_generation')::BIGINT as images_generated,
        COUNT(*) FILTER (WHERE action_type = 'meme_generation')::BIGINT as memes_generated,
        COUNT(*) FILTER (WHERE action_type = 'thread_writing')::BIGINT as threads_written,
        MIN(created_at) as first_activity,
        MAX(created_at) as last_activity
    FROM activity_log
    WHERE wallet_address = p_wallet AND success = TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. INITIAL DATA (Optional)
-- ============================================

-- You can add initial data here if needed
-- INSERT INTO ...
