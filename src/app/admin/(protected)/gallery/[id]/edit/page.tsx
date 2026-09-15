import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getGalleryAlbumByIdForAdmin } from "@/lib/gallery/queries";
import { signGalleryFileUrl } from "@/lib/gallery/storage";
import { updateGalleryAlbum, setGalleryAlbumStatus } from "@/lib/gallery/actions";
import { GalleryAlbumForm } from "@/components/admin/GalleryAlbumForm";

export const metadata: Metadata = buildMetadata({
  title: "Edit Album",
  description: "Edit a Gallery album.",
  path: "/admin/gallery",
  noIndex: true,
});

export default async function EditGalleryAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const album = await getGalleryAlbumByIdForAdmin(id);
  if (!album) {
    notFound();
  }

  const coverImageUrl = await signGalleryFileUrl(album.cover_image_path);
  const updateAction = updateGalleryAlbum.bind(null, album.id);
  const togglePublish = setGalleryAlbumStatus.bind(
    null,
    album.id,
    album.status === "published" ? "draft" : "published"
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Edit Album</h1>
          <p className="mt-1 text-sm text-slate">
            Currently{" "}
            <span className="font-semibold text-charcoal">
              {album.status === "published" ? "published" : "draft"}
            </span>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/gallery/${album.id}/images`}
            className="border border-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-navy uppercase transition hover:bg-navy hover:text-white"
          >
            Manage Photos
          </Link>
          <form action={togglePublish}>
            <button
              type="submit"
              className="border border-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-navy uppercase transition hover:bg-navy hover:text-white"
            >
              {album.status === "published" ? "Unpublish" : "Publish"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <GalleryAlbumForm
          mode="edit"
          action={updateAction}
          initialValues={{
            slug: album.slug,
            title: album.title,
            category: album.category,
            description: album.description,
            albumDate: album.album_date,
            coverImageUrl,
          }}
        />
      </div>
    </div>
  );
}
