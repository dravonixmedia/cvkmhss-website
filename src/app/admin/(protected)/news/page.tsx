import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getAllNewsForAdmin } from "@/lib/news/queries";
import { signNewsImageUrls } from "@/lib/news/storage";
import { deleteNews, setNewsStatus } from "@/lib/news/actions";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";

export const metadata: Metadata = buildMetadata({
  title: "News",
  description: "Manage CVKM HSS News articles.",
  path: "/admin/news",
  noIndex: true,
});

export default async function AdminNewsListPage() {
  await requireAdmin();

  const articles = await getAllNewsForAdmin();
  const imageUrls = await signNewsImageUrls(articles.map((a) => a.featured_image));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">News</h1>
          <p className="mt-1 text-sm text-slate">Published articles appear on the public News page.</p>
        </div>
        <Link
          href="/admin/news/new"
          className="bg-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-navy-dark"
        >
          + Add Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="mt-10 border border-dashed border-border bg-paper px-6 py-12 text-center">
          <p className="font-heading text-lg font-semibold text-navy">No news articles yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate">
            Add the first article to get started. Drafts stay hidden from the public site until published.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border border-border bg-paper">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-slate uppercase">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title &amp; Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, index) => {
                const imageUrl = imageUrls[index];
                const togglePublish = setNewsStatus.bind(
                  null,
                  article.id,
                  article.status === "published" ? "draft" : "published"
                );
                const remove = deleteNews.bind(null, article.id);

                return (
                  <tr key={article.id} className="border-b border-border last:border-b-0 align-top">
                    <td className="px-4 py-3">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail
                        <img src={imageUrl} alt="" className="h-14 w-20 border border-border object-cover" />
                      ) : (
                        <div className="flex h-14 w-20 items-center justify-center border border-dashed border-border text-[10px] text-slate">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{article.title}</p>
                      <p className="text-xs text-slate">{article.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                          article.status === "published"
                            ? "border-navy text-navy"
                            : "border-slate/40 text-slate"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate">
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-3 text-xs">
                        <Link
                          href={`/admin/news/${article.id}/edit`}
                          className="font-semibold tracking-wide text-navy uppercase hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={togglePublish}>
                          <button
                            type="submit"
                            className="font-semibold tracking-wide text-navy uppercase hover:underline"
                          >
                            {article.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                        </form>
                        <ConfirmDeleteForm action={remove} itemLabel={article.title} />
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
