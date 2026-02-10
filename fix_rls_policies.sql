-- Fix RLS Policies for Public Data Access
-- This script creates proper RLS policies to allow anonymous users to view public data

-- ============================================
-- ROUNDS TABLE POLICIES
-- ============================================

-- Enable RLS on rounds table
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public rounds are viewable by everyone" ON rounds;
DROP POLICY IF EXISTS "Users can view their own rounds" ON rounds;
DROP POLICY IF EXISTS "Users can insert their own rounds" ON rounds;
DROP POLICY IF EXISTS "Users can update their own rounds" ON rounds;
DROP POLICY IF EXISTS "Users can delete their own rounds" ON rounds;

-- Policy 1: Allow everyone (including anonymous) to view public rounds
CREATE POLICY "Public rounds are viewable by everyone"
ON rounds FOR SELECT
USING (is_public = true);

-- Policy 2: Allow authenticated users to view their own rounds
CREATE POLICY "Users can view their own rounds"
ON rounds FOR SELECT
USING (auth.uid() = user_id);

-- Policy 3: Allow authenticated users to insert their own rounds
CREATE POLICY "Users can insert their own rounds"
ON rounds FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Allow authenticated users to update their own rounds
CREATE POLICY "Users can update their own rounds"
ON rounds FOR UPDATE
USING (auth.uid() = user_id);

-- Policy 5: Allow authenticated users to delete their own rounds
CREATE POLICY "Users can delete their own rounds"
ON rounds FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;

-- Allow everyone to view user profiles (for community features)
CREATE POLICY "Users are viewable by everyone"
ON users FOR SELECT
USING (true);

-- ============================================
-- GOLF CLUBS TABLE POLICIES
-- ============================================

ALTER TABLE golf_clubs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Golf clubs are viewable by everyone" ON golf_clubs;

-- Allow everyone to view golf clubs
CREATE POLICY "Golf clubs are viewable by everyone"
ON golf_clubs FOR SELECT
USING (true);

-- ============================================
-- GOLF COURSES TABLE POLICIES
-- ============================================

ALTER TABLE golf_courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Golf courses are viewable by everyone" ON golf_courses;

-- Allow everyone to view golf courses
CREATE POLICY "Golf courses are viewable by everyone"
ON golf_courses FOR SELECT
USING (true);

-- ============================================
-- GOLF COURSE HOLES TABLE POLICIES
-- ============================================

ALTER TABLE golf_course_holes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Golf course holes are viewable by everyone" ON golf_course_holes;

-- Allow everyone to view golf course holes
CREATE POLICY "Golf course holes are viewable by everyone"
ON golf_course_holes FOR SELECT
USING (true);

-- ============================================
-- VERIFICATION
-- ============================================

-- Show all policies that were created
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('rounds', 'users', 'golf_clubs', 'golf_courses', 'golf_course_holes')
ORDER BY tablename, policyname;
