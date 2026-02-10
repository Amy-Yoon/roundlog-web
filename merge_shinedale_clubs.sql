-- 1. Move courses from '샤인데일' to '샤인데일골프&리조트'
UPDATE golf_courses
SET golf_club_id = '34e556d8-13e4-49b0-8f18-4e94717df054' -- 샤인데일골프&리조트 ID
WHERE golf_club_id = '7374fb2f-bff9-44f1-a72a-b7776b11b54f'; -- 샤인데일 ID

-- 2. Delete the redundant '샤인데일' golf club entry
DELETE FROM golf_clubs
WHERE id = '7374fb2f-bff9-44f1-a72a-b7776b11b54f';

-- 3. Sync hole_count for '샤인데일골프&리조트'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '34e556d8-13e4-49b0-8f18-4e94717df054'
)
WHERE id = '34e556d8-13e4-49b0-8f18-4e94717df054';
