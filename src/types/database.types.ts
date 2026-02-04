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
                Row: User
                Insert: UserInsert
                Update: UserUpdate
            }
            courses: {
                Row: Course
                Insert: CourseInsert
                Update: CourseUpdate
            }
            rounds: {
                Row: Round
                Insert: RoundInsert
                Update: RoundUpdate
            }
            hole_scores: {
                Row: HoleScore
                Insert: HoleScoreInsert
                Update: HoleScoreUpdate
            }
        }
    }
}

// User Types
export interface User {
    id: string
    email: string
    name: string
    handicap: number
    bio?: string
    avatar_url?: string
    created_at?: string
}

export interface UserInsert extends Omit<User, 'created_at'> {
    created_at?: string
}

export interface UserUpdate extends Partial<UserInsert> { }

// Course Types
export interface Course {
    id: string
    name: string
    location: string
    rating: number
    description: string
    created_at?: string
    // JSONB column for complex nested data in MVP
    sub_courses: SubCourse[]
}

export interface SubCourse {
    id: string
    name: string
    holes: number
    par: number
    holeData: HoleData[]
}

export interface HoleData {
    hole: number
    par: number
    distances: {
        ladies: number
        white: number
        blue: number
        black: number
    }
    handicap: number
}

export interface CourseInsert extends Omit<Course, 'id' | 'created_at'> {
    id?: string
}

export interface CourseUpdate extends Partial<CourseInsert> { }

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

export interface HoleScoreInsert extends Omit<HoleScore, 'id'> {
    id?: string
}

export interface HoleScoreUpdate extends Partial<HoleScoreInsert> { }
