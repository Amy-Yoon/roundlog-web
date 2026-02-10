-- 1. Move courses from '해솔리아' to '해솔리아CC'
UPDATE golf_courses
SET golf_club_id = '317a4c71-646b-4cf5-8dac-f27fad4c9ddf' -- 해솔리아CC ID
WHERE golf_club_id = 'b0dea82f-e1de-459b-9f1e-982d57010d01'; -- 해솔리아 ID

-- 2. Delete the redundant '해솔리아' golf club entry
DELETE FROM golf_clubs
WHERE id = 'b0dea82f-e1de-459b-9f1e-982d57010d01';

-- 3. Sync hole_count for '해솔리아CC'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '317a4c71-646b-4cf5-8dac-f27fad4c9ddf'
)
WHERE id = '317a4c71-646b-4cf5-8dac-f27fad4c9ddf';
