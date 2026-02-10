-- Refactor Courses and Rounds for 9-Hole Split Structure
-- 1. Schema Updates
-- 2. Data Cleanup (Reset)
-- 3. Club Normalization (SKY72 Merge)
-- 4. Course Seeding (9-Hole Segments)
-- 5. Round Seeding (18-Hole Composite)

-- ==========================================
-- 1. Schema Updates
-- ==========================================
-- Ensure rounds table has OUT/IN course selection columns
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS course_id_out UUID REFERENCES golf_courses(id);
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS course_id_in UUID REFERENCES golf_courses(id);
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS course_name_out TEXT;
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS course_name_in TEXT;

-- Move to nullable course_id to support split courses
ALTER TABLE rounds ALTER COLUMN course_id DROP NOT NULL;

-- ==========================================
-- 2. Data Cleanup
-- ==========================================
-- Warning: This deletes existing data to ensure clean structure
DELETE FROM rounds;
DELETE FROM golf_course_holes;
DELETE FROM golf_courses;

-- ==========================================
-- 3. Club Normalization (SKY72 Merge)
-- ==========================================
-- Remove old duplicates or specific course-named clubs if they exist
DELETE FROM golf_clubs WHERE name LIKE 'SKY72%';

-- Insert unified SKY72 Club
INSERT INTO golf_clubs (id, name, location, address, club_type, hole_count) VALUES
('8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', 'SKY72', '인천', '인천광역시 중구 공항동로 135번길 267', '대중제', 72)
ON CONFLICT (id) DO UPDATE 
SET name = 'SKY72', location = '인천', address = '인천광역시 중구 공항동로 135번길 267';

-- Ensure 88CC exists for second example
INSERT INTO golf_clubs (id, name, location, address, club_type, hole_count) VALUES
('aedbc4b5-6503-4af9-8b49-e5c9d0fafd0e', '88CC', '경기 용인', '경기도 용인시 기흥구 석성로 521번길 169', '회원제', 36)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 4. Course Seeding (9-Hole Segments)
-- ==========================================
-- SKY72 Courses (9 holes each)
-- Ocean (OUT/IN conceptually, but users might mix) 
-- Naming: Simply "오션 코스", "레이크 코스" if we assume Fixed OUT/IN pairs, 
-- BUT user wants "In: Ocean, Out: Lake" flexibility.
-- So we define them as 9-hole units.
INSERT INTO golf_courses (id, golf_club_id, name, holes, total_par) VALUES
('c0000000-0000-0000-0000-000000000001', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '오션 코스', 9, 36),
('c0000000-0000-0000-0000-000000000002', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '레이크 코스', 9, 36),
('c0000000-0000-0000-0000-000000000003', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '클래식 코스', 9, 36),
('c0000000-0000-0000-0000-000000000004', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '하늘 코스', 9, 36);

-- 88CC Courses
INSERT INTO golf_courses (id, golf_club_id, name, holes, total_par) VALUES
('c1000000-0000-0000-0000-000000000001', 'aedbc4b5-6503-4af9-8b49-e5c9d0fafd0e', '동 코스', 9, 36),
('c1000000-0000-0000-0000-000000000002', 'aedbc4b5-6503-4af9-8b49-e5c9d0fafd0e', '서 코스', 9, 36);


-- ==========================================
-- 5. Hole Templates
-- ==========================================
INSERT INTO golf_course_holes (course_id, hole, par, distances)
SELECT 
    c.id, 
    h.num, 
    CASE WHEN h.num IN (3, 8) THEN 3 WHEN h.num IN (5, 9) THEN 5 ELSE 4 END,
    jsonb_strip_nulls(jsonb_build_object(
      'white', (CASE WHEN h.num IN (3, 8) THEN 150 WHEN h.num IN (5, 9) THEN 480 ELSE 340 END),
      'red', (CASE WHEN h.num IN (3, 8) THEN 110 WHEN h.num IN (5, 9) THEN 400 ELSE 280 END)
    ))
FROM golf_courses c, generate_series(1, 9) h(num);

-- ==========================================
-- 6. Round Seeding (Composite Rounds)
-- ==========================================

-- Standard Round: Ocean (OUT) + Ocean (IN) -> Wait, if we only have one "Ocean Course" record(9h),
-- how do we distinguish Out/In?
-- The user said: "In: Ocean, Out: Lake". 
-- If playing Ocean 18 holes, they usually play Ocean Out + Ocean In. 
-- Typically 18h courses have 2 distinct 9h tracks (e.g. Ocean Out, Ocean In).
-- LET'S CORRECT: To support "Ocean Out + Ocean In", we need TWO 9-hole courses defined as "Ocean (OUT)" and "Ocean (IN)"?
-- OR we use the SAME 9-hole course twice? (Unlikely, holes differ).
-- "비콘힐스 하늘 코스" implies a name.
-- "SKY72 바다코스" is actually "Ocean Course" containing 18 holes (Out/In).
-- "SKY72" has "Ocean (18)", "Lake (18)", "Classic (18)".
-- Actually SKY72 Ocean is 18 holes. It has OUT holes and IN holes.
-- If the UI selects "Course > Ocean", it implies 18 holes?
-- User says: "Course Select: Ocean (OUT), Ocean (IN), Lake (OUT), Lake (IN)".
-- THIS CONFIRMS: They want 9-hole generic segments listed.
-- So I should create 9-hole segments explicitly.

-- RE-INSERTING Correct Courses based on user input example "Ocean (OUT)", "Ocean (IN)"

DELETE FROM golf_course_holes;
DELETE FROM golf_courses;

-- SKY72 9-Hole Segments
INSERT INTO golf_courses (id, golf_club_id, name, holes, total_par) VALUES
('c0000000-0000-0000-0000-000000000001', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '오션 코스 (OUT)', 9, 36),
('c0000000-0000-0000-0000-000000000002', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '오션 코스 (IN)', 9, 36),
('c0000000-0000-0000-0000-000000000003', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '레이크 코스 (OUT)', 9, 36),
('c0000000-0000-0000-0000-000000000004', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '레이크 코스 (IN)', 9, 36),
('c0000000-0000-0000-0000-000000000005', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '클래식 코스 (OUT)', 9, 36),
('c0000000-0000-0000-0000-000000000006', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '클래식 코스 (IN)', 9, 36),
('c0000000-0000-0000-0000-000000000007', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '하늘 코스 (OUT)', 9, 36),
('c0000000-0000-0000-0000-000000000008', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '하늘 코스 (IN)', 9, 36);

-- 88CC 9-Hole Segments
INSERT INTO golf_courses (id, golf_club_id, name, holes, total_par) VALUES
('c1000000-0000-0000-0000-000000000001', 'aedbc4b5-6503-4af9-8b49-e5c9d0fafd0e', '동 코스 (OUT)', 9, 36),
('c1000000-0000-0000-0000-000000000002', 'aedbc4b5-6503-4af9-8b49-e5c9d0fafd0e', '동 코스 (IN)', 9, 36);

-- Re-run hole templates
INSERT INTO golf_course_holes (course_id, hole, par, distances)
SELECT 
    c.id, 
    h.num, 
    CASE WHEN h.num IN (3, 8) THEN 3 WHEN h.num IN (5, 9) THEN 5 ELSE 4 END,
    jsonb_strip_nulls(jsonb_build_object(
      'white', (CASE WHEN h.num IN (3, 8) THEN 150 WHEN h.num IN (5, 9) THEN 480 ELSE 340 END),
      'red', (CASE WHEN h.num IN (3, 8) THEN 110 WHEN h.num IN (5, 9) THEN 400 ELSE 280 END)
    ))
FROM golf_courses c, generate_series(1, 9) h(num);

-- Round Seeding
-- 1. Kim Pro: SKY72 [Ocean OUT] + [Ocean IN]
INSERT INTO rounds (
    id, user_id, date, tee_time, 
    club_id, club_name, 
    course_name, -- Legacy fallback
    course_id_out, course_name_out,
    course_id_in, course_name_in,
    total_score, hole_scores, 
    is_public, weather, temperature, wind_speed,
    green_fee, cart_fee, caddy_fee, 
    green_speed, tee_box_condition, fairway_rating, green_rating,
    partners, memo
) VALUES 
(
    '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '2026-02-04', '06:45', 
    '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', 'SKY72', 
    '오션 코스',
    'c0000000-0000-0000-0000-000000000001', '오션 코스 (OUT)',
    'c0000000-0000-0000-0000-000000000002', '오션 코스 (IN)',
    71, 
    '{"1": 4, "2": 4, "3": 2, "4": 4, "5": 5, "6": 4, "7": 5, "8": 3, "9": 4, "10": 4, "11": 4, "12": 3, "13": 5, "14": 4, "15": 4, "16": 4, "17": 3, "18": 5}',
    true, '맑음', 16, '2m/s',
    220000, 25000, 40000, 
    3.0, 'well_maintained_grass', 5, 5,
    '김프로, 이백돌', 
    '이른 아침 라운딩, 상쾌하고 좋았습니다. 동반자 매너도 굿!'
);
