-- ==============================================================================
-- Schema V2 Migration Script
-- Purpose: Refactor rounds to support flexible split courses and detailed/summary entry
-- Date: 2026-02-06
-- ==============================================================================

BEGIN;

-- 1. Backup existing rounds table (Just in case, even if there's an existing backup)
CREATE TABLE IF NOT EXISTS rounds_backup_v2_pre_migration AS SELECT * FROM rounds;

-- 2. Create round_courses table
-- Links a round to one or more golf_courses (e.g. Front 9, Back 9)
CREATE TABLE IF NOT EXISTS round_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES golf_courses(id),
    sequence SMALLINT NOT NULL, -- 1 = First Course, 2 = Second Course
    hole_start SMALLINT NOT NULL DEFAULT 1, -- e.g. 1
    hole_end SMALLINT NOT NULL DEFAULT 9,   -- e.g. 9
    holes_count SMALLINT NOT NULL DEFAULT 9,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Create round_holes table
-- Stores hole-by-hole scores. Linked to round_courses to map to specific course data.
CREATE TABLE IF NOT EXISTS round_holes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_course_id UUID NOT NULL REFERENCES round_courses(id) ON DELETE CASCADE,
    hole_no SMALLINT NOT NULL, -- 1-18 relative to the full round
    par SMALLINT NOT NULL,
    score SMALLINT, -- Nullable for summary mode
    hole_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Modifying rounds table
-- We need to drop the legacy columns. 
-- WARNING: This is destructive. Data in these columns will be lost (but is backed up).

ALTER TABLE rounds 
    DROP COLUMN IF EXISTS course_id,
    DROP COLUMN IF EXISTS course_id_out,
    DROP COLUMN IF EXISTS course_id_in,
    DROP COLUMN IF EXISTS course_name_out,
    DROP COLUMN IF EXISTS course_name_in,
    DROP COLUMN IF EXISTS hole_scores;

-- Add new columns
ALTER TABLE rounds
    ADD COLUMN IF NOT EXISTS play_tee TEXT; -- e.g. 'White', 'Red'

-- Note: 'total_score' remains as is. 'is_public' remains as is.

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_round_courses_round_id ON round_courses(round_id);
CREATE INDEX IF NOT EXISTS idx_round_holes_round_course_id ON round_holes(round_course_id);

-- 6. RLS Policies for new tables
ALTER TABLE round_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE round_holes ENABLE ROW LEVEL SECURITY;

-- round_courses policies
CREATE POLICY "Users can view their own round courses" ON round_courses
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM rounds WHERE rounds.id = round_courses.round_id AND rounds.user_id = auth.uid())
        OR 
        EXISTS (SELECT 1 FROM rounds WHERE rounds.id = round_courses.round_id AND rounds.is_public = true)
    );

CREATE POLICY "Users can insert their own round courses" ON round_courses
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM rounds WHERE rounds.id = round_courses.round_id AND rounds.user_id = auth.uid())
    );

CREATE POLICY "Users can update their own round courses" ON round_courses
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM rounds WHERE rounds.id = round_courses.round_id AND rounds.user_id = auth.uid())
    );

CREATE POLICY "Users can delete their own round courses" ON round_courses
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM rounds WHERE rounds.id = round_courses.round_id AND rounds.user_id = auth.uid())
    );

-- round_holes policies
CREATE POLICY "Users can view their own round holes" ON round_holes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM round_courses rc
            JOIN rounds r ON r.id = rc.round_id
            WHERE rc.id = round_holes.round_course_id 
            AND (r.user_id = auth.uid() OR r.is_public = true)
        )
    );

CREATE POLICY "Users can insert their own round holes" ON round_holes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM round_courses rc
            JOIN rounds r ON r.id = rc.round_id
            WHERE rc.id = round_holes.round_course_id 
            AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own round holes" ON round_holes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM round_courses rc
            JOIN rounds r ON r.id = rc.round_id
            WHERE rc.id = round_holes.round_course_id 
            AND r.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own round holes" ON round_holes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM round_courses rc
            JOIN rounds r ON r.id = rc.round_id
            WHERE rc.id = round_holes.round_course_id 
            AND r.user_id = auth.uid()
        )
    );

COMMIT;
