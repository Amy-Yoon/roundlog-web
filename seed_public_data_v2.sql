-- Comprehensive Community Data Seed Script v2
-- This script adds realistic users, courses, holes, and public rounds.

-- 1. Ensure Schema Support
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE rounds ALTER COLUMN tee_time DROP NOT NULL; -- Optional but good for safety, however user said it failed, so we WILL provide it.

-- 2. Create Dummy Users for Community
INSERT INTO users (id, email, name, handicap, bio) 
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'pro_k@roundlog.com', '김프로', 3, 'KPGA 투어 프로를 꿈꾸는 열혈 골퍼입니다.'),
    ('00000000-0000-0000-0000-000000000002', 'newbie_lee@roundlog.com', '이백돌', 28, '이제 막 시작한 골린이입니다. 100타 깨기가 목표!'),
    ('00000000-0000-0000-0000-000000000003', 'mania_choi@roundlog.com', '최매니아', 12, '주말마다 라운딩 가는 필드 매니아입니다.'),
    ('00000000-0000-0000-0000-000000000004', 'single_park@roundlog.com', '박싱글', 7, '안정적인 싱글 플레이어를 지향합니다.')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    handicap = EXCLUDED.handicap,
    bio = EXCLUDED.bio;

-- 3. Realistic Course & Hole Data for Key Clubs
DO $$
DECLARE
    sky72_id UUID;
    cc88_id UUID;
    lynx_id UUID;
    
    sky_ocean_id UUID := '00000000-0000-0000-0000-c00000000001';
    sky_hanul_id UUID := '00000000-0000-0000-0000-c00000000002';
    cc88_east_id UUID := '00000000-0000-0000-0000-c10000000001';
    cc88_west_id UUID := '00000000-0000-0000-0000-c10000000002';
BEGIN
    -- Get Club IDs
    SELECT id INTO sky72_id FROM golf_clubs WHERE name = 'SKY72 골프클럽(바다코스)' LIMIT 1;
    SELECT id INTO cc88_id FROM golf_clubs WHERE name = '88CC' LIMIT 1;
    SELECT id INTO lynx_id FROM golf_clubs WHERE name = '사우스링스영암' LIMIT 1;

    -- Clean up previous dummy data (IMPORTANT: Delete rounds FIRST to respect foreign keys)
    -- Delete rounds that reference these courses
    DELETE FROM rounds WHERE course_id IN (SELECT id FROM golf_courses WHERE golf_club_id IN (sky72_id, cc88_id));
    -- Delete rounds by dummy users
    DELETE FROM rounds WHERE user_id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004');
    -- Now safe to delete courses and holes
    DELETE FROM golf_course_holes WHERE course_id IN (SELECT id FROM golf_courses WHERE golf_club_id IN (sky72_id, cc88_id));
    DELETE FROM golf_courses WHERE golf_club_id IN (sky72_id, cc88_id);

    -- Insert REAL-ish Courses
    INSERT INTO golf_courses (id, golf_club_id, name, holes, total_par) VALUES
    (sky_ocean_id, sky72_id, '오션 코스', 18, 72),
    (sky_hanul_id, sky72_id, '하늘 코스', 18, 72),
    (cc88_east_id, cc88_id, '동 코스', 18, 72),
    (cc88_west_id, cc88_id, '서 코스', 18, 72);

    -- Insert REAL-ish Holes for Sky72 Ocean
    INSERT INTO golf_course_holes (course_id, hole, par, distances) VALUES
    (sky_ocean_id, 1, 4, '{"white": 361, "red": 301}'),
    (sky_ocean_id, 2, 4, '{"white": 328, "red": 290}'),
    (sky_ocean_id, 3, 3, '{"white": 170, "red": 126}'),
    (sky_ocean_id, 4, 4, '{"white": 295, "red": 273}'),
    (sky_ocean_id, 5, 5, '{"white": 487, "red": 405}'),
    (sky_ocean_id, 6, 4, '{"white": 328, "red": 279}'),
    (sky_ocean_id, 7, 5, '{"white": 498, "red": 432}'),
    (sky_ocean_id, 8, 3, '{"white": 175, "red": 148}'),
    (sky_ocean_id, 9, 4, '{"white": 383, "red": 301}'),
    (sky_ocean_id, 10, 4, '{"white": 383, "red": 328}'),
    (sky_ocean_id, 11, 4, '{"white": 344, "red": 279}'),
    (sky_ocean_id, 12, 3, '{"white": 202, "red": 175}'),
    (sky_ocean_id, 13, 5, '{"white": 547, "red": 459}'),
    (sky_ocean_id, 14, 4, '{"white": 399, "red": 323}'),
    (sky_ocean_id, 15, 4, '{"white": 284, "red": 235}'),
    (sky_ocean_id, 16, 4, '{"white": 432, "red": 372}'),
    (sky_ocean_id, 17, 3, '{"white": 137, "red": 109}'),
    (sky_ocean_id, 18, 5, '{"white": 558, "red": 453}');


    -- 4. Insert Detailed Rounds Linked to These Users & Courses
    -- Insert Professional Rounds (Kim Pro)
    INSERT INTO rounds (user_id, date, tee_time, club_id, club_name, course_id, course_name, total_score, is_public, weather, memo, green_fee, caddy_fee)
    VALUES 
        ('00000000-0000-0000-0000-000000000001', '2026-02-01', '07:30', sky72_id, 'SKY72 골프클럽(바다코스)', sky_ocean_id, '오션 코스', 71, true, '맑음', '언더파 달성! 아이언 샷감이 매우 좋았습니다.', 250000, 150000),
        ('00000000-0000-0000-0000-000000000001', '2026-01-15', '11:45', cc88_id, '88CC', cc88_east_id, '동 코스', 74, true, '흐림', '그린 스피드가 빨라 퍼팅에서 고생했네요.', 210000, 150000);

    -- Insert Newbie Rounds (Lee Newbie)
    INSERT INTO rounds (user_id, date, tee_time, club_id, club_name, course_id, course_name, total_score, is_public, weather, memo, green_fee, caddy_fee)
    VALUES 
        ('00000000-0000-0000-0000-000000000002', '2026-02-03', '13:20', sky72_id, 'SKY72 골프클럽(바다코스)', sky_hanul_id, '하늘 코스', 108, true, '맑음', '첫 하늘코스! 경치는 좋았는데 공을 너무 많이 잃어버렸어요.', 230000, 150000),
        ('00000000-0000-0000-0000-000000000002', '2025-12-20', '08:15', cc88_id, '88CC', cc88_west_id, '서 코스', 115, true, '추움', '겨울 골프라 몸이 안 풀렸네요. 그래도 즐거웠습니다.', 180000, 140000);

    -- Insert Mania Rounds (Choi Mania)
    INSERT INTO rounds (user_id, date, tee_time, club_id, club_name, course_id, course_name, total_score, is_public, weather, memo, green_fee, caddy_fee)
    VALUES 
        ('00000000-0000-0000-0000-000000000003', '2026-02-02', '08:00', cc88_id, '88CC', cc88_east_id, '동 코스', 85, true, '맑음', '드라이버가 똑바로 가니 스코어가 따라오네요.', 210000, 150000),
        ('00000000-0000-0000-0000-000000000003', '2026-01-20', '10:30', sky72_id, 'SKY72 골프클럽(바다코스)', sky_ocean_id, '오션 코스', 89, true, '바람', '바다코스답게 바람이 엄청났습니다.', 250000, 150000);

    -- Insert Single Rounds (Park Single)
    INSERT INTO rounds (user_id, date, tee_time, club_id, club_name, course_id, course_name, total_score, is_public, weather, memo, green_fee, caddy_fee)
    VALUES 
        ('00000000-0000-0000-0000-000000000004', '2026-02-04', '06:45', sky72_id, 'SKY72 골프클럽(바다코스)', sky_ocean_id, '오션 코스', 78, true, '맑음', '이른 아침 라운딩, 상쾌하고 좋았습니다.', 220000, 150000);

END $$;
