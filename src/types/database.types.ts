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
// Round Types (Updated for Schema V2)
export interface Round {
    id: string
    user_id: string
    created_at?: string
    date: string
    tee_time?: string
    club_id: string
    club_name: string
    total_score: number
    play_tee?: string // New field

    // Economics
    green_fee?: number
    cart_fee?: number
    caddy_fee?: number
    total_cost?: number

    // Conditions
    green_speed?: number
    tee_box_condition?: string
    fairway_rating?: number
    green_rating?: number
    weather?: string
    temperature?: number
    wind_speed?: string

    // Meta
    partners?: string
    memo?: string
    is_public?: boolean

    // Relations (Populated manually in application layer or via joins)
    round_courses?: RoundCourse[]
}

export interface RoundInsert extends Omit<Round, 'id' | 'created_at' | 'round_courses'> {
    id?: string
}

export interface RoundUpdate extends Partial<RoundInsert> { }

// Round Course (Split Course Support)
export interface RoundCourse {
    id: string
    round_id: string
    course_id: string
    sequence: number // 1 or 2
    hole_start: number
    hole_end: number
    holes_count: number
    created_at?: string

    // Relations
    round_holes?: RoundHole[]
    course?: GolfCourse // Joined data
}

export interface RoundCourseInsert extends Omit<RoundCourse, 'id' | 'created_at' | 'round_holes' | 'course'> {
    id?: string
}

// Round Hole (Detailed Score)
export interface RoundHole {
    id: string
    round_course_id: string
    hole_no: number // 1-18
    par: number
    score?: number | null
    hole_comment?: string
    created_at?: string
}

export interface RoundHoleInsert extends Omit<RoundHole, 'id' | 'created_at'> {
    id?: string
}
