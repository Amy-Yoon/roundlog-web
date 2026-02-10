-- 1. Move courses from '아시아드' to '아시아드컨드리클럽'
UPDATE golf_courses
SET golf_club_id = 'e1858c61-8d6c-4e42-8209-44b332c11f16' -- 아시아드컨드리클럽 ID
WHERE golf_club_id = '7a93de89-d66f-48a4-af16-859c215ca9e9'; -- 아시아드 ID

-- 2. Delete the redundant '아시아드' golf club entry
DELETE FROM golf_clubs
WHERE id = '7a93de89-d66f-48a4-af16-859c215ca9e9';

-- 3. Fix the typo in the target club name (컨드리 -> 컨트리)
UPDATE golf_clubs
SET name = '아시아드컨트리클럽'
WHERE id = 'e1858c61-8d6c-4e42-8209-44b332c11f16';

-- 4. Sync hole_count for the final '아시아드컨트리클럽'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = 'e1858c61-8d6c-4e42-8209-44b332c11f16'
)
WHERE id = 'e1858c61-8d6c-4e42-8209-44b332c11f16';
