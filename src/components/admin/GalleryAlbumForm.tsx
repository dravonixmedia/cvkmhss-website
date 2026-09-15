"use client";

import { useActionState } from "react";
import type { GalleryAlbumFormState } from "@/lib/gallery/actions";
import type { GalleryCategoryValue } from "@/lib/gallery/validation";
import { fieldClasses, labelClasses } from "@/components/admin/formStyles";
import { galleryCategories } from "@/data/gallery";

const initialState: GalleryAlbumFormState = {};

export interface GalleryAlbumFormInitialValues {
  slug?: string;
  title: string;
  category: GalleryCategoryValue;
  description: string;
  albumDate: string;
  coverImageUrl: string | null;
}

export function GalleryAlbumForm({
  mode,
  action,
  initialValues,
}: {
  mode: "create" | "edit";
  action: (prevState: GalleryAlbumFormState, formData: FormData) => Promise<GalleryAlbumFormState>;
  initialValues?: GalleryAlbumFormInitialValues;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-6" noValidate>
      <div>
        <label htmlFor="title" className={labelClasses}>
          Album Title
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
            {galleryCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="album_date" className={labelClasses}>
            Album Date
          </label>
          <input
            id="album_date"
            name="album_date"
            type="date"
            required
            defaultValue={initialValues?.albumDate}
            disabled={pending}
            className={fieldClasses}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClasses}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={5}
          required
          maxLength={2000}
          defaultValue={initialValues?.description}
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="cover_image" className={labelClasses}>
          Cover Image{" "}
          <span className="text-slate normal-case">
            (optional — JPEG, PNG or WEBP, up to 5MB)
          </span>
        </label>
        {initialValues?.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- small admin-only preview thumbnail
          <img
            src={initialValues.coverImageUrl}
            alt=""
            className="mt-2 h-24 w-40 border border-border object-cover"
          />
        )}
        <input
          id="cover_image"
          name="cover_image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={pending}
          className="mt-2 block w-full text-sm text-charcoal file:mr-4 file:border file:border-border file:bg-paper file:px-3 file:py-2 file:text-xs file:font-semibold file:tracking-wide file:text-navy file:uppercase"
        />
        <p className="mt-1 text-xs text-slate">
          {initialValues?.coverImageUrl
            ? "Choose a new file only to replace the current cover, or pick one from the album's photos after saving."
            : "You can also pick a cover from the album's photos after uploading them."}
        </p>
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
