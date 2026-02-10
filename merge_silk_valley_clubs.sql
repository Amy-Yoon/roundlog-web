-- 1. Move all courses from '실크밸리' to '실크밸리G.C.'
UPDATE golf_courses
SET golf_club_id = '4ad183ed-9bc6-4d7c-b46f-ae2d90d2847d' -- ID of '실크밸리G.C.'
WHERE golf_club_id = '15ebff43-8b5f-4e64-8929-61a2ec2c6fd6'; -- ID of '실크밸리'

-- 2. Delete redundant '실크밸리'
DELETE FROM golf_clubs
WHERE id = '15ebff43-8b5f-4e64-8929-61a2ec2c6fd6';

-- 3. Sync hole_count for '실크밸리G.C.'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '4ad183ed-9bc6-4d7c-b46f-ae2d90d2847d'
)
WHERE id = '4ad183ed-9bc6-4d7c-b46f-ae2d90d2847d';
