import type { GalleryCategory, GalleryAlbum } from "@/types";

export const galleryCategories: GalleryCategory[] = [
  "Campus",
  "Classrooms",
  "School Events",
  "Arts & Culture",
  "Sports",
  "NCC & NSS",
  "Student Activities",
  "Achievements",
  "Historical Photos",
];

/**
 * No official photography has been supplied yet. Do not add stock or
 * placeholder photos here as if they were real — the Gallery UI renders a
 * structured, clearly-labelled placeholder state per category until
 * official images are provided.
 */
export const galleryAlbums: GalleryAlbum[] = [];
