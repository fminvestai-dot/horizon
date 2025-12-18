-- QLM Hansei OS - Initial Database Schema
-- Migration: 001_initial_schema
-- Created: 2025-12-18

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Extends Supabase auth.users with user profile data
-- =====================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  horizon_config JSONB NOT NULL DEFAULT '{
    "h3": {"label": "Vision", "timeframe": "10+ years"},
    "h2": {"label": "Strategy", "timeframe": "3-4 years"},
    "h1": {"label": "Tactics", "timeframe": "1 year"}
  }'::jsonb,
  belt_progress JSONB NOT NULL DEFAULT '{
    "currentBelt": "white",
    "currentBeltAwardedAt": null,
    "daysConsecutive": 0,
    "totalDaysLogged": 0,
    "firstLogDate": null,
    "achievedGoals": [],
    "progressToNext": {
      "daysRemaining": 180,
      "monthsRemaining": 12,
      "goalsRemaining": {"h1": 1, "h2": 0},
      "peiAverage": 0,
      "isEligible": false
    }
  }'::jsonb,
  preferences JSONB NOT NULL DEFAULT '{
    "peiThresholdIshikawa": 0.7,
    "fireReminders": true,
    "timezone": "UTC",
    "language": "en"
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- HORIZONS TABLE
-- User-defined goals across 3 time horizons
-- =====================================================
CREATE TABLE horizons (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('H3', 'H2', 'H1')),
  title TEXT NOT NULL,
  description TEXT,
  quadrant TEXT NOT NULL CHECK (quadrant IN ('Business', 'Vitality', 'Mindset', 'Relations')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'achieved', 'archived')),
  parent_horizon_id TEXT REFERENCES horizons(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  achieved_at TIMESTAMPTZ,
  UNIQUE(user_id, id)
);

CREATE INDEX idx_horizons_user_id ON horizons(user_id);
CREATE INDEX idx_horizons_level ON horizons(user_id, level);
CREATE INDEX idx_horizons_status ON horizons(user_id, status);
CREATE INDEX idx_horizons_parent ON horizons(parent_horizon_id);

-- =====================================================
-- DAILY_LOGS TABLE
-- Daily practice tracking with PEI, FIRE, Takt
-- =====================================================
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  horizon_sync TEXT[] NOT NULL DEFAULT '{}',
  fire_checklist JSONB NOT NULL DEFAULT '{
    "focus": false,
    "intention": false,
    "review": false,
    "execution": false
  }'::jsonb,
  takt_timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  pei JSONB NOT NULL DEFAULT '{
    "availability": 1,
    "performance": 1,
    "quality": 1,
    "total": 1
  }'::jsonb,
  muda TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_logs_user_date ON daily_logs(user_id, date DESC);
CREATE INDEX idx_daily_logs_horizon_sync ON daily_logs USING GIN (horizon_sync);

-- =====================================================
-- WEEKLY_REVIEWS TABLE
-- Weekly Hansei with Ishikawa, 5-Whys, Poka-Yoke
-- =====================================================
CREATE TABLE weekly_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week INTEGER NOT NULL,
  year INTEGER NOT NULL,
  pei_trend JSONB NOT NULL DEFAULT '[]'::jsonb,
  ishikawa_analysis JSONB,
  five_whys TEXT[] NOT NULL DEFAULT '{}',
  poka_yoke TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, year, week)
);

CREATE INDEX idx_weekly_reviews_user ON weekly_reviews(user_id, year DESC, week DESC);

-- =====================================================
-- GOAL_PROOFS TABLE
-- Structured documentation of goal achievements
-- =====================================================
CREATE TABLE goal_proofs (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  horizon_id TEXT NOT NULL,
  goal_description TEXT NOT NULL,
  achievement_date TIMESTAMPTZ NOT NULL,
  metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  reflection TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

CREATE INDEX idx_goal_proofs_user ON goal_proofs(user_id);
CREATE INDEX idx_goal_proofs_horizon ON goal_proofs(horizon_id);
CREATE INDEX idx_goal_proofs_date ON goal_proofs(achievement_date DESC);

-- =====================================================
-- MASTERY_TOKENS TABLE
-- Verification tokens for belt achievements
-- =====================================================
CREATE TABLE mastery_tokens (
  token_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  belt_level TEXT NOT NULL CHECK (belt_level IN ('white', 'yellow', 'orange', 'green', 'black')),
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  achievements JSONB NOT NULL,
  signature TEXT NOT NULL,
  revoked BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_mastery_tokens_user ON mastery_tokens(user_id);
CREATE INDEX idx_mastery_tokens_token_id ON mastery_tokens(token_id);
CREATE INDEX idx_mastery_tokens_belt ON mastery_tokens(belt_level);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Users can only access their own data
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE horizons ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastery_tokens ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Horizons policies
CREATE POLICY "Users can view own horizons"
  ON horizons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own horizons"
  ON horizons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own horizons"
  ON horizons FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own horizons"
  ON horizons FOR DELETE
  USING (auth.uid() = user_id);

-- Daily logs policies
CREATE POLICY "Users can view own daily logs"
  ON daily_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logs"
  ON daily_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logs"
  ON daily_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily logs"
  ON daily_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Weekly reviews policies
CREATE POLICY "Users can view own weekly reviews"
  ON weekly_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly reviews"
  ON weekly_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly reviews"
  ON weekly_reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Goal proofs policies
CREATE POLICY "Users can view own goal proofs"
  ON goal_proofs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goal proofs"
  ON goal_proofs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goal proofs"
  ON goal_proofs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goal proofs"
  ON goal_proofs FOR DELETE
  USING (auth.uid() = user_id);

-- Mastery tokens policies
CREATE POLICY "Users can view own mastery tokens"
  ON mastery_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mastery tokens"
  ON mastery_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public verification (anyone can read by token_id, but not see user_id)
CREATE POLICY "Anyone can verify tokens"
  ON mastery_tokens FOR SELECT
  USING (true);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_horizons_updated_at
  BEFORE UPDATE ON horizons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA (Optional - for testing)
-- =====================================================

-- Example: Insert a test user's horizons (commented out)
-- INSERT INTO horizons (id, user_id, level, title, description, quadrant) VALUES
--   ('H3-01', 'user-uuid', 'H3', 'Build a successful company', 'Create a profitable and sustainable business', 'Business'),
--   ('H2-01', 'user-uuid', 'H2', 'Reach 10,000 users', 'Grow user base to 10k active users', 'Business'),
--   ('H1-01', 'user-uuid', 'H1', 'Launch MVP by Q2 2025', 'Ship minimum viable product', 'Business');

COMMENT ON TABLE profiles IS 'User profiles with horizon config, belt progress, and preferences';
COMMENT ON TABLE horizons IS 'User-defined goals across 3 time horizons (H3=Vision, H2=Strategy, H1=Tactics)';
COMMENT ON TABLE daily_logs IS 'Daily practice logs with PEI tracking, FIRE checklist, and Takt timeline';
COMMENT ON TABLE weekly_reviews IS 'Weekly Hansei reviews with Ishikawa analysis, 5-Whys, and Poka-Yoke';
COMMENT ON TABLE goal_proofs IS 'Structured documentation of goal achievements for belt progression';
COMMENT ON TABLE mastery_tokens IS 'Verification tokens proving belt achievements (JWT-based)';
