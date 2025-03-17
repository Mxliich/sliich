export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          recipient_id: string
          content: string
          is_read: boolean
          is_answered: boolean
          created_at: string
        }
        Insert: {
          id?: string
          recipient_id: string
          content: string
          is_read?: boolean
          is_answered?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          recipient_id?: string
          content?: string
          is_read?: boolean
          is_answered?: boolean
          created_at?: string
        }
      }
      polls: {
        Row: {
          id: string
          user_id: string
          question: string
          is_active: boolean
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          question: string
          is_active?: boolean
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          question?: string
          is_active?: boolean
          created_at?: string
          expires_at?: string | null
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          option_text: string
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_text: string
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_text?: string
          created_at?: string
        }
      }
      poll_responses: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          respondent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          respondent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          respondent_id?: string | null
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          theme: string
          allow_anonymous_messages: boolean
          notification_email: boolean
          notification_push: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          theme?: string
          allow_anonymous_messages?: boolean
          notification_email?: boolean
          notification_push?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme?: string
          allow_anonymous_messages?: boolean
          notification_email?: boolean
          notification_push?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

