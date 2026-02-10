-- 1. Move courses from '태광' to '태광CC(회원제)'
UPDATE golf_courses
SET golf_club_id = '1c2c3d60-668e-4809-a99f-523a28881d1e' -- 태광CC(회원제) ID
WHERE golf_club_id = '6e61d00f-f6df-44ab-b042-2b7bb1464e55'; -- 태광 ID

-- 2. Delete the redundant '태광' golf club entry
DELETE FROM golf_clubs
WHERE id = '6e61d00f-f6df-44ab-b042-2b7bb1464e55';

-- 3. Sync hole_count for '태광CC(회원제)'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '1c2c3d60-668e-4809-a99f-523a28881d1e'
)
WHERE id = '1c2c3d60-668e-4809-a99f-523a28881d1e';
