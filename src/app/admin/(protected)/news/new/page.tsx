import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/metadata";
import { createNews } from "@/lib/news/actions";
import { NewsForm } from "@/components/admin/NewsForm";

export const metadata: Metadata = buildMetadata({
  title: "Add News Article",
  description: "Add a new News article.",
  path: "/admin/news/new",
  noIndex: true,
});

export default async function NewNewsPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-navy">Add News Article</h1>
      <p className="mt-1 text-sm text-slate">
        Save as draft to review later, or publish to make this article visible on the public News page
        immediately. A URL slug is generated automatically from the title.
      </p>

      <div className="mt-8">
        <NewsForm
          mode="create"
          action={createNews}
          initialValues={{ title: "", category: "", summary: "", body: "", author: "", imageUrl: null }}
        />
      </div>
    </div>
  );
}
