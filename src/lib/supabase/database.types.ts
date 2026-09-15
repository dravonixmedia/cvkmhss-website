/**
 * Generated from the live CVKM Supabase project (sovppydnmstzwnstczua) via
 * `mcp__Supabase__generate_typescript_types`, after applying every
 * migration in supabase/migrations/. Do not hand-edit the generated
 * section below — regenerate it instead:
 *
 *   supabase gen types typescript --project-id sovppydnmstzwnstczua > src/lib/supabase/database.types.ts
 *
 * then re-append the "Hand-maintained convenience aliases" section at the
 * bottom of this file (it is not part of the generated output).
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_date: string
          category: Database["public"]["Enums"]["achievement_category"]
          created_at: string
          created_by: string | null
          description: string
          id: string
          image: string | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          achievement_date: string
          category: Database["public"]["Enums"]["achievement_category"]
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          image?: string | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          achievement_date?: string
          category?: Database["public"]["Enums"]["achievement_category"]
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          image?: string | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "achievements_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      downloads: {
        Row: {
          category: Database["public"]["Enums"]["download_category"]
          created_at: string
          created_by: string | null
          description: string | null
          file_path: string
          id: string
          published_at: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["download_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_path: string
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["download_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_path?: string
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          end_time: string | null
          event_date: string
          id: string
          image: string | null
          location: string
          published_at: string | null
          slug: string
          start_time: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          end_time?: string | null
          event_date: string
          id?: string
          image?: string | null
          location: string
          published_at?: string | null
          slug: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          end_time?: string | null
          event_date?: string
          id?: string
          image?: string | null
          location?: string
          published_at?: string | null
          slug?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_albums: {
        Row: {
          album_date: string
          category: Database["public"]["Enums"]["gallery_category"]
          cover_image_path: string | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          album_date: string
          category: Database["public"]["Enums"]["gallery_category"]
          cover_image_path?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          album_date?: string
          category?: Database["public"]["Enums"]["gallery_category"]
          cover_image_path?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_albums_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_albums_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          album_id: string
          alt_text: string
          caption: string | null
          created_at: string
          created_by: string | null
          id: string
          image_path: string
          sort_order: number
        }
        Insert: {
          album_id: string
          alt_text: string
          caption?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          image_path: string
          sort_order?: number
        }
        Update: {
          album_id?: string
          alt_text?: string
          caption?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          image_path?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_images_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author: string | null
          body: string[]
          category: string
          created_at: string
          created_by: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          summary: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          author?: string | null
          body?: string[]
          category: string
          created_at?: string
          created_by?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          summary: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          author?: string | null
          body?: string[]
          category?: string
          created_at?: string
          created_by?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notices: {
        Row: {
          attachment_path: string | null
          category: Database["public"]["Enums"]["notice_category"]
          created_at: string
          created_by: string | null
          description: string
          expiry_date: string | null
          id: string
          important: boolean
          notice_date: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          attachment_path?: string | null
          category: Database["public"]["Enums"]["notice_category"]
          created_at?: string
          created_by?: string | null
          description: string
          expiry_date?: string | null
          id?: string
          important?: boolean
          notice_date: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          attachment_path?: string | null
          category?: Database["public"]["Enums"]["notice_category"]
          created_at?: string
          created_by?: string | null
          description?: string
          expiry_date?: string | null
          id?: string
          important?: boolean
          notice_date?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_active_admin: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      achievement_category:
        | "academics"
        | "sports"
        | "arts"
        | "innovation"
        | "competitions"
        | "recognitions"
      app_role: "super_admin" | "editor"
      content_status: "draft" | "published"
      download_category:
        | "Academic"
        | "Admissions"
        | "Notices"
        | "Forms"
        | "General"
      gallery_category:
        | "Campus"
        | "Classrooms"
        | "School Events"
        | "Arts & Culture"
        | "Sports"
        | "NCC & NSS"
        | "Student Activities"
        | "Achievements"
        | "Historical Photos"
      notice_category:
        | "academic"
        | "admissions"
        | "examination"
        | "general"
        | "event"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_category: [
        "academics",
        "sports",
        "arts",
        "innovation",
        "competitions",
        "recognitions",
      ],
      app_role: ["super_admin", "editor"],
      content_status: ["draft", "published"],
      download_category: [
        "Academic",
        "Admissions",
        "Notices",
        "Forms",
        "General",
      ],
      gallery_category: [
        "Campus",
        "Classrooms",
        "School Events",
        "Arts & Culture",
        "Sports",
        "NCC & NSS",
        "Student Activities",
        "Achievements",
        "Historical Photos",
      ],
      notice_category: [
        "academic",
        "admissions",
        "examination",
        "general",
        "event",
      ],
    },
  },
} as const

// ---------------------------------------------------------------------
// Hand-maintained convenience aliases (not part of the generated output
// above — re-add this section after regenerating this file).
// ---------------------------------------------------------------------

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
