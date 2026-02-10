-- 1. Move courses from '세이지우드 홍천' to '세이지우드CC홍천'
UPDATE golf_courses
SET golf_club_id = '4b1c6cc1-1703-4da0-ae2a-b65151c1feab' -- 세이지우드CC홍천 ID
WHERE golf_club_id = 'a3b726fc-3c92-4773-a3f0-c83378e070c4'; -- 세이지우드 홍천 ID

-- 2. Delete the redundant '세이지우드 홍천' golf club entry
DELETE FROM golf_clubs
WHERE id = 'a3b726fc-3c92-4773-a3f0-c83378e070c4';

-- 3. Sync hole_count for '세이지우드CC홍천'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '4b1c6cc1-1703-4da0-ae2a-b65151c1feab'
)
WHERE id = '4b1c6cc1-1703-4da0-ae2a-b65151c1feab';
