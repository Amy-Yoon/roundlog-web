-- 1. Move courses from '센추리21' to '센추리21컨트리클럽(대중제)'
UPDATE golf_courses
SET golf_club_id = 'e3aaa75f-b9cc-4c72-bac4-113004424d7d' -- 센추리21컨트리클럽(대중제) ID
WHERE golf_club_id = '200e13da-e5be-41a6-ba4c-7ca8bb29f8c6'; -- 센추리21 ID

-- 2. Delete the redundant '센추리21' golf club entry
DELETE FROM golf_clubs
WHERE id = '200e13da-e5be-41a6-ba4c-7ca8bb29f8c6';

-- 3. Sync hole_count for '센추리21컨트리클럽(대중제)'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = 'e3aaa75f-b9cc-4c72-bac4-113004424d7d'
)
WHERE id = 'e3aaa75f-b9cc-4c72-bac4-113004424d7d';
