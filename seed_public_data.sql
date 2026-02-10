-- 1. Ensure schema is up to date
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- 2. Create dummy users for community data
-- Using representative UUIDs for dummy users
INSERT INTO users (id, email, name, handicap) 
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'pro@roundlog.com', '싱글메이커', 5),
    ('00000000-0000-0000-0000-000000000002', 'newbie@roundlog.com', '백돌이탈출', 25),
    ('00000000-0000-0000-0000-000000000003', 'golflover@roundlog.com', '필드매니아', 15)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    handicap = EXCLUDED.handicap;

-- 3. Insert public rounds linked to these dummy users and real clubs
-- We'll use subqueries to get club/course IDs by name for reliability
DO $$
DECLARE
    u_pro UUID := '00000000-0000-0000-0000-000000000001';
    u_newbie UUID := '00000000-0000-0000-0000-000000000002';
    u_mania UUID := '00000000-0000-0000-0000-000000000003';
    
    sky72_id UUID;
    sky72_course_id UUID;
    cc88_id UUID;
    cc88_course_id UUID;
    links_id UUID;
    links_course_id UUID;
BEGIN
    SELECT id INTO sky72_id FROM golf_clubs WHERE name = 'SKY72 골프클럽(바다코스)' LIMIT 1;
    SELECT id INTO sky72_course_id FROM golf_courses WHERE golf_club_id = sky72_id LIMIT 1;
    
    SELECT id INTO cc88_id FROM golf_clubs WHERE name = '88CC' LIMIT 1;
    SELECT id INTO cc88_course_id FROM golf_courses WHERE golf_club_id = cc88_id LIMIT 1;
    
    SELECT id INTO links_id FROM golf_clubs WHERE name = '사우스링스영암' LIMIT 1;
    SELECT id INTO links_course_id FROM golf_courses WHERE golf_club_id = links_id LIMIT 1;

    -- Delete existing dummy rounds to avoid duplicates
    DELETE FROM rounds WHERE user_id IN (u_pro, u_newbie, u_mania);

    -- Insert Single Maker's Rounds (Expert)
    INSERT INTO rounds (user_id, date, club_id, club_name, course_id, course_name, total_score, is_public, memo)
    VALUES 
        (u_pro, '2026-02-01', sky72_id, 'SKY72 골프클럽(바다코스)', sky72_course_id, '레귤러 코스', 74, true, '바람이 불었지만 샷감이 좋았습니다.'),
        (u_pro, '2026-01-25', cc88_id, '88CC', cc88_course_id, '레귤러 코스', 78, true, '그린이 아주 빨라요.');

    -- Insert Newbie's Rounds
    INSERT INTO rounds (user_id, date, club_id, club_name, course_id, course_name, total_score, is_public, memo)
    VALUES 
        (u_newbie, '2026-01-30', links_id, '사우스링스영암', links_course_id, '레귤러 코스', 98, true, '첫 라운딩! 너무 설렜습니다.'),
        (u_newbie, '2026-02-03', sky72_id, 'SKY72 골프클럽(바다코스)', sky72_course_id, '레귤러 코스', 105, true, '아직은 어렵네요 ㅠㅠ');

    -- Insert Mania's Rounds
    INSERT INTO rounds (user_id, date, club_id, club_name, course_id, course_name, total_score, is_public, memo)
    VALUES 
        (u_mania, '2026-02-02', cc88_id, '88CC', cc88_course_id, '레귤러 코스', 88, true, '88타 달성! 기분 최고.'),
        (u_mania, '2026-01-20', links_id, '사우스링스영암', links_course_id, '레귤러 코스', 92, true, '경치가 정말 좋습니다.');

END $$;
