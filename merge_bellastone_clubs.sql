-- 1. Move courses from '벨라스톤' to '벨라스톤컨트리클럽'
UPDATE golf_courses
SET golf_club_id = 'dd0b8925-83bb-4c02-a15d-fd69e4eaf16a' -- 벨라스톤컨트리클럽 ID
WHERE golf_club_id = 'db012755-1a2d-4920-871b-97af8d720b6a'; -- 벨라스톤 ID

-- 2. Delete the redundant '벨라스톤' golf club entry
DELETE FROM golf_clubs
WHERE id = 'db012755-1a2d-4920-871b-97af8d720b6a';

-- 3. Sync hole_count for '벨라스톤컨트리클럽'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = 'dd0b8925-83bb-4c02-a15d-fd69e4eaf16a'
)
WHERE id = 'dd0b8925-83bb-4c02-a15d-fd69e4eaf16a';
