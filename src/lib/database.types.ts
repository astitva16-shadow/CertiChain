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
      certificates: {
        Row: {
          id: string
          created_at: string
          user_id: string
          certificate_id: string
          recipient_name: string
          recipient_email: string
          course_name: string
          issue_date: string
          certificate_data: Json
          qr_code: string | null
          is_verified: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          certificate_id: string
          recipient_name: string
          recipient_email: string
          course_name: string
          issue_date: string
          certificate_data: Json
          qr_code?: string | null
          is_verified?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          certificate_id?: string
          recipient_name?: string
          recipient_email?: string
          course_name?: string
          issue_date?: string
          certificate_data?: Json
          qr_code?: string | null
          is_verified?: boolean
          metadata?: Json | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          organization: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          organization?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          organization?: string | null
        }
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
  }
}
