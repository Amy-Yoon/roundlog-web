-- 1. Move courses from '리베라' to '리베라CC'
UPDATE golf_courses
SET golf_club_id = '56676c5c-a29a-4dc0-82e3-5e08d8ccfa99' -- ID of '리베라CC'
WHERE golf_club_id = '7e130902-fc63-4879-ba78-97524d6a0939'; -- ID of '리베라'

-- 2. Delete the redundant '리베라' golf club entry
DELETE FROM golf_clubs
WHERE id = '7e130902-fc63-4879-ba78-97524d6a0939';

-- 3. Sync hole_count for '리베라CC'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '56676c5c-a29a-4dc0-82e3-5e08d8ccfa99'
)
WHERE id = '56676c5c-a29a-4dc0-82e3-5e08d8ccfa99';
