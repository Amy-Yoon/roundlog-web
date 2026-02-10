-- 1. Move courses from '로제비앙' to '큐로CC'
UPDATE golf_courses
SET golf_club_id = '89b0e1f4-81b9-4f8f-8c19-405047daf9a7' -- ID of '큐로CC'
WHERE golf_club_id = '0cfdd104-0da9-43e0-9909-2490a092a4db'; -- ID of '로제비앙'

-- 2. Delete the redundant '로제비앙' golf club entry
DELETE FROM golf_clubs
WHERE id = '0cfdd104-0da9-43e0-9909-2490a092a4db';

-- 3. Rename '큐로CC' to '로제비앙CC'
UPDATE golf_clubs
SET name = '로제비앙CC'
WHERE id = '89b0e1f4-81b9-4f8f-8c19-405047daf9a7';

-- 4. Sync hole_count for the final '로제비앙CC'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '89b0e1f4-81b9-4f8f-8c19-405047daf9a7'
)
WHERE id = '89b0e1f4-81b9-4f8f-8c19-405047daf9a7';
