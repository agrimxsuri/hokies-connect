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
      user_meta: {
        Row: {
          id: string
          role: 'student' | 'alumni'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'student' | 'alumni'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'student' | 'alumni'
          created_at?: string
          updated_at?: string
        }
      }
      student_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          majors: string[]
          current_standing: string | null
          club_positions: string[]
          minors: string[]
          profile_picture: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          majors: string[]
          current_standing?: string | null
          club_positions?: string[]
          minors?: string[]
          profile_picture?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          majors?: string[]
          current_standing?: string | null
          club_positions?: string[]
          minors?: string[]
          profile_picture?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      alumni_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          graduation_year: string
          current_position: string
          company: string
          location: string
          majors: string[]
          contact_info: Json
          profile_picture: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          graduation_year: string
          current_position: string
          company: string
          location: string
          majors: string[]
          contact_info?: Json
          profile_picture?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          graduation_year?: string
          current_position?: string
          company?: string
          location?: string
          majors?: string[]
          contact_info?: Json
          profile_picture?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      hokie_journey: {
        Row: {
          id: string
          user_id: string
          type: 'education' | 'club' | 'internship' | 'research'
          year_label: string
          title: string
          details: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'education' | 'club' | 'internship' | 'research'
          year_label: string
          title: string
          details?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'education' | 'club' | 'internship' | 'research'
          details?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      professional_experiences: {
        Row: {
          id: string
          user_id: string
          position: string
          company: string
          start_date: string
          end_date: string | null
          description: string | null
          achievements: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          position: string
          company: string
          start_date: string
          end_date?: string | null
          description?: string | null
          achievements?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          position?: string
          company?: string
          start_date?: string
          end_date?: string | null
          description?: string | null
          achievements?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      call_requests: {
        Row: {
          id: string
          student_user_id: string
          alumni_user_id: string
          message: string
          status: 'pending' | 'accepted' | 'declined'
          scheduled_time: string | null
          response_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_user_id: string
          alumni_user_id: string
          message: string
          status?: 'pending' | 'accepted' | 'declined'
          scheduled_time?: string | null
          response_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_user_id?: string
          alumni_user_id?: string
          message?: string
          status?: 'pending' | 'accepted' | 'declined'
          scheduled_time?: string | null
          response_message?: string | null
          created_at?: string
          updated_at?: string
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
