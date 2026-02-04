-- 1. Schema Updates
-- Add is_public column if it doesn't exist
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- 2. Data Population: Golf Clubs (Real Korean Data)

-- Clear existing data if needed (Optional, be careful)
-- TRUNCATE TABLE golf_course_holes, golf_courses, golf_clubs CASCADE;

-- Insert Variables for IDs (Using a trick with DO block or just hardcoded UUID-like values / relying on return is harder in pure SQL script without vars. 
-- We will use hardcoded UUIDs for consistency in this script to link tables.)

-- Club 1: Sky72 Golf & Resort (Incheon)
INSERT INTO golf_clubs (id, name, location, address, description, rating)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '스카이72 골프 앤 리조트 (Sky72)', '인천', '인천광역시 중구 공항동로 135번길 267', '동북아 최대 규모의 프리미엄 퍼블릭 골프장. 오션, 레이크, 클래식, 하늘 코스 보유.', 4.8)
ON CONFLICT (id) DO NOTHING;

-- Club 2: Anyang Country Club (Gunpo)
INSERT INTO golf_clubs (id, name, location, address, description, rating)
VALUES 
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', '안양 컨트리클럽 (Anyang CC)', '경기 군포', '경기도 군포시 군포로 364', '대한민국 최고의 명문 골프장 중 하나로 수려한 조경과 최고의 관리를 자랑함.', 4.9)
ON CONFLICT (id) DO NOTHING;

-- Club 3: Blackstone Icheon (Icheon)
INSERT INTO golf_clubs (id, name, location, address, description, rating)
VALUES 
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', '블랙스톤 이천 (Blackstone Icheon)', '경기 이천', '경기도 이천시장호원읍 장일로 235', '자연 지형을 그대로 살린 전략적이고 도전적인 코스.', 4.7)
ON CONFLICT (id) DO NOTHING;

-- Club 4: South Springs (Icheon)
INSERT INTO golf_clubs (id, name, location, address, description, rating)
VALUES 
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d44', '사우스스프링스 CC', '경기 이천', '경기도 이천시 모가면 공원로 64', '최고의 샷밸류와 다양한 전략이 필요한 프레스티지 퍼블릭.', 4.6)
ON CONFLICT (id) DO NOTHING;


-- 3. Data Population: Courses

-- Sky72 Courses
INSERT INTO golf_courses (id, golf_club_id, name, holes, total_par) VALUES
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '오션 코스 (Ocean)', 18, 72),
('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '레이크 코스 (Lake)', 18, 72),
('a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '하늘 코스 (Hanul)', 18, 72)
ON CONFLICT (id) DO NOTHING;

-- Anyang Courses
INSERT INTO golf_courses (id, golf_club_id, name, holes, total_par) VALUES
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', '안양 코스', 18, 72)
ON CONFLICT (id) DO NOTHING;

-- Blackstone Courses
INSERT INTO golf_courses (id, golf_club_id, name, holes, total_par) VALUES
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', '북 코스 (North)', 9, 36),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', '동 코스 (East)', 9, 36),
('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', '서 코스 (West)', 9, 36)
ON CONFLICT (id) DO NOTHING;

-- 4. Data Population: Holes (Sample for Sky72 Ocean)
-- Requires JSONB for distances. 
-- Sky72 Ocean Hole 1-18 (Simplified for brevity, but detailed enough)

INSERT INTO golf_course_holes (course_id, hole, par, distances, handicap) VALUES
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 4, '{"red": 301, "white": 361, "blue": 405}', 16),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 4, '{"red": 290, "white": 328, "blue": 432}', 4),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 3, 3, '{"red": 126, "white": 170, "blue": 191}', 14),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 4, 4, '{"red": 273, "white": 295, "blue": 350}', 18),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 5, 5, '{"red": 405, "white": 487, "blue": 530}', 10),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 6, 4, '{"red": 279, "white": 328, "blue": 388}', 6),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 7, 5, '{"red": 432, "white": 498, "blue": 558}', 8),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 8, 3, '{"red": 148, "white": 175, "blue": 219}', 12),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 9, 4, '{"red": 301, "white": 383, "blue": 443}', 2),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 10, 4, '{"red": 328, "white": 383, "blue": 448}', 5),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 11, 4, '{"red": 279, "white": 344, "blue": 388}', 13),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 12, 3, '{"red": 175, "white": 202, "blue": 252}', 9),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 13, 5, '{"red": 459, "white": 547, "blue": 596}', 7),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 14, 4, '{"red": 323, "white": 399, "blue": 448}', 3),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 15, 4, '{"red": 235, "white": 284, "blue": 361}', 15),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 16, 4, '{"red": 372, "white": 432, "blue": 470}', 1),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 17, 3, '{"red": 109, "white": 137, "blue": 175}', 17),
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 18, 5, '{"red": 453, "white": 558, "blue": 620}', 11);

-- 5. Public Rounds Data (Mock data but linked to REAL courses)
-- User IDs are random/dummy as we don't know real user IDs.
-- NOTE: In a real scenario, you'd want valid User IDs if foreign keys enforce it.
-- Assuming 'users' table exists, we might need a dummy user.

-- (Optional) Create a dummy public user if needed
INSERT INTO users (id, name, email, bio)
VALUES ('00000000-0000-0000-0000-000000000001', 'Public Golfer', 'public@roundlog.com', 'A shadow user for public rounds')
ON CONFLICT (id) DO NOTHING;

-- Insert Rounds (Public)
INSERT INTO rounds (
    id, user_id, 
    club_id, club_name, 
    course_id, course_name, 
    date, tee_time, 
    total_score, 
    is_public, 
    weather, memo
) VALUES
(
    'r1eebc99-9c0b-4ef8-bb6d-6bb9bd380r01', 
    '00000000-0000-0000-0000-000000000001', 
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '스카이72', 
    'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '오션 코스', 
    '2023-10-15', '08:00', 
    82, 
    true, 
    'Sunny', '바람이 좀 불었지만 관리 상태 최고.'
),
(
    'r1eebc99-9c0b-4ef8-bb6d-6bb9bd380r02', 
    '00000000-0000-0000-0000-000000000001', 
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', '안양 CC', 
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380b22', '안양 코스', 
    '2023-10-14', '11:20', 
    95, 
    true, 
    'Cloudy', '역시 명문구장. 그린이 빠름.'
),
(
    'r1eebc99-9c0b-4ef8-bb6d-6bb9bd380r03', 
    '00000000-0000-0000-0000-000000000001', 
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', '블랙스톤 이천', 
    'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c33', '북 코스', 
    '2023-10-12', '07:40', 
    88, 
    true, 
    'Rainy', '비가 와서 힘들었음.'
)
ON CONFLICT (id) DO NOTHING;
