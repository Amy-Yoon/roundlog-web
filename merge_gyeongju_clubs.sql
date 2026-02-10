-- 1. Move courses from '경주' to '경주C.C'
UPDATE golf_courses
SET golf_club_id = 'f996b536-113f-4571-bb9b-6646b5480fac' -- ID of '경주C.C'
WHERE golf_club_id = '03078933-6cbe-4171-9338-637df1922c5c'; -- ID of '경주'

-- 2. Delete the redundant '경주' golf club entry
DELETE FROM golf_clubs
WHERE id = '03078933-6cbe-4171-9338-637df1922c5c';

-- 3. Sync hole_count for '경주C.C'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = 'f996b536-113f-4571-bb9b-6646b5480fac'
)
WHERE id = 'f996b536-113f-4571-bb9b-6646b5480fac';
