"use client";

import { useActionState } from "react";
import type { ManagementFormState } from "@/lib/management/actions";

const fieldClasses =
  "mt-2 w-full border border-border bg-off-white px-3 py-2.5 text-sm text-charcoal " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-0";
const labelClasses = "block text-xs font-semibold tracking-wide text-navy uppercase";

export interface ManagementFormInitialValues {
  fullName: string;
  designation: string;
  shortBio: string;
  displayOrder: number;
  isFeatured: boolean;
  photoUrl: string | null;
}

const initialState: ManagementFormState = {};

export function ManagementForm({
  mode,
  action,
  initialValues,
}: {
  mode: "create" | "edit";
  action: (prevState: ManagementFormState, formData: FormData) => Promise<ManagementFormState>;
  initialValues?: ManagementFormInitialValues;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-6" noValidate>
      <div>
        <label htmlFor="full_name" className={labelClasses}>
          Full Name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          maxLength={120}
          defaultValue={initialValues?.fullName}
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="designation" className={labelClasses}>
          Designation
        </label>
        <input
          id="designation"
          name="designation"
          type="text"
          required
          maxLength={120}
          placeholder="e.g. Principal, Manager, PTA President"
          defaultValue={initialValues?.designation}
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="short_bio" className={labelClasses}>
          Short Bio / Message <span className="text-slate normal-case">(optional)</span>
        </label>
        <textarea
          id="short_bio"
          name="short_bio"
          rows={4}
          maxLength={600}
          defaultValue={initialValues?.shortBio}
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="photo" className={labelClasses}>
          Photo <span className="text-slate normal-case">(JPEG, PNG or WEBP, up to 5MB)</span>
        </label>
        {initialValues?.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- small admin-only preview thumbnail, not the public-facing image
          <img
            src={initialValues.photoUrl}
            alt=""
            className="mt-2 h-24 w-24 border border-border object-cover"
          />
        )}
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={pending}
          className="mt-2 block w-full text-sm text-charcoal file:mr-4 file:border file:border-border file:bg-paper file:px-3 file:py-2 file:text-xs file:font-semibold file:tracking-wide file:text-navy file:uppercase"
        />
        {initialValues?.photoUrl && (
          <p className="mt-1 text-xs text-slate">Choose a new file only to replace the current photo.</p>
        )}
      </div>

      <div className="flex items-end gap-6">
        <div>
          <label htmlFor="display_order" className={labelClasses}>
            Display Order
          </label>
          <input
            id="display_order"
            name="display_order"
            type="number"
            step={1}
            defaultValue={initialValues?.displayOrder ?? 0}
            disabled={pending}
            className={`${fieldClasses} w-28`}
          />
        </div>

        <label className="mb-2.5 flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={initialValues?.isFeatured}
            disabled={pending}
            className="h-4 w-4 border border-border"
          />
          Featured member
        </label>
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
