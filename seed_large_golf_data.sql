DO $$
DECLARE
    club_id UUID;
    course_id UUID;
    club_name TEXT;
    course_names TEXT[];
    course_name_item TEXT;
    h_idx INT;
    pars INT[] := ARRAY[4, 4, 4, 3, 4, 5, 4, 4, 4]; -- 36 Par for 9-holes
BEGIN
    -- List of (Golf Club, Course/Courses)
    -- Formatting: 'Club Name|Course1,Course2'
    FOR club_name, course_names IN 
        SELECT (string_to_array(x, '|'))[1], string_to_array((string_to_array(x, '|'))[2], ',')
        FROM unnest(ARRAY[
            '썬힐|밸리,썬',
            '360도|In,Out',
            '파주|East,West',
            '그린힐|In,Out',
            '떼제베|한울(동북),마루(북동)',
            '솔모로|Maple,Pine',
            '아시아드|레이크,밸리',
            '센추리21|Valley,Field',
            '리베라|체리힐,파인힐',
            '플라밍고|리버,링크스',
            '강동 디아너스cc|Lake,Valley',
            '베뉴지|HILL,G',
            '골프존카운티 천안|OUT,IN',
            '비에이비스타|HOPARK,BUONA,LAGO,VISTA',
            '세이지우드 홍천|드림,비전',
            '안성베네스트|East,South',
            '경주|MOON,SEA',
            '알프스대영|In,Out',
            '실크밸리|Valley,Lake,Silk',
            '벨라스톤|스톤,벨라',
            '골프클럽 Q|PAMPAS,VALLEY',
            '캐슬파인|레이크,밸리',
            '포웰CC|Birch Hill,Oak Hill',
            '남여주|마루,누리',
            '태광|북,서',
            'SG아름다운|힐,레이크',
            '골드|마스터OUT,마스터IN,챔피언IN,챔피언OUT',
            '윈체스트안성|클래식,로맨틱',
            '블루원 용인|Middle,West',
            '동서울cc|OUT',
            '로제비앙|비앙,로제',
            '모나크|마운틴,그랜드',
            '음성 힐데스하임|Lake,Hill',
            '해솔리아|해,솔',
            '오크힐스|힐,브릿지',
            '스카이밸리|LAKE,MOUNTAIN',
            '샤인데일|레이크,데일',
            '고령오펠|푸르내,미리내',
            '대영베이스|OUT',
            '이포CC|out,in',
            '대영힐스|미',
            '벨라45|마스터스E,마스터스C'
        ]) AS x
    LOOP
        -- 1. Ensure Golf Club exists
        SELECT id INTO club_id FROM golf_clubs WHERE name = club_name LIMIT 1;
        
        IF club_id IS NULL THEN
            club_id := gen_random_uuid();
            INSERT INTO golf_clubs (id, name, location, hole_count)
            VALUES (club_id, club_name, 'Unknown', array_length(course_names, 1) * 9);
        ELSE
            -- Update hole count if already exists (approximate)
            UPDATE golf_clubs SET hole_count = GREATEST(hole_count, array_length(course_names, 1) * 9) WHERE id = club_id;
        END IF;

        -- 2. Process Courses
        FOREACH course_name_item IN ARRAY course_names
        LOOP
            -- Ensure Course exists for this club
            SELECT id INTO course_id FROM golf_courses 
            WHERE golf_club_id = club_id AND name = course_name_item LIMIT 1;

            IF course_id IS NULL THEN
                course_id := gen_random_uuid();
                INSERT INTO golf_courses (id, golf_club_id, name, holes, total_par)
                VALUES (course_id, club_id, course_name_item, 9, 36);

                -- 3. Insert Hole Data (1-9)
                FOR h_idx IN 1..9 LOOP
                    INSERT INTO golf_course_holes (course_id, hole, par, distances)
                    VALUES (course_id, h_idx, pars[h_idx], '{}'::jsonb);
                END LOOP;
            END IF;
        END LOOP;
    END LOOP;
END $$;
