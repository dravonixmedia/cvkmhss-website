"use client";

import { useActionState } from "react";
import type { NewsFormState } from "@/lib/news/actions";
import { fieldClasses, labelClasses } from "@/components/admin/formStyles";

const initialState: NewsFormState = {};

export interface NewsFormInitialValues {
  slug?: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  author: string;
  imageUrl: string | null;
}

export function NewsForm({
  mode,
  action,
  initialValues,
}: {
  mode: "create" | "edit";
  action: (prevState: NewsFormState, formData: FormData) => Promise<NewsFormState>;
  initialValues?: NewsFormInitialValues;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-6" noValidate>
      <div>
        <label htmlFor="title" className={labelClasses}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={180}
          defaultValue={initialValues?.title}
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      {mode === "edit" && (
        <div>
          <label htmlFor="slug" className={labelClasses}>
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            maxLength={140}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            defaultValue={initialValues?.slug}
            disabled={pending}
            className={fieldClasses}
          />
          <p className="mt-1 text-xs text-slate">Used in the public URL — /news/{"{slug}"}</p>
        </div>
      )}

      <div>
        <label htmlFor="category" className={labelClasses}>
          Category
        </label>
        <input
          id="category"
          name="category"
          type="text"
          required
          maxLength={60}
          placeholder="e.g. Announcements, Academics, Events"
          defaultValue={initialValues?.category}
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="summary" className={labelClasses}>
          Summary / Excerpt
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={2}
          required
          maxLength={400}
          defaultValue={initialValues?.summary}
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="body" className={labelClasses}>
          Full Content
        </label>
        <textarea
          id="body"
          name="body"
          rows={12}
          required
          defaultValue={initialValues?.body}
          disabled={pending}
          className={fieldClasses}
        />
        <p className="mt-1 text-xs text-slate">Separate paragraphs with a blank line.</p>
      </div>

      <div>
        <label htmlFor="author" className={labelClasses}>
          Author <span className="text-slate normal-case">(optional)</span>
        </label>
        <input
          id="author"
          name="author"
          type="text"
          maxLength={120}
          defaultValue={initialValues?.author}
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="featured_image" className={labelClasses}>
          Featured Image <span className="text-slate normal-case">(JPEG, PNG or WEBP, up to 5MB)</span>
        </label>
        {initialValues?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- small admin-only preview thumbnail
          <img
            src={initialValues.imageUrl}
            alt=""
            className="mt-2 h-24 w-40 border border-border object-cover"
          />
        )}
        <input
          id="featured_image"
          name="featured_image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={pending}
          className="mt-2 block w-full text-sm text-charcoal file:mr-4 file:border file:border-border file:bg-paper file:px-3 file:py-2 file:text-xs file:font-semibold file:tracking-wide file:text-navy file:uppercase"
        />
        {initialValues?.imageUrl && (
          <p className="mt-1 text-xs text-slate">Choose a new file only to replace the current image.</p>
        )}
      </div>

      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        {mode === "create" ? (
          <>
            <button
              type="submit"
              name="intent"
              value="draft"
              disabled={pending}
              className="border border-navy px-5 py-2.5 text-sm font-semibold tracking-wide text-navy uppercase transition hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save as Draft"}
            </button>
            <button
              type="submit"
              name="intent"
              value="publish"
              disabled={pending}
              className="bg-navy px-5 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Publishing…" : "Publish"}
            </button>
          </>
        ) : (
          <button
            type="submit"
            disabled={pending}
            className="bg-navy px-5 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save Changes"}
          </button>
        )}
      </div>
    </form>
  );
}
