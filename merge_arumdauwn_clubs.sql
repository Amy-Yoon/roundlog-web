-- 1. Delete the "wrong" '아름다운cc' (진천 소재) first to free up the name
DELETE FROM golf_clubs
WHERE id = '41410017-ac35-428d-b5af-1513dc70c3a0';

-- 2. Rename '에스지아름다운' to '아름다운cc'
UPDATE golf_clubs
SET name = '아름다운cc'
WHERE id = '477ada6e-ef9b-47ff-a504-4f0eeca0ee65';

-- 3. Move courses from 'SG아름다운' to the renamed '아름다운cc'
UPDATE golf_courses
SET golf_club_id = '477ada6e-ef9b-47ff-a504-4f0eeca0ee65'
WHERE golf_club_id = '93de82a0-a133-4c10-802c-360ac5e8c32e';

-- 4. Delete the other '아름다운cc' (진천) which has no courses/rounds
DELETE FROM golf_clubs
WHERE id = '41410017-ac35-428d-b5af-1513dc70c3a0';

-- 5. Sync hole_count for the final '아름다운cc'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '477ada6e-ef9b-47ff-a504-4f0eeca0ee65'
)
WHERE id = '477ada6e-ef9b-47ff-a504-4f0eeca0ee65';
