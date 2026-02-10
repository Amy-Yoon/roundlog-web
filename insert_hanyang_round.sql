-- insert_hanyang_round.sql
-- Adds a detailed public round for Hanyang CC New Course

DO $$
DECLARE
    v_round_id UUID := gen_random_uuid();
    v_user_id UUID := '00000000-0000-0000-0000-000000000002'; -- Lee Newbie
    v_club_id UUID := '6b2e04f1-6330-47b2-bd0b-88a383838383'; -- Hanyang CC
    v_course_id UUID := 'c1000000-0000-0000-0000-000000000001'; -- New Course
    v_rc_id UUID;
BEGIN
    -- 1. Insert into rounds
    INSERT INTO rounds (
        id, user_id, date, tee_time, club_id, club_name, 
        total_score, is_public, weather, memo, partners,
        green_fee, cart_fee, caddy_fee, play_tee,
        created_at
    ) VALUES (
        v_round_id, v_user_id, CURRENT_DATE, '08:30', v_club_id, '한양CC',
        92, true, '맑음', '한양CC 신코스 첫 방문! 페어웨이가 넓고 관리가 아주 잘 되어 있었습니다.', '김철수, 박지민, 최수용',
        220000, 100000, 150000, 'White',
        NOW()
    );

    -- 2. Insert into round_courses
    INSERT INTO round_courses (
        round_id, course_id, sequence, hole_start, hole_end, holes_count
    ) VALUES (
        v_round_id, v_course_id, 1, 1, 18, 18
    ) RETURNING id INTO v_rc_id;

    -- 3. Insert into round_holes (Scores for 18 holes)
    -- Simplified: Loop through 1-18 and insert scores that sum to 92
    -- Pars: mostly 4, few 3s and 5s
    INSERT INTO round_holes (round_course_id, hole_no, par, score) VALUES
    (v_rc_id, 1, 4, 5), (v_rc_id, 2, 4, 4), (v_rc_id, 3, 3, 4), (v_rc_id, 4, 4, 6), (v_rc_id, 5, 5, 6),
    (v_rc_id, 6, 4, 5), (v_rc_id, 7, 5, 5), (v_rc_id, 8, 3, 3), (v_rc_id, 9, 4, 5), -- Out: 43
    (v_rc_id, 10, 4, 5), (v_rc_id, 11, 4, 6), (v_rc_id, 12, 3, 4), (v_rc_id, 13, 5, 7), (v_rc_id, 14, 4, 5),
    (v_rc_id, 15, 4, 5), (v_rc_id, 16, 4, 6), (v_rc_id, 17, 3, 4), (v_rc_id, 18, 5, 7); -- In: 49, Total: 92

END $$;
