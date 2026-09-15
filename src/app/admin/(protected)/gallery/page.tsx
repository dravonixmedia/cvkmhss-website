import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getAllGalleryAlbumsForAdmin, getGalleryImageCountsByAlbum } from "@/lib/gallery/queries";
import { signGalleryFileUrls } from "@/lib/gallery/storage";
import { deleteGalleryAlbum, setGalleryAlbumStatus } from "@/lib/gallery/actions";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";

export const metadata: Metadata = buildMetadata({
  title: "Gallery",
  description: "Manage CVKM HSS Gallery albums.",
  path: "/admin/gallery",
  noIndex: true,
});

export default async function AdminGalleryListPage() {
  await requireAdmin();

  const albums = await getAllGalleryAlbumsForAdmin();
  const imageCounts = await getGalleryImageCountsByAlbum();
  const coverUrls = await signGalleryFileUrls(albums.map((album) => album.cover_image_path));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Gallery</h1>
          <p className="mt-1 text-sm text-slate">
            Published albums and their photos appear on the public Gallery page.
          </p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="bg-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-navy-dark"
        >
          + Add Album
        </Link>
      </div>

      {albums.length === 0 ? (
        <div className="mt-10 border border-dashed border-border bg-paper px-6 py-12 text-center">
          <p className="font-heading text-lg font-semibold text-navy">No albums yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate">
            Add the first album to get started. Drafts stay hidden from the public site until
            published.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-border bg-paper">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-slate uppercase">
                <th className="px-4 py-3">Cover</th>
                <th className="px-4 py-3">Title &amp; Category</th>
                <th className="px-4 py-3">Photos</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {albums.map((album, index) => {
                const coverUrl = coverUrls[index];
                const togglePublish = setGalleryAlbumStatus.bind(
                  null,
                  album.id,
                  album.status === "published" ? "draft" : "published"
                );
                const remove = deleteGalleryAlbum.bind(null, album.id);
                const photoCount = imageCounts[album.id] ?? 0;

                return (
                  <tr key={album.id} className="border-b border-border last:border-b-0 align-top">
                    <td className="px-4 py-3">
                      {coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail
                        <img src={coverUrl} alt="" className="h-14 w-20 border border-border object-cover" />
                      ) : (
                        <div className="flex h-14 w-20 items-center justify-center border border-dashed border-border text-[10px] text-slate">
                          No cover
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{album.title}</p>
                      <p className="text-xs text-slate">{album.category}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate">
                      {photoCount} photo{photoCount === 1 ? "" : "s"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                          album.status === "published"
                            ? "border-navy text-navy"
                            : "border-slate/40 text-slate"
                        }`}
                      >
                        {album.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-3 text-xs">
                        <Link
                          href={`/admin/gallery/${album.id}/images`}
                          className="font-semibold tracking-wide text-navy uppercase hover:underline"
                        >
                          Photos
                        </Link>
                        <Link
                          href={`/admin/gallery/${album.id}/edit`}
                          className="font-semibold tracking-wide text-navy uppercase hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={togglePublish}>
                          <button
                            type="submit"
                            className="font-semibold tracking-wide text-navy uppercase hover:underline"
                          >
                            {album.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <ConfirmDeleteForm
                          action={remove}
                          itemLabel={album.title}
                          confirmMessage={`Delete "${album.title}" and all ${photoCount} of its photos? This cannot be undone.`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
