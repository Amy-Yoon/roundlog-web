-- 1. Move courses from '골프클럽 Q' to '골프클럽Q'
UPDATE golf_courses
SET golf_club_id = '2f168b38-07ee-46f3-878c-b18cdd934bc5' -- ID of '골프클럽Q'
WHERE golf_club_id = 'fde7ee7e-7f98-481d-b858-56f5779c7006'; -- ID of '골프클럽 Q'

-- 2. Delete the redundant '골프클럽 Q' golf club entry
DELETE FROM golf_clubs
WHERE id = 'fde7ee7e-7f98-481d-b858-56f5779c7006';

-- 3. Sync hole_count for '골프클럽Q'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '2f168b38-07ee-46f3-878c-b18cdd934bc5'
)
WHERE id = '2f168b38-07ee-46f3-878c-b18cdd934bc5';
