-- 1. Move all courses from '골드' to '골드CC'
UPDATE golf_courses
SET golf_club_id = '03d21d4b-a05d-4e5f-8e42-236450df5d15' -- ID of '골드CC'
WHERE golf_club_id = 'c1df7b9f-e80a-41b2-8133-ad769fe11df0'; -- ID of '골드'

-- 2. Delete the redundant '골드' golf club entry
DELETE FROM golf_clubs
WHERE id = 'c1df7b9f-e80a-41b2-8133-ad769fe11df0';

-- 3. (Optional) Sync hole_count for '골드CC' if the trigger is not yet active
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '03d21d4b-a05d-4e5f-8e42-236450df5d15'
)
WHERE id = '03d21d4b-a05d-4e5f-8e42-236450df5d15';
