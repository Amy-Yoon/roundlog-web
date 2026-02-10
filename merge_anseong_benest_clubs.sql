-- 1. Move courses from '안성베네스트' to '안성베네스트G.C(대중제)'
UPDATE golf_courses
SET golf_club_id = '26b6ad6e-f206-4be4-a2e5-d5fcdc07a461' -- 안성베네스트G.C(대중제) ID
WHERE golf_club_id = 'da564787-fbfe-4b6e-a9b3-e69e698bb2d4'; -- 안성베네스트 ID

-- 2. Delete the redundant '안성베네스트' golf club entry
DELETE FROM golf_clubs
WHERE id = 'da564787-fbfe-4b6e-a9b3-e69e698bb2d4';

-- 3. Sync hole_count for '안성베네스트G.C(대중제)'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '26b6ad6e-f206-4be4-a2e5-d5fcdc07a461'
)
WHERE id = '26b6ad6e-f206-4be4-a2e5-d5fcdc07a461';
