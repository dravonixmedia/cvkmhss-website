"use client";

import { useState, type ChangeEvent, type ReactNode } from "react";
import { labelClasses } from "@/components/admin/formStyles";

/**
 * Shared file input + thumbnail preview for every CMS form's optional
 * image field (News/Events/Achievements/Gallery cover/Management photo).
 * Shows the existing saved image (a signed URL, passed in by the caller)
 * until the admin picks a new file, at which point it switches to an
 * immediate local preview of that selection via a `blob:` object URL —
 * so the admin sees the upload took effect before ever clicking Save,
 * instead of only finding out after the record round-trips through
 * Storage and back.
 */
export function ImageFileField({
  id,
  name,
  label,
  accept = "image/jpeg,image/png,image/webp",
  required = false,
  disabled = false,
  existingImageUrl,
  imageClassName = "mt-2 h-24 w-40 border border-border object-cover",
  helpText,
}: {
  id: string;
  name: string;
  label: ReactNode;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  existingImageUrl?: string | null;
  imageClassName?: string;
  helpText?: ReactNode;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      const file = event.target.files?.[0];
      return file ? URL.createObjectURL(file) : null;
    });
  }

  const displayUrl = previewUrl ?? existingImageUrl ?? null;

  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      {displayUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- small admin-only preview thumbnail; may be an unsaved local blob: selection
        <img src={displayUrl} alt="" className={imageClassName} />
      )}
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        required={required}
        disabled={disabled}
        onChange={handleChange}
        className="mt-2 block w-full text-sm text-charcoal file:mr-4 file:border file:border-border file:bg-paper file:px-3 file:py-2 file:text-xs file:font-semibold file:tracking-wide file:text-navy file:uppercase"
      />
      {previewUrl ? (
        <p className="mt-1 text-xs text-slate">New file selected — not saved yet.</p>
      ) : (
        helpText && <p className="mt-1 text-xs text-slate">{helpText}</p>
      )}
    </div>
  );
}
