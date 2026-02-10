-- 1. Move courses from '그린힐' to '그린힐컨트리클럽'
UPDATE golf_courses
SET golf_club_id = 'fe5fe6c3-8264-41a6-8844-3077290ee1e3' -- ID of '그린힐컨트리클럽'
WHERE golf_club_id = '707594cd-8713-4d43-b599-cd296fdc2673'; -- ID of '그린힐'

-- 2. Delete the redundant '그린힐' golf club entry
DELETE FROM golf_clubs
WHERE id = '707594cd-8713-4d43-b599-cd296fdc2673';

-- 3. Sync hole_count for '그린힐컨트리클럽'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = 'fe5fe6c3-8264-41a6-8844-3077290ee1e3'
)
WHERE id = 'fe5fe6c3-8264-41a6-8844-3077290ee1e3';
