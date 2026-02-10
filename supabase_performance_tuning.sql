-- supabase_performance_tuning.sql
-- Optimizing golf_clubs table for search and sorting

-- 1. Create indexes for common sorting and filtering columns
CREATE INDEX IF NOT EXISTS idx_golf_clubs_name ON golf_clubs (name);
CREATE INDEX IF NOT EXISTS idx_golf_clubs_location ON golf_clubs (location);
CREATE INDEX IF NOT EXISTS idx_golf_clubs_hole_count ON golf_clubs (hole_count DESC);

-- 2. Enable pg_trgm for faster partial text matching (ilike %search%)
-- Uncomment the following lines if you have database superuser access or via Supabase dashboard
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX IF NOT EXISTS idx_golf_clubs_name_trgm ON golf_clubs USING gin (name gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_golf_clubs_location_trgm ON golf_clubs USING gin (location gin_trgm_ops);

COMMENT ON INDEX idx_golf_clubs_name IS 'Speeds up name-based sorting and searches';
COMMENT ON INDEX idx_golf_clubs_location IS 'Speeds up location-based sorting and searches';
COMMENT ON INDEX idx_golf_clubs_hole_count IS 'Speeds up sorting by hole count';
