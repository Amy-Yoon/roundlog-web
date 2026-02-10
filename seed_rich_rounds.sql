-- Rich Data Seed Script
-- Populates 7 rounds with full details: 18-hole scores, economics, conditions, partners
-- Ensures Total Score matches sum of Hole Scores

-- 1. Create Users if not exist
INSERT INTO users (id, email, name, handicap, bio) 
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'pro_k@roundlog.com', '김프로', 3, 'KPGA 투어 프로를 꿈꾸는 열혈 골퍼입니다.'),
    ('00000000-0000-0000-0000-000000000002', 'newbie_lee@roundlog.com', '이백돌', 28, '이제 막 시작한 골린이입니다. 100타 깨기가 목표!'),
    ('00000000-0000-0000-0000-000000000003', 'mania_choi@roundlog.com', '최매니아', 12, '주말마다 라운딩 가는 필드 매니아입니다.'),
    ('00000000-0000-0000-0000-000000000004', 'single_park@roundlog.com', '박싱글', 7, '안정적인 싱글 플레이어를 지향합니다.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Clean existing rounds for these users to avoid duplicates
DELETE FROM rounds WHERE user_id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004'
);

-- 3. Insert Rich Rounds
INSERT INTO rounds (
    id, user_id, date, tee_time, 
    club_id, club_name, 
    course_id, course_name, -- Legacy support
    course_id_out, course_name_out,
    course_id_in, course_name_in,
    total_score, hole_scores, 
    is_public, weather, temperature, wind_speed,
    green_fee, cart_fee, caddy_fee, 
    green_speed, tee_box_condition, fairway_rating, green_rating,
    partners, memo
) VALUES 
    -- 1. Kim Pro: SKY72 Ocean (Ocean OUT + Ocean IN) (71 strokes, Under Par)
    -- Expenses: High end
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '2026-02-04', '07:30', 
    '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', 'SKY72 골프클럽(바다코스)', 
    'c0000000-0000-0000-0000-000000000001', '오션 코스',
    'c0000000-0000-0000-0000-000000000001', '오션 코스 (OUT)',
    'c0000000-0000-0000-0000-000000000002', '오션 코스 (IN)',
    71, 
    '{"1": 4, "2": 4, "3": 2, "4": 4, "5": 5, "6": 4, "7": 5, "8": 3, "9": 4, "10": 4, "11": 4, "12": 3, "13": 5, "14": 4, "15": 4, "16": 4, "17": 3, "18": 5}',
    true, '맑음', 18, '2m/s',
    250000, 25000, 40000, 
    2.9, 'well_maintained_grass', 5, 5,
    '박싱글, 최매니아, 이백돌', 
    '언더파 달성! 아이언 샷감이 매우 좋았습니다. 3번홀 니어핀 버디가 결정적이었음.'),

    -- 2. Kim Pro: 88CC East (East OUT + East IN) (74 strokes)
    ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '2026-01-15', '11:45', 
    'aedbc4b5-6503-4af9-8b49-e5c9d0fafd0e', '88CC', 
    'c1000000-0000-0000-0000-000000000001', '동 코스', 
    'c1000000-0000-0000-0000-000000000001', '동 코스 (OUT)',
    'c1000000-0000-0000-0000-000000000002', '동 코스 (IN)',
    74,
    '{"1": 4, "2": 4, "3": 3, "4": 4, "5": 5, "6": 4, "7": 5, "8": 4, "9": 4, "10": 4, "11": 5, "12": 3, "13": 5, "14": 4, "15": 4, "16": 5, "17": 3, "18": 4}',
    true, '흐림', 12, '4m/s',
    210000, 25000, 40000,
    3.2, 'some_mats', 4, 5,
    '김부장, 이과장, 박대리',
    '그린 스피드가 빨라 퍼팅에서 고생했네요. 동코스 12번홀은 역시 어렵습니다.'),

    -- 3. Newbie Lee: SKY72 Lake (Lake OUT + Lake IN) (108 strokes) -> Changed from Sky to Lake as Sky is not in seed_split_courses
    ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '2026-02-03', '13:20', 
    '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', 'SKY72 골프클럽(바다코스)', 
    'c0000000-0000-0000-0000-000000000003', '레이크 코스', 
    'c0000000-0000-0000-0000-000000000003', '레이크 코스 (OUT)',
    'c0000000-0000-0000-0000-000000000004', '레이크 코스 (IN)',
    108,
    '{"1": 6, "2": 7, "3": 4, "4": 6, "5": 8, "6": 6, "7": 7, "8": 5, "9": 6, "10": 6, "11": 6, "12": 5, "13": 8, "14": 6, "15": 5, "16": 6, "17": 5, "18": 6}',
    true, '맑음', 20, '3m/s',
    230000, 25000, 40000,
    2.6, 'well_maintained_grass', 3, 4,
    '김프로, 최매니아', 
    '첫 레이크코스! 경치는 좋았는데 공을 너무 많이 잃어버렸어요. 다음엔 꼭 100개 깰거야.'),

    -- 4. Newbie Lee: 88CC West (West OUT + West IN) (115 strokes)
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
    '겨울 골프라 몸이 안 풀렸네요. 그래도 즐거웠습니다. 오뎅탕이 맛있었어요.'),

    -- 5. Mania Choi: 88CC East (East OUT + East IN) (85 strokes)
    ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', '2026-02-02', '08:00', 
    'aedbc4b5-6503-4af9-8b49-e5c9d0fafd0e', '88CC', 
    'c1000000-0000-0000-0000-000000000001', '동 코스',
    'c1000000-0000-0000-0000-000000000001', '동 코스 (OUT)',
    'c1000000-0000-0000-0000-000000000002', '동 코스 (IN)',
    85,
    '{"1": 5, "2": 5, "3": 4, "4": 5, "5": 5, "6": 4, "7": 5, "8": 3, "9": 5, "10": 5, "11": 5, "12": 4, "13": 5, "14": 5, "15": 5, "16": 5, "17": 4, "18": 6}',
    true, '맑음', 15, '1m/s',
    210000, 25000, 40000,
    2.8, 'some_mats', 4, 4,
    '동호회 월례회',
    '드라이버가 똑바로 가니 스코어가 따라오네요. 후반 체력이 조금 아쉬웠습니다.'),

    -- 6. Mania Choi: SKY72 Ocean (Ocean OUT + Ocean IN) (89 strokes)
    ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', '2026-01-20', '10:30', 
    '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', 'SKY72 골프클럽(바다코스)', 
    'c0000000-0000-0000-0000-000000000001', '오션 코스', 
    'c0000000-0000-0000-0000-000000000001', '오션 코스 (OUT)',
    'c0000000-0000-0000-0000-000000000002', '오션 코스 (IN)',
    89,
    '{"1": 5, "2": 5, "3": 4, "4": 6, "5": 5, "6": 5, "7": 6, "8": 3, "9": 5, "10": 5, "11": 5, "12": 4, "13": 6, "14": 5, "15": 5, "16": 5, "17": 4, "18": 6}',
    true, '바람', 8, '8m/s',
    250000, 25000, 40000,
    2.7, 'well_maintained_grass', 5, 5,
    '비즈니스 파트너',
    '바다코스답게 바람이 엄청났습니다. 3클럽 더 잡아야 할 정도였네요.'),

    -- 7. Park Single: SKY72 Ocean (Ocean OUT + Ocean IN) (78 strokes)
    ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000004', '2026-02-04', '06:45', 
    '8ceba6f8-0cf8-49b4-a3e0-3aa89c3903a3', 'SKY72 골프클럽(바다코스)', 
    'c0000000-0000-0000-0000-000000000001', '오션 코스', 
    'c0000000-0000-0000-0000-000000000001', '오션 코스 (OUT)',
    'c0000000-0000-0000-0000-000000000002', '오션 코스 (IN)',
    78,
    '{"1": 4, "2": 5, "3": 3, "4": 4, "5": 5, "6": 4, "7": 5, "8": 3, "9": 4, "10": 4, "11": 5, "12": 4, "13": 5, "14": 4, "15": 5, "16": 5, "17": 4, "18": 5}',
    true, '맑음', 16, '2m/s',
    220000, 25000, 40000,
    3.0, 'well_maintained_grass', 5, 5,
    '김프로, 이백돌',
    '이른 아침 라운딩, 상쾌하고 좋았습니다. 동반자 매너도 굿!')
ON CONFLICT (id) DO UPDATE SET
    hole_scores = EXCLUDED.hole_scores,
    total_score = EXCLUDED.total_score,
    memo = EXCLUDED.memo,
    weather = EXCLUDED.weather,
    temperature = EXCLUDED.temperature,
    wind_speed = EXCLUDED.wind_speed,
    partners = EXCLUDED.partners,
    green_fee = EXCLUDED.green_fee,
    cart_fee = EXCLUDED.cart_fee,
    caddy_fee = EXCLUDED.caddy_fee,
    green_speed = EXCLUDED.green_speed,
    tee_box_condition = EXCLUDED.tee_box_condition,
    fairway_rating = EXCLUDED.fairway_rating,
    green_rating = EXCLUDED.green_rating,
    -- Also update the new split course fields on conflict
    course_id_out = EXCLUDED.course_id_out,
    course_name_out = EXCLUDED.course_name_out,
    course_id_in = EXCLUDED.course_id_in,
    course_name_in = EXCLUDED.course_name_in,
    course_id = EXCLUDED.course_id,
    course_name = EXCLUDED.course_name;
