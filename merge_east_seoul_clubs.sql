-- 1. Move courses from '동서울cc' to '동서울레스피아'
UPDATE golf_courses
SET golf_club_id = '277051e0-41da-44b9-8ca3-c2c690732075' -- 동서울레스피아 ID
WHERE golf_club_id = '1c26f1b3-c751-4961-a573-b850dfa88fa8'; -- 동서울cc ID

-- 2. Delete the redundant '동서울cc' golf club entry
DELETE FROM golf_clubs
WHERE id = '1c26f1b3-c751-4961-a573-b850dfa88fa8';

-- 3. Sync hole_count for '동서울레스피아'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '277051e0-41da-44b9-8ca3-c2c690732075'
)
WHERE id = '277051e0-41da-44b9-8ca3-c2c690732075';
