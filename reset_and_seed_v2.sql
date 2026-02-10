-- reset_and_seed_v2.sql
-- COMPLETE DATA RESET & V2 SEEDING SCRIPT
-- 
-- 1. CLEANUP
-- ==========================================
BEGIN;

-- 1. SCHEMA MIGRATION (Ensuring Tables Exist)
-- ==========================================

-- A. Create New Tables if not exist
CREATE TABLE IF NOT EXISTS round_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID REFERENCES rounds(id) ON DELETE CASCADE,
    course_id UUID REFERENCES golf_courses(id),
    sequence SMALLINT NOT NULL,
    hole_start SMALLINT NOT NULL,
    hole_end SMALLINT NOT NULL,
    holes_count SMALLINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS round_holes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_course_id UUID REFERENCES round_courses(id) ON DELETE CASCADE,
    hole_no SMALLINT NOT NULL,
    par SMALLINT NOT NULL,
    score SMALLINT,
    hole_comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- B. Update Rounds Table Schema
DO $$ 
BEGIN 
    -- Add play_tee if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rounds' AND column_name='play_tee') THEN
        ALTER TABLE rounds ADD COLUMN play_tee TEXT;
    END IF;

    -- Add generic columns if missing (safety check)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rounds' AND column_name='is_public') THEN
        ALTER TABLE rounds ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
    END IF;

    -- C. Relax Legacy Constraints (V2 compatibility)
    ALTER TABLE rounds ALTER COLUMN course_name DROP NOT NULL;
    ALTER TABLE rounds ALTER COLUMN course_id DROP NOT NULL;
    ALTER TABLE rounds ALTER COLUMN club_name DROP NOT NULL; -- Just in case
END $$;

-- 2. CLEANUP DATA
-- ==========================================
TRUNCATE TABLE round_holes, round_courses, rounds, golf_course_holes, golf_courses CASCADE;

-- ==========================================
-- 2. SEED CLUBS & COURSES
-- ==========================================

-- CLUB 1: SKY72 (Total 72 Holes: Ocean, Lake, Classic, Hanul)
INSERT INTO golf_clubs (id, name, location, address, club_type, hole_count) VALUES
('8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', 'SKY72', '인천', '인천광역시 중구 공항동로', '대중제', 72)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO golf_courses (id, golf_club_id, name, holes, total_par) VALUES
('c0000000-0000-0000-0000-000000000001', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '오션 코스', 18, 72),
('c0000000-0000-0000-0000-000000000002', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '레이크 코스', 18, 72),
('c0000000-0000-0000-0000-000000000003', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '클래식 코스', 18, 72),
('c0000000-0000-0000-0000-000000000004', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '하늘 코스', 18, 72);

-- CLUB 2: Hanyang CC (Membership, 36 holes: New, Old)
INSERT INTO golf_clubs (id, name, location, address, club_type, hole_count) VALUES
('6b2e04f1-6330-47b2-bd0b-88a383838383', '한양CC', '경기 고양', '경기도 고양시 덕양구', '회원제', 36)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO golf_courses (id, golf_club_id, name, holes, total_par) VALUES
('c1000000-0000-0000-0000-000000000001', '6b2e04f1-6330-47b2-bd0b-88a383838383', '신코스', 18, 72),
('c1000000-0000-0000-0000-000000000002', '6b2e04f1-6330-47b2-bd0b-88a383838383', '구코스', 18, 72);

-- ==========================================
-- 3. SEED HOLE DATA (Real Data Mapping)
-- ==========================================

-- SKY72 Ocean (1-18)
INSERT INTO golf_course_holes (course_id, hole, par, distances) VALUES
-- OUT (1-9)
('c0000000-0000-0000-0000-000000000001', 1, 4, '{"black": 370, "white": 330, "red": 275}'),
('c0000000-0000-0000-0000-000000000001', 2, 4, '{"black": 395, "white": 300, "red": 265}'),
('c0000000-0000-0000-0000-000000000001', 3, 3, '{"black": 175, "white": 155, "red": 115}'),
('c0000000-0000-0000-0000-000000000001', 4, 4, '{"black": 320, "white": 270, "red": 250}'),
('c0000000-0000-0000-0000-000000000001', 5, 5, '{"black": 485, "white": 445, "red": 370}'),
('c0000000-0000-0000-0000-000000000001', 6, 4, '{"black": 355, "white": 300, "red": 255}'),
('c0000000-0000-0000-0000-000000000001', 7, 5, '{"black": 510, "white": 455, "red": 395}'),
('c0000000-0000-0000-0000-000000000001', 8, 3, '{"black": 200, "white": 160, "red": 135}'),
('c0000000-0000-0000-0000-000000000001', 9, 4, '{"black": 405, "white": 350, "red": 275}'),
-- IN (10-18)
('c0000000-0000-0000-0000-000000000001', 10, 4, '{"black": 410, "white": 350, "red": 300}'),
('c0000000-0000-0000-0000-000000000001', 11, 4, '{"black": 355, "white": 315, "red": 255}'),
('c0000000-0000-0000-0000-000000000001', 12, 3, '{"black": 230, "white": 185, "red": 90}'),
('c0000000-0000-0000-0000-000000000001', 13, 5, '{"black": 545, "white": 500, "red": 420}'),
('c0000000-0000-0000-0000-000000000001', 14, 4, '{"black": 410, "white": 365, "red": 295}'),
('c0000000-0000-0000-0000-000000000001', 15, 4, '{"black": 330, "white": 260, "red": 215}'),
('c0000000-0000-0000-0000-000000000001', 16, 4, '{"black": 430, "white": 395, "red": 340}'),
('c0000000-0000-0000-0000-000000000001', 17, 3, '{"black": 160, "white": 145, "red": 119}'),
('c0000000-0000-0000-0000-000000000001', 18, 5, '{"black": 568, "white": 507, "red": 430}');

-- Using Generic data for others (Lake, Classic, Hanul) to ensure they are playable
INSERT INTO golf_course_holes (course_id, hole, par, distances)
SELECT 
    c.id, h.num, 4, '{"white": 340}'::jsonb
FROM golf_courses c, generate_series(1, 18) h(num)
WHERE c.id IN (
    'c0000000-0000-0000-0000-000000000002', -- Lake
    'c0000000-0000-0000-0000-000000000003', -- Classic
    'c0000000-0000-0000-0000-000000000004', -- Hanul
    'c1000000-0000-0000-0000-000000000001', -- Hanyang New
    'c1000000-0000-0000-0000-000000000002'  -- Hanyang Old
);


-- ==========================================
-- 4. SEED ROUNDS (Sequence-Based)
-- ==========================================

-- ROUND 1: SKY72 Ocean (18 Holes - Sequence 1)
DO $$
DECLARE
    r_id UUID;
    rc_id UUID;
BEGIN
    INSERT INTO rounds (
        user_id, date, tee_time, club_id, club_name, 
        total_score, play_tee, is_public
    ) VALUES (
        '00000000-0000-0000-0000-000000000001', -- User ID
        CURRENT_DATE, '07:00', 
        '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', 'SKY72',
        85, 'Blue', true
    ) RETURNING id INTO r_id;

    -- Sequence 1: Entire 18-hole course
    INSERT INTO round_courses (round_id, course_id, sequence, hole_start, hole_end, holes_count)
    VALUES (r_id, 'c0000000-0000-0000-0000-000000000001', 1, 1, 18, 18)
    RETURNING id INTO rc_id;

    -- Detailed Score (Random data)
    INSERT INTO round_holes (round_course_id, hole_no, par, score)
    SELECT rc_id, h.num, ch.par, ch.par + 1
    FROM golf_course_holes ch
    JOIN generate_series(1, 18) h(num) ON ch.hole = h.num
    WHERE ch.course_id = 'c0000000-0000-0000-0000-000000000001';
    
END $$;

COMMIT;
