-- 1. Update '윈체스트안성' with metadata from '윈체스트 골프클럽 대중'
UPDATE golf_clubs
SET 
    location = '경기',
    address = '안성시 서운면 오촌길 97-31',
    club_type = '대중제'
WHERE id = '834ef06e-7f9b-4f02-9fdf-f39497cf8a93';

-- 2. Move courses from '윈체스트 골프클럽 대중' to '윈체스트안성'
UPDATE golf_courses
SET golf_club_id = '834ef06e-7f9b-4f02-9fdf-f39497cf8a93'
WHERE golf_club_id = '48e42e1f-7611-4695-95df-6f93646fff6f';

-- 3. Delete the redundant '윈체스트 골프클럽 대중' entry
DELETE FROM golf_clubs
WHERE id = '48e42e1f-7611-4695-95df-6f93646fff6f';

-- 4. Sync hole_count for '윈체스트안성'
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '834ef06e-7f9b-4f02-9fdf-f39497cf8a93'
)
WHERE id = '834ef06e-7f9b-4f02-9fdf-f39497cf8a93';
