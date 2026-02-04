export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: UserProfile
                Insert: UserProfileInsert
                Update: UserProfileUpdate
            }
            golf_clubs: {
                Row: GolfClub
                Insert: GolfClubInsert
                Update: GolfClubUpdate
            }
            golf_courses: {
                Row: GolfCourse
                Insert: GolfCourseInsert
                Update: GolfCourseUpdate
            }
            golf_course_holes: {
                Row: GolfCourseHole
                Insert: GolfCourseHoleInsert
                Update: GolfCourseHoleUpdate
            }
            rounds: {
                Row: Round
                Insert: RoundInsert
                Update: RoundUpdate
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// User Profile Types
export interface UserProfile {
    id: string
    email: string
    name: string
    handicap: number
    bio?: string
    avatar_url?: string
    created_at?: string
}

export interface UserProfileInsert extends Omit<UserProfile, 'created_at'> {
    created_at?: string
}

export interface UserProfileUpdate extends Partial<UserProfileInsert> { }

// Golf Club Types
export interface GolfClub {
    id: string
    name: string
    location: string
    address?: string
    club_type?: string
    hole_count?: number
    created_at?: string
}

export interface GolfClubInsert extends Omit<GolfClub, 'id' | 'created_at'> {
    id?: string
}

export interface GolfClubUpdate extends Partial<GolfClubInsert> { }

// Golf Course Types
export interface GolfCourse {
    id: string
    golf_club_id: string
    name: string
    holes: number
    created_at?: string
}

export interface GolfCourseInsert extends Omit<GolfCourse, 'id' | 'created_at'> {
    id?: string
}

export interface GolfCourseUpdate extends Partial<GolfCourseInsert> { }

// Golf Course Hole Types
export interface GolfCourseHole {
    id: string
    course_id: string
    hole: number
    par: number
    distance?: number
    handicap?: number
    created_at?: string
}

export interface GolfCourseHoleInsert extends Omit<GolfCourseHole, 'id' | 'created_at'> {
    id?: string
}

export interface GolfCourseHoleUpdate extends Partial<GolfCourseHoleInsert> { }

// Round Types
// Round Types matching Supabase Schema
export interface Round {
    id: string
    user_id: string
    created_at?: string
    date: string
    tee_time: string
    club_id: string
    club_name: string
    course_id: string
    course_name: string
    total_score: number
    hole_scores?: Json // stored as JSONB
    green_fee?: number
    cart_fee?: number
    caddy_fee?: number
    total_cost?: number
    green_speed?: number
    tee_box_condition?: string
    fairway_rating?: number
    green_rating?: number
    weather?: string
    temperature?: number
    wind_speed?: string
    partners?: string
    memo?: string
    hole_comments?: Json // stored as JSONB
    is_public?: boolean
}

export interface RoundInsert extends Omit<Round, 'id' | 'created_at'> {
    id?: string
}

export interface RoundUpdate extends Partial<RoundInsert> { }

// Detailed Hole Scores (for Round Detail)
// Note: We are moving towards hole_scores being stored in JSONB or separate table
// This matches the legacy structure but matches the round detail needs
export interface HoleScore {
    id: string
    round_id: string
    hole_number: number
    par: number
    score: number
    putts?: number
    fairway_hit?: boolean
    gir?: boolean
}
