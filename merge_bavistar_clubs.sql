-- 1. Move HOPARK, BUONA to 비에이비스타C.C.(대중제)
UPDATE golf_courses
SET golf_club_id = '099947b6-1fb9-4771-9678-2cd4c5084d3a' -- ID of '비에이비스타C.C.(대중제)'
WHERE id IN ('4cac5e8b-d75d-4f29-a626-7bda538203b5', '9f3355e3-1500-446b-a031-d24f3e65d855');

-- 2. Move LAGO, VISTA to 비에이비스타C.C.(회원제)
UPDATE golf_courses
SET golf_club_id = '60d72378-3a65-4e7f-95d3-26dee3959c47' -- ID of '비에이비스타C.C.(회원제)'
WHERE id IN ('8b636171-7150-4690-b004-048c97d48cb0', '5f3ff9a9-a4af-4d55-8262-b96874f11736');

-- 3. Delete redundant '비에이비스타' (Bavistar)
DELETE FROM golf_clubs
WHERE id = '7fe1bd49-48e1-403d-86de-3f8eb00ab201';

-- 4. Sync hole_counts for the target clubs
UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '099947b6-1fb9-4771-9678-2cd4c5084d3a'
)
WHERE id = '099947b6-1fb9-4771-9678-2cd4c5084d3a';

UPDATE golf_clubs
SET hole_count = (
    SELECT SUM(holes)
    FROM golf_courses
    WHERE golf_club_id = '60d72378-3a65-4e7f-95d3-26dee3959c47'
)
WHERE id = '60d72378-3a65-4e7f-95d3-26dee3959c47';
