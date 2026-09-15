import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { GalleryAlbumRow, GalleryImageRow } from "@/lib/supabase/database.types";

export async function getAllGalleryAlbumsForAdmin(): Promise<GalleryAlbumRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_albums")
    .select("*")
    .order("album_date", { ascending: false });
  return data ?? [];
}

export async function getGalleryAlbumByIdForAdmin(id: string): Promise<GalleryAlbumRow | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("gallery_albums").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function getGalleryImagesForAlbum(albumId: string): Promise<GalleryImageRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .eq("album_id", albumId)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getGalleryImageCountsByAlbum(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data } = await supabase.from("gallery_images").select("album_id");
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.album_id] = (counts[row.album_id] ?? 0) + 1;
  }
  return counts;
}
