-- 1. Move courses from '강동 디아너스cc' to '디아너스C.C'
UPDATE golf_courses
SET golf_club_id = '0b393a7d-da83-43ae-88f3-6d54bb3fe8cc' -- ID of '디아너스C.C'
WHERE golf_club_id = 'ded7fd71-889f-4b11-84db-9c07d1217621'; -- ID of '강동 디아너스cc'

-- 2. Delete the redundant '강동 디아너스cc' golf club entry
DELETE FROM golf_clubs
WHERE id = 'ded7fd71-889f-4b11-84db-9c07d1217621';

-- 3. Sync hole_count for '디아너스C.C'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '0b393a7d-da83-43ae-88f3-6d54bb3fe8cc'
)
WHERE id = '0b393a7d-da83-43ae-88f3-6d54bb3fe8cc';
