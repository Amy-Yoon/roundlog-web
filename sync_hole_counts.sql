-- 1. Update existing hole_counts for all clubs
UPDATE golf_clubs gc
SET hole_count = COALESCE((
    SELECT SUM(holes)
    FROM golf_courses gco
    WHERE gco.golf_club_id = gc.id
), 0);

-- 2. Create function to sync specific club hole count
CREATE OR REPLACE FUNCTION sync_club_hole_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE golf_clubs
        SET hole_count = (
            SELECT SUM(holes)
            FROM golf_courses
            WHERE golf_club_id = NEW.golf_club_id
        )
        WHERE id = NEW.golf_club_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE golf_clubs
        SET hole_count = (
            SELECT SUM(holes)
            FROM golf_courses
            WHERE golf_club_id = OLD.golf_club_id
        )
        WHERE id = OLD.golf_club_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger on golf_courses table
DROP TRIGGER IF EXISTS trigger_sync_hole_count ON golf_courses;
CREATE TRIGGER trigger_sync_hole_count
AFTER INSERT OR UPDATE OR DELETE ON golf_courses
FOR EACH ROW
EXECUTE FUNCTION sync_club_hole_count();
