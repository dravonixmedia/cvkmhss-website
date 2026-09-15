"use client";

import { useActionState } from "react";
import type { DownloadFormState } from "@/lib/downloads/actions";
import { DOWNLOAD_CATEGORY_VALUES, type DownloadCategoryValue } from "@/lib/downloads/validation";
import { fieldClasses, labelClasses } from "@/components/admin/formStyles";

const initialState: DownloadFormState = {};

export interface DownloadFormInitialValues {
  title: string;
  category: DownloadCategoryValue;
  description: string;
  documentUrl: string | null;
}

export function DownloadForm({
  mode,
  action,
  initialValues,
}: {
  mode: "create" | "edit";
  action: (prevState: DownloadFormState, formData: FormData) => Promise<DownloadFormState>;
  initialValues?: DownloadFormInitialValues;
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
          {DOWNLOAD_CATEGORY_VALUES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>
          Description <span className="text-slate normal-case">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={600}
          defaultValue={initialValues?.description}
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="document" className={labelClasses}>
          Document{" "}
          <span className="text-slate normal-case">
            (PDF, Word, Excel, JPEG or PNG, up to 10MB{mode === "create" ? "" : " — optional"})
          </span>
        </label>
        {initialValues?.documentUrl && (
          <p className="mt-2 text-sm">
            <a
              href={initialValues.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy hover:underline"
            >
              View current document
            </a>
          </p>
        )}
        <input
          id="document"
          name="document"
          type="file"
          required={mode === "create"}
          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png"
          disabled={pending}
          className="mt-2 block w-full text-sm text-charcoal file:mr-4 file:border file:border-border file:bg-paper file:px-3 file:py-2 file:text-xs file:font-semibold file:tracking-wide file:text-navy file:uppercase"
        />
        {initialValues?.documentUrl && (
          <p className="mt-1 text-xs text-slate">Choose a new file only to replace the current document.</p>
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
