import "server-only";

import { createClient } from "@/lib/supabase/server";
import { signGalleryFileUrl, signGalleryFileUrls } from "@/lib/gallery/storage";
import { formatDisplayDate } from "@/lib/date";
import type { GalleryAlbumRow, GalleryImageRow } from "@/lib/supabase/database.types";
import type { GalleryAlbum } from "@/types";

async function toGalleryAlbum(album: GalleryAlbumRow, images: GalleryImageRow[]): Promise<GalleryAlbum> {
  const coverUrl = await signGalleryFileUrl(album.cover_image_path);
  const imageUrls = await signGalleryFileUrls(images.map((image) => image.image_path));

  return {
    slug: album.slug,
    title: album.title,
    description: album.description,
    category: album.category,
    date: formatDisplayDate(album.album_date),
    cover: coverUrl ?? undefined,
    images: images.map((image, index) => ({
      src: imageUrls[index] ?? "",
      alt: image.alt_text,
      caption: image.caption ?? undefined,
    })),
  };
}

/** Public-safe: never throws — a query failure degrades to an empty list. */
export async function getPublishedGalleryAlbums(): Promise<GalleryAlbum[]> {
  try {
    const supabase = await createClient();
    const { data: albums, error } = await supabase
      .from("gallery_albums")
      .select("*")
      .eq("status", "published")
      .order("album_date", { ascending: false });

    if (error) {
      console.error("Failed to load published gallery albums:", error.message);
      return [];
    }

    const rows = albums ?? [];
    const albumsWithImages = await Promise.all(
      rows.map(async (album) => {
        const { data: images } = await supabase
          .from("gallery_images")
          .select("*")
          .eq("album_id", album.id)
          .order("sort_order", { ascending: true });
        return toGalleryAlbum(album, images ?? []);
      })
    );

    return albumsWithImages;
  } catch (err) {
    console.error("Gallery query failed:", err);
    return [];
  }
}
