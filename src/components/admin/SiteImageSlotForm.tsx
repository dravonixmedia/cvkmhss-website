"use client";

import { useActionState } from "react";
import type { SiteImageFormState } from "@/lib/site-images/actions";
import type { SiteImageSlotDef } from "@/lib/site-images/slots";
import { ImageFileField } from "@/components/admin/ImageFileField";
import { ConfirmDeleteForm } from "@/components/admin/ConfirmDeleteForm";
import { fieldClasses, labelClasses } from "@/components/admin/formStyles";

const initialState: SiteImageFormState = {};

export function SiteImageSlotForm({
  slot,
  currentImageUrl,
  currentAltText,
  action,
  removeAction,
}: {
  slot: SiteImageSlotDef;
  currentImageUrl: string | null;
  currentAltText: string | null;
  action: (prevState: SiteImageFormState, formData: FormData) => Promise<SiteImageFormState>;
  removeAction: () => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="border border-border bg-paper p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-sm font-semibold text-navy">{slot.label}</h3>
          <p className="text-xs text-slate">
            {slot.purpose === "hero" ? "Page hero image" : "Homepage section image"}
          </p>
        </div>
        {currentImageUrl && (
          <ConfirmDeleteForm
            action={removeAction}
            itemLabel={slot.label}
            confirmMessage={`Remove the current ${slot.label} image? The page will show its original placeholder artwork until a new image is uploaded.`}
          />
        )}
      </div>

      <form action={formAction} className="mt-4 space-y-4">
        <ImageFileField
          id={`${slot.key}_image`}
          name="image"
          label="Photo"
          disabled={pending}
          existingImageUrl={currentImageUrl}
          previewContainerClassName={slot.previewContainerClassName}
          recommendation={slot.recommendation}
        />

        <div>
          <label htmlFor={`${slot.key}_alt_text`} className={labelClasses}>
            Alt Text <span className="text-slate normal-case">(optional — describes the photo for screen readers)</span>
          </label>
          <input
            id={`${slot.key}_alt_text`}
            name="alt_text"
            type="text"
            maxLength={200}
            defaultValue={currentAltText ?? ""}
            disabled={pending}
            className={fieldClasses}
          />
        </div>

        {state.error && (
          <p role="alert" className="text-sm font-medium text-red-700">
            {state.error}
          </p>
        )}
        {state.success && !state.error && (
          <p role="status" className="text-sm font-medium text-emerald-700">
            Saved.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-navy px-4 py-2 text-xs font-semibold tracking-wide text-white uppercase transition hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
