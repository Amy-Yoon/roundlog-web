-- 1. Move courses from '블루원 용인' to '블루원용인CC(대중제)'
UPDATE golf_courses
SET golf_club_id = '7c091f0e-b42c-4a43-bd51-2377b04909d1' -- 블루원용인CC(대중제) ID
WHERE golf_club_id = '375e0b76-3f90-4d36-9456-e0e570b52390'; -- 블루원 용인 ID

-- 2. Delete the redundant '블루원 용인' golf club entry
DELETE FROM golf_clubs
WHERE id = '375e0b76-3f90-4d36-9456-e0e570b52390';

-- 3. Sync hole_count for '블루원용인CC(대중제)'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '7c091f0e-b42c-4a43-bd51-2377b04909d1'
)
WHERE id = '7c091f0e-b42c-4a43-bd51-2377b04909d1';
