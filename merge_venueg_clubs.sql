-- 1. Move courses from '베뉴지' to '베뉴지C.C.'
UPDATE golf_courses
SET golf_club_id = 'b8632f37-f15e-4ca7-99d0-069eb0917d16' -- ID of '베뉴지C.C.'
WHERE golf_club_id = '6ec5c0c5-4d47-4110-a116-ed2947126e22'; -- ID of '베뉴지'

-- 2. Delete the redundant '베뉴지' golf club entry
DELETE FROM golf_clubs
WHERE id = '6ec5c0c5-4d47-4110-a116-ed2947126e22';

-- 3. Sync hole_count for '베뉴지C.C.'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = 'b8632f37-f15e-4ca7-99d0-069eb0917d16'
)
WHERE id = 'b8632f37-f15e-4ca7-99d0-069eb0917d16';
