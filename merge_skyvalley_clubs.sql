-- 1. Move courses from '스카이밸리' to '스카이밸리(대중제)'
UPDATE golf_courses
SET golf_club_id = '22e8bde2-5aab-4101-aa86-a5e4679dd56c' -- 스카이밸리(대중제) ID
WHERE golf_club_id = '7c8bf09c-71d0-43a4-bd1e-4c8e5a33a02e'; -- 스카이밸리 ID

-- 2. Delete the redundant '스카이밸리' golf club entry
DELETE FROM golf_clubs
WHERE id = '7c8bf09c-71d0-43a4-bd1e-4c8e5a33a02e';

-- 3. Sync hole_count for '스카이밸리(대중제)'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '22e8bde2-5aab-4101-aa86-a5e4679dd56c'
)
WHERE id = '22e8bde2-5aab-4101-aa86-a5e4679dd56c';
