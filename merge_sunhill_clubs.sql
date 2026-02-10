-- 1. Move courses from '썬힐' to '썬힐G.C(대중제)'
UPDATE golf_courses
SET golf_club_id = '51f6411a-a413-4240-b42a-7235b69e82a3' -- ID of '썬힐G.C(대중제)'
WHERE golf_club_id = '319603c3-1b24-4670-bb10-7430f5eaeb7e'; -- ID of '썬힐'

-- 2. Delete the redundant '썬힐' golf club entry
DELETE FROM golf_clubs
WHERE id = '319603c3-1b24-4670-bb10-7430f5eaeb7e';

-- 3. Sync hole_count for '썬힐G.C(대중제)'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '51f6411a-a413-4240-b42a-7235b69e82a3'
)
WHERE id = '51f6411a-a413-4240-b42a-7235b69e82a3';
