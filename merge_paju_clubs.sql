-- 1. Move courses from '파주' to '파주CC'
UPDATE golf_courses
SET golf_club_id = 'd4ff70e4-8208-4554-8f9e-1f059fb7c50d' -- 파주CC ID
WHERE golf_club_id = '7c1a3d88-9631-450a-b79d-1c8a83b4505b'; -- 파주 ID

-- 2. Delete the redundant '파주' golf club entry
DELETE FROM golf_clubs
WHERE id = '7c1a3d88-9631-450a-b79d-1c8a83b4505b';

-- 3. Sync hole_count for '파주CC'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = 'd4ff70e4-8208-4554-8f9e-1f059fb7c50d'
)
WHERE id = 'd4ff70e4-8208-4554-8f9e-1f059fb7c50d';
