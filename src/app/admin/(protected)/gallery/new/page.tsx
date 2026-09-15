import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { createGalleryAlbum } from "@/lib/gallery/actions";
import { GalleryAlbumForm } from "@/components/admin/GalleryAlbumForm";

export const metadata: Metadata = buildMetadata({
  title: "Add Album",
  description: "Add a new Gallery album.",
  path: "/admin/gallery/new",
  noIndex: true,
});

export default async function NewGalleryAlbumPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-navy">Add Album</h1>
      <p className="mt-1 text-sm text-slate">
        Save as draft to review later, or publish to make this album visible on the public Gallery
        page immediately. A URL slug is generated automatically from the title. You&apos;ll be able
        to upload photos right after saving.
      </p>

      <div className="mt-8">
        <GalleryAlbumForm
          mode="create"
          action={createGalleryAlbum}
          initialValues={{
            title: "",
            category: "Campus",
            description: "",
            albumDate: "",
            coverImageUrl: null,
          }}
        />
      </div>
    </div>
  );
}
