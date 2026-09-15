import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { getNewsByIdForAdmin } from "@/lib/news/queries";
import { signNewsImageUrl } from "@/lib/news/storage";
import { updateNews, setNewsStatus } from "@/lib/news/actions";
import { NewsForm } from "@/components/admin/NewsForm";

export const metadata: Metadata = buildMetadata({
  title: "Edit News Article",
  description: "Edit a News article.",
  path: "/admin/news",
  noIndex: true,
});

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const article = await getNewsByIdForAdmin(id);
  if (!article) {
    notFound();
  }

  const imageUrl = await signNewsImageUrl(article.featured_image);
  const updateAction = updateNews.bind(null, article.id);
  const togglePublish = setNewsStatus.bind(
    null,
    article.id,
    article.status === "published" ? "draft" : "published"
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-navy">Edit News Article</h1>
          <p className="mt-1 text-sm text-slate">
            Currently{" "}
            <span className="font-semibold text-charcoal">
              {article.status === "published" ? "published" : "draft"}
            </span>
            .
          </p>
        </div>
        <form action={togglePublish}>
          <button
            type="submit"
            className="border border-navy px-4 py-2.5 text-sm font-semibold tracking-wide text-navy uppercase transition hover:bg-navy hover:text-white"
          >
            {article.status === "published" ? "Unpublish" : "Publish"}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <NewsForm
          mode="edit"
          action={updateAction}
          initialValues={{
            slug: article.slug,
            title: article.title,
            category: article.category,
            summary: article.summary,
            body: article.body.join("\n\n"),
            author: article.author ?? "",
            imageUrl,
          }}
        />
      </div>
    </div>
  );
}
