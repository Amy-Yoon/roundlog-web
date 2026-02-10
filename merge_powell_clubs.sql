-- 1. Update '포웰CC' with metadata from '루나힐스 안성컨트리클럽'
UPDATE golf_clubs
SET 
    location = '경기',
    address = '안성시 양성면 약산길 67-6',
    club_type = '대중제'
WHERE id = '24107c5d-fb62-4f32-afb0-1336188ceab2';

-- 2. Move courses from '루나힐스 안성컨트리클럽' to '포웰CC'
UPDATE golf_courses
SET golf_club_id = '24107c5d-fb62-4f32-afb0-1336188ceab2'
WHERE golf_club_id = '22386d93-bd63-4eb8-8aa6-9573a5b3becd';

-- 3. Delete the redundant '루나힐스 안성컨트리클럽' entry
DELETE FROM golf_clubs
WHERE id = '22386d93-bd63-4eb8-8aa6-9573a5b3becd';

-- 4. Sync hole_count for '포웰CC'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '24107c5d-fb62-4f32-afb0-1336188ceab2'
)
WHERE id = '24107c5d-fb62-4f32-afb0-1336188ceab2';
