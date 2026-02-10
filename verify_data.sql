-- Diagnostic Script: Check Database State
-- Run this in Supabase SQL Editor to diagnose the issue

-- 1. Check if rounds data exists
SELECT COUNT(*) as total_rounds FROM rounds;

-- 2. Check if public rounds exist
SELECT COUNT(*) as public_rounds FROM rounds WHERE is_public = true;

-- 3. Check if dummy users were created
SELECT COUNT(*) as dummy_users FROM users WHERE id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
);

-- 4. Check RLS status on all tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('rounds', 'users', 'golf_clubs', 'golf_courses');

-- 5. Check existing RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('rounds', 'users', 'golf_clubs', 'golf_courses')
ORDER BY tablename, policyname;

-- 6. Show sample public rounds (if any)
SELECT id, user_id, club_name, course_name, date, total_score, is_public
FROM rounds
WHERE is_public = true
ORDER BY date DESC
LIMIT 5;
