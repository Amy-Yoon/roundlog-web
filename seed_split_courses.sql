-- Comprehensive Split Course & Rich Data Seed Script
-- 1. Schema Changes: Add OUT/IN course support
-- 2. Data Cleanup: Remove old 18-hole courses and rounds
-- 3. Course Seeding: Create real 9-hole courses
-- 4. Round Seeding: Create composite 18-hole rounds (OUT + IN)

-- ==========================================
-- 1. Schema Changes
-- ==========================================
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS course_id_out UUID REFERENCES golf_courses(id);
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS course_id_in UUID REFERENCES golf_courses(id);
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS course_name_out TEXT;
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS course_name_in TEXT;

-- ==========================================
-- 2. Data Cleanup
-- ==========================================
-- Delete rounds and courses to start fresh with new structure
DELETE FROM rounds;
DELETE FROM golf_course_holes;
DELETE FROM golf_courses;

-- ==========================================
-- 3. Course Seeding (9-Hole Segments)
-- ==========================================

-- SKY72 (Club ID: 8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3)
-- Creating 9-hole segments: Ocean OUT, Ocean IN, Lake OUT, Lake IN, Classic OUT, Classic IN
INSERT INTO golf_courses (id, golf_club_id, name, holes, total_par) VALUES
('c0000000-0000-0000-0000-000000000001', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '오션 코스 (OUT)', 9, 36),
('c0000000-0000-0000-0000-000000000002', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '오션 코스 (IN)', 9, 36),
('c0000000-0000-0000-0000-000000000003', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '레이크 코스 (OUT)', 9, 36),
('c0000000-0000-0000-0000-000000000004', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '레이크 코스 (IN)', 9, 36),
('c0000000-0000-0000-0000-000000000005', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '클래식 코스 (OUT)', 9, 36),
('c0000000-0000-0000-0000-000000000006', '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', '클래식 코스 (IN)', 9, 36);

-- 88CC (Club ID: aedbc4b5-6503-4af9-8b49-e5c9d0fafd0e)
-- Creating 9-hole segments: East OUT, East IN, West OUT, West IN
INSERT INTO golf_courses (id, golf_club_id, name, holes, total_par) VALUES
('c1000000-0000-0000-0000-000000000001', 'aedbc4b5-6503-4af9-8b49-e5c9d0fafd0e', '동 코스 (OUT)', 9, 36),
('c1000000-0000-0000-0000-000000000002', 'aedbc4b5-6503-4af9-8b49-e5c9d0fafd0e', '동 코스 (IN)', 9, 36),
('c1000000-0000-0000-0000-000000000003', 'aedbc4b5-6503-4af9-8b49-e5c9d0fafd0e', '서 코스 (OUT)', 9, 36),
('c1000000-0000-0000-0000-000000000004', 'aedbc4b5-6503-4af9-8b49-e5c9d0fafd0e', '서 코스 (IN)', 9, 36);

-- ==========================================
-- 4. Hole Templates (1-9 for each course)
-- ==========================================
-- Inserting generic hole data for valid structure (can be refined later with real yardages)
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
-- 5. Round Seeding (Composite Rounds)
-- ==========================================
INSERT INTO rounds (
    id, user_id, date, tee_time, 
    club_id, club_name, 
    course_id, course_name, -- Legacy support (can keep primary course or concat text)
    course_id_out, course_name_out,
    course_id_in, course_name_in,
    total_score, hole_scores, 
    is_public, weather, temperature, wind_speed,
    green_fee, cart_fee, caddy_fee, 
    green_speed, tee_box_condition, fairway_rating, green_rating,
    partners, memo
) VALUES 
    -- 1. Kim Pro: SKY72 [Ocean OUT] + [Ocean IN] (71 strokes)
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '2026-02-04', '07:30', 
    '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', 'SKY72 골프클럽(바다코스)', 
    'c0000000-0000-0000-0000-000000000001', '오션 코스', -- Legacy main label
    'c0000000-0000-0000-0000-000000000001', '오션 코스 (OUT)',
    'c0000000-0000-0000-0000-000000000002', '오션 코스 (IN)',
    71, 
    '{"1": 4, "2": 4, "3": 2, "4": 4, "5": 5, "6": 4, "7": 5, "8": 3, "9": 4, "10": 4, "11": 4, "12": 3, "13": 5, "14": 4, "15": 4, "16": 4, "17": 3, "18": 5}',
    true, '맑음', 18, '2m/s',
    250000, 25000, 40000, 
    2.9, 'well_maintained_grass', 5, 5,
    '박싱글, 최매니아, 이백돌', 
    '언더파 달성! 전반 3번홀 니어핀 버디가 결정적이었음. 후반에도 집중력 유지 성공.'),

    -- 2. Newbie Lee: 88CC [West OUT] + [West IN] (115 strokes)
    ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', '2025-12-20', '08:15', 
    'aedbc4b5-6503-4af9-8b49-e5c9d0fafd0e', '88CC', 
    'c1000000-0000-0000-0000-000000000003', '서 코스',
    'c1000000-0000-0000-0000-000000000003', '서 코스 (OUT)',
    'c1000000-0000-0000-0000-000000000004', '서 코스 (IN)',
    115,
    '{"1": 7, "2": 7, "3": 5, "4": 7, "5": 8, "6": 7, "7": 8, "8": 5, "9": 7, "10": 6, "11": 7, "12": 5, "13": 8, "14": 6, "15": 6, "16": 7, "17": 4, "18": 5}',
    true, '추움', 2, '5m/s',
    180000, 25000, 40000,
    2.5, 'many_mats', 3, 3,
    '대학동창들',
    '겨울 골프라 몸이 안 풀렸네요. 그래도 서코스 경치가 참 좋았습니다.'),

    -- 3. Mania Choi: SKY72 [Lake OUT] + [Classic IN] (Cross Course Example) (89 strokes)
    ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', '2026-01-20', '10:30', 
    '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', 'SKY72 골프클럽(바다코스)', 
    'c0000000-0000-0000-0000-000000000003', '레이크/클래식',
    'c0000000-0000-0000-0000-000000000003', '레이크 코스 (OUT)',
    'c0000000-0000-0000-0000-000000000006', '클래식 코스 (IN)',
    89,
    '{"1": 5, "2": 5, "3": 4, "4": 6, "5": 5, "6": 5, "7": 6, "8": 3, "9": 5, "10": 5, "11": 5, "12": 4, "13": 6, "14": 5, "15": 5, "16": 5, "17": 4, "18": 6}',
    true, '바람', 8, '8m/s',
    250000, 25000, 40000,
    2.7, 'well_maintained_grass', 5, 5,
    '비즈니스 파트너',
    '전반 레이크는 무난했는데, 후반 클래식 코스 바람이 변수였습니다.')
ON CONFLICT (id) DO NOTHING;
