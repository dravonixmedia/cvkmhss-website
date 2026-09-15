import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getGalleryAlbumByIdForAdmin, getGalleryImagesForAlbum } from "@/lib/gallery/queries";
import { signGalleryFileUrls } from "@/lib/gallery/storage";
import {
  addGalleryImages,
  deleteGalleryImage,
  updateGalleryImageCaption,
  moveGalleryImage,
  setAlbumCoverImage,
} from "@/lib/gallery/images";
import { GalleryImageUploadForm } from "@/components/admin/GalleryImageUploadForm";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";
import { fieldClasses } from "@/components/admin/formStyles";

export const metadata: Metadata = buildMetadata({
  title: "Album Photos",
  description: "Manage the photos in a Gallery album.",
  path: "/admin/gallery",
  noIndex: true,
});

export default async function GalleryAlbumImagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id: albumId } = await params;

  const album = await getGalleryAlbumByIdForAdmin(albumId);
  if (!album) {
    notFound();
  }

  const images = await getGalleryImagesForAlbum(albumId);
  const imageUrls = await signGalleryFileUrls(images.map((image) => image.image_path));

  const uploadAction = addGalleryImages.bind(null, albumId);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate uppercase">
            <Link href="/admin/gallery" className="hover:underline">
              Gallery
            </Link>{" "}
            / Photos
          </p>
          <h1 className="font-heading text-2xl font-semibold text-navy">{album.title}</h1>
          <p className="mt-1 text-sm text-slate">
            {images.length} photo{images.length === 1 ? "" : "s"} in this{" "}
            {album.status === "published" ? "published" : "draft"} album.
          </p>
        </div>
        <Link
          href={`/admin/gallery/${album.id}/edit`}
          className="border border-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-navy uppercase transition hover:bg-navy hover:text-white"
        >
          Edit Album Details
        </Link>
      </div>

      <div className="mt-8">
        <GalleryImageUploadForm action={uploadAction} />
      </div>

      {images.length === 0 ? (
        <div className="mt-8 border border-dashed border-border bg-paper px-6 py-12 text-center">
          <p className="font-heading text-lg font-semibold text-navy">No photos yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate">
            Upload photos above. Published albums only show on the public Gallery page once they
            have at least one photo.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => {
            const imageUrl = imageUrls[index];
            const isFirst = index === 0;
            const isLast = index === images.length - 1;
            const isCover = album.cover_image_path === image.image_path;
            const moveUp = moveGalleryImage.bind(null, albumId, image.id, "up");
            const moveDown = moveGalleryImage.bind(null, albumId, image.id, "down");
            const remove = deleteGalleryImage.bind(null, albumId, image.id);
            const updateCaption = updateGalleryImageCaption.bind(null, albumId, image.id);
            const makeCover = setAlbumCoverImage.bind(null, albumId, image.image_path);

            return (
              <div key={image.id} className="border border-border bg-paper p-4">
                <div className="relative">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail
                    <img
                      src={imageUrl}
                      alt={image.alt_text}
                      className="h-40 w-full border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center border border-dashed border-border text-xs text-slate">
                      Image unavailable
                    </div>
                  )}
                  {isCover && (
                    <span className="absolute top-2 left-2 border border-gold bg-off-white px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-gold uppercase">
                      Cover
                    </span>
                  )}
                </div>

                <form action={updateCaption} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    name="caption"
                    placeholder="Caption (optional)"
                    maxLength={300}
                    defaultValue={image.caption ?? ""}
                    className={`${fieldClasses} mt-0 flex-1 py-1.5`}
                  />
                  <button
                    type="submit"
                    className="shrink-0 border border-navy px-3 py-1.5 text-xs font-semibold tracking-wide text-navy uppercase hover:bg-navy hover:text-white"
                  >
                    Save
                  </button>
                </form>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <form action={moveUp}>
                      <button
                        type="submit"
                        disabled={isFirst}
                        aria-label="Move photo earlier"
                        className="border border-border px-2 py-1 text-slate disabled:opacity-30"
                      >
                        ▲
                      </button>
                    </form>
                    <form action={moveDown}>
                      <button
                        type="submit"
                        disabled={isLast}
                        aria-label="Move photo later"
                        className="border border-border px-2 py-1 text-slate disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </form>
                    {!isCover && (
                      <form action={makeCover}>
                        <button
                          type="submit"
                          className="border border-border px-2 py-1 font-semibold tracking-wide text-navy uppercase hover:border-navy"
                        >
                          Set as Cover
                        </button>
                      </form>
                    )}
                  </div>
                  <ConfirmDeleteForm action={remove} itemLabel="this photo" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
