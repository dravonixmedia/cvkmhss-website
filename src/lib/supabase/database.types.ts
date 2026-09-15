/**
 * Hand-written placeholder matching the SQL in supabase/migrations/.
 *
 * This is NOT output from `supabase gen types typescript` — there is no
 * live, connected Supabase project yet to generate from (see
 * docs/SUPABASE_SETUP.md). Once the real CVKM project exists and the
 * migrations in supabase/migrations/ are applied to it, regenerate this
 * file for real:
 *
 *   supabase gen types typescript --project-id <project-ref> > src/lib/supabase/database.types.ts
 *
 * Until then, keep this file in sync by hand with supabase/migrations/.
 */

export type AppRole = "super_admin" | "editor";
export type ContentStatus = "draft" | "published";
export type AchievementCategoryDb =
  | "academics"
  | "sports"
  | "arts"
  | "innovation"
  | "competitions"
  | "recognitions";
export type NoticeCategoryDb = "academic" | "admissions" | "examination" | "general" | "event";
export type GalleryCategoryDb =
  | "Campus"
  | "Classrooms"
  | "School Events"
  | "Arts & Culture"
  | "Sports"
  | "NCC & NSS"
  | "Student Activities"
  | "Achievements"
  | "Historical Photos";
export type DownloadCategoryDb = "Academic" | "Admissions" | "Notices" | "Forms" | "General";

interface AuditColumns {
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

interface PublishableColumns {
  status: ContentStatus;
  published_at: string | null;
}

export interface ProfileRow {
  id: string;
  full_name: string;
  role: AppRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export type ProfileInsert = Partial<Omit<ProfileRow, "id">> & { id: string };
export type ProfileUpdate = Partial<Omit<ProfileRow, "id">>;

export interface NewsRow extends AuditColumns, PublishableColumns {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string[];
  featured_image: string | null;
  author: string | null;
}
export type NewsInsert = Partial<NewsRow> &
  Pick<NewsRow, "slug" | "title" | "category" | "summary" | "body">;
export type NewsUpdate = Partial<NewsRow>;

export interface EventRow extends AuditColumns, PublishableColumns {
  id: string;
  slug: string;
  title: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  description: string;
  image: string | null;
}
export type EventInsert = Partial<EventRow> &
  Pick<EventRow, "slug" | "title" | "event_date" | "location" | "description">;
export type EventUpdate = Partial<EventRow>;

export interface AchievementRow extends AuditColumns, PublishableColumns {
  id: string;
  slug: string;
  title: string;
  category: AchievementCategoryDb;
  achievement_date: string;
  description: string;
  image: string | null;
}
export type AchievementInsert = Partial<AchievementRow> &
  Pick<AchievementRow, "slug" | "title" | "category" | "achievement_date" | "description">;
export type AchievementUpdate = Partial<AchievementRow>;

export interface NoticeRow extends AuditColumns, PublishableColumns {
  id: string;
  slug: string;
  title: string;
  notice_date: string;
  category: NoticeCategoryDb;
  description: string;
  attachment_path: string | null;
  expiry_date: string | null;
  important: boolean;
}
export type NoticeInsert = Partial<NoticeRow> &
  Pick<NoticeRow, "slug" | "title" | "notice_date" | "category" | "description">;
export type NoticeUpdate = Partial<NoticeRow>;

export interface DownloadRow extends AuditColumns, PublishableColumns {
  id: string;
  title: string;
  category: DownloadCategoryDb;
  description: string | null;
  file_path: string;
}
export type DownloadInsert = Partial<DownloadRow> &
  Pick<DownloadRow, "title" | "category" | "file_path">;
export type DownloadUpdate = Partial<DownloadRow>;

export interface GalleryAlbumRow extends AuditColumns, PublishableColumns {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: GalleryCategoryDb;
  album_date: string;
  cover_image_path: string | null;
}
export type GalleryAlbumInsert = Partial<GalleryAlbumRow> &
  Pick<GalleryAlbumRow, "slug" | "title" | "description" | "category" | "album_date">;
export type GalleryAlbumUpdate = Partial<GalleryAlbumRow>;

export interface GalleryImageRow {
  id: string;
  album_id: string;
  image_path: string;
  alt_text: string;
  caption: string | null;
  sort_order: number;
  created_by: string | null;
  created_at: string;
}
export type GalleryImageInsert = Partial<GalleryImageRow> &
  Pick<GalleryImageRow, "album_id" | "image_path" | "alt_text">;
export type GalleryImageUpdate = Partial<GalleryImageRow>;

export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: ProfileInsert; Update: ProfileUpdate };
      news: { Row: NewsRow; Insert: NewsInsert; Update: NewsUpdate };
      events: { Row: EventRow; Insert: EventInsert; Update: EventUpdate };
      achievements: { Row: AchievementRow; Insert: AchievementInsert; Update: AchievementUpdate };
      notices: { Row: NoticeRow; Insert: NoticeInsert; Update: NoticeUpdate };
      downloads: { Row: DownloadRow; Insert: DownloadInsert; Update: DownloadUpdate };
      gallery_albums: {
        Row: GalleryAlbumRow;
        Insert: GalleryAlbumInsert;
        Update: GalleryAlbumUpdate;
      };
      gallery_images: {
        Row: GalleryImageRow;
        Insert: GalleryImageInsert;
        Update: GalleryImageUpdate;
      };
    };
  };
}
