-- 1. Move courses from '알프스대영' to '알프스대영컨트리클럽'
UPDATE golf_courses
SET golf_club_id = '1f754de8-4c11-45ff-80b4-d445c6995e75' -- 알프스대영컨트리클럽 ID
WHERE golf_club_id = 'a2708aba-2b1e-43fa-ac6d-f6d92145e1ae'; -- 알프스대영 ID

-- 2. Delete the redundant '알프스대영' golf club entry
DELETE FROM golf_clubs
WHERE id = 'a2708aba-2b1e-43fa-ac6d-f6d92145e1ae';

-- 3. Sync hole_count for '알프스대영컨트리클럽'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '1f754de8-4c11-45ff-80b4-d445c6995e75'
)
WHERE id = '1f754de8-4c11-45ff-80b4-d445c6995e75';
