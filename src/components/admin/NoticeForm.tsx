"use client";

import { useActionState } from "react";
import type { NoticeFormState } from "@/lib/notices/actions";
import type { NoticeCategoryValue } from "@/lib/notices/validation";
import { fieldClasses, labelClasses } from "@/components/admin/formStyles";

const initialState: NoticeFormState = {};

const categoryLabels: Record<NoticeCategoryValue, string> = {
  academic: "Academic",
  admissions: "Admissions",
  examination: "Examination",
  general: "General",
  event: "Event",
};

export interface NoticeFormInitialValues {
  slug?: string;
  title: string;
  category: NoticeCategoryValue;
  noticeDate: string;
  description: string;
  expiryDate: string;
  important: boolean;
  attachmentUrl: string | null;
}

export function NoticeForm({
  mode,
  action,
  initialValues,
}: {
  mode: "create" | "edit";
  action: (prevState: NoticeFormState, formData: FormData) => Promise<NoticeFormState>;
  initialValues?: NoticeFormInitialValues;
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
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        <div>
          <label htmlFor="category" className={labelClasses}>
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={initialValues?.category}
            disabled={pending}
            className={fieldClasses}
          >
            <option value="" disabled>
              Choose a category
            </option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="notice_date" className={labelClasses}>
            Notice Date
          </label>
          <input
            id="notice_date"
            name="notice_date"
            type="date"
            required
            defaultValue={initialValues?.noticeDate}
            disabled={pending}
            className={fieldClasses}
          />
        </div>
        <div>
          <label htmlFor="expiry_date" className={labelClasses}>
            Expiry Date <span className="text-slate normal-case">(optional)</span>
          </label>
          <input
            id="expiry_date"
            name="expiry_date"
            type="date"
            defaultValue={initialValues?.expiryDate}
            disabled={pending}
            className={fieldClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>
          Notice Content / Summary
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          required
          defaultValue={initialValues?.description}
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          name="important"
          defaultChecked={initialValues?.important}
          disabled={pending}
          className="h-4 w-4 border border-border"
        />
        Mark as important / pinned
      </label>

      <div>
        <label htmlFor="attachment" className={labelClasses}>
          Attachment <span className="text-slate normal-case">(optional — PDF, JPEG or PNG, up to 10MB)</span>
        </label>
        {initialValues?.attachmentUrl && (
          <p className="mt-2 text-sm">
            <a
              href={initialValues.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy hover:underline"
            >
              View current attachment
            </a>
          </p>
        )}
        <input
          id="attachment"
          name="attachment"
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          disabled={pending}
          className="mt-2 block w-full text-sm text-charcoal file:mr-4 file:border file:border-border file:bg-paper file:px-3 file:py-2 file:text-xs file:font-semibold file:tracking-wide file:text-navy file:uppercase"
        />
        {initialValues?.attachmentUrl && (
          <p className="mt-1 text-xs text-slate">Choose a new file only to replace the current attachment.</p>
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
