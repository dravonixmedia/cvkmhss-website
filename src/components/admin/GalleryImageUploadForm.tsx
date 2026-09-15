"use client";

import { useActionState, useRef } from "react";
import type { GalleryImagesFormState } from "@/lib/gallery/images";

const initialState: GalleryImagesFormState = {};

export function GalleryImageUploadForm({
  action,
}: {
  action: (prevState: GalleryImagesFormState, formData: FormData) => Promise<GalleryImagesFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="border border-dashed border-border bg-paper p-6"
    >
      <label htmlFor="images" className="block text-xs font-semibold tracking-wide text-navy uppercase">
        Upload Photos <span className="text-slate normal-case">(JPEG, PNG or WEBP, up to 5MB each)</span>
      </label>
      <input
        id="images"
        name="images"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        disabled={pending}
        className="mt-2 block w-full text-sm text-charcoal file:mr-4 file:border file:border-border file:bg-off-white file:px-3 file:py-2 file:text-xs file:font-semibold file:tracking-wide file:text-navy file:uppercase"
      />

      {state.error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 bg-navy px-5 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
