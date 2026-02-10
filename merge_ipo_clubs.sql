-- 1. Move courses from '이포CC' to '이포'
UPDATE golf_courses
SET golf_club_id = '0dc49152-9819-442f-a7b4-ccb0bad4595e' -- 이포 ID
WHERE golf_club_id = '4a608cd5-07ef-462a-af51-e5dc94040a9c'; -- 이포CC ID

-- 2. Delete the redundant '이포CC' golf club entry
DELETE FROM golf_clubs
WHERE id = '4a608cd5-07ef-462a-af51-e5dc94040a9c';

-- 3. Sync hole_count for '이포'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '0dc49152-9819-442f-a7b4-ccb0bad4595e'
)
WHERE id = '0dc49152-9819-442f-a7b4-ccb0bad4595e';
