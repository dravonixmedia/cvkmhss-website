"use client";

import { useActionState } from "react";
import type { AchievementFormState } from "@/lib/achievements/actions";
import type { AchievementCategoryValue } from "@/lib/achievements/validation";
import { fieldClasses, labelClasses } from "@/components/admin/formStyles";
import { ImageFileField } from "@/components/admin/ImageFileField";
import { achievementCategories } from "@/data/achievements";

const initialState: AchievementFormState = {};
const categoryOptions = achievementCategories.filter(
  (category): category is { id: AchievementCategoryValue; label: string } => category.id !== "all"
);

export interface AchievementFormInitialValues {
  slug?: string;
  title: string;
  category: AchievementCategoryValue;
  achievementDate: string;
  description: string;
  imageUrl: string | null;
}

export function AchievementForm({
  mode,
  action,
  initialValues,
}: {
  mode: "create" | "edit";
  action: (prevState: AchievementFormState, formData: FormData) => Promise<AchievementFormState>;
  initialValues?: AchievementFormInitialValues;
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
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="achievement_date" className={labelClasses}>
            Achievement Date
          </label>
          <input
            id="achievement_date"
            name="achievement_date"
            type="date"
            required
            defaultValue={initialValues?.achievementDate}
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
          rows={6}
          required
          defaultValue={initialValues?.description}
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      <ImageFileField
        id="image"
        name="image"
        label={
          <>
            Image <span className="text-slate normal-case">(optional — JPEG, PNG or WEBP, up to 5MB)</span>
          </>
        }
        disabled={pending}
        existingImageUrl={initialValues?.imageUrl}
        previewContainerClassName="relative mt-2 aspect-[16/9] w-full max-w-sm overflow-hidden border border-border"
        recommendation={{
          dimensions: "1600 × 1000 px",
          orientation: "landscape, 8:5",
          tip: "Keep important subjects away from the edges.",
        }}
        helpText={initialValues?.imageUrl && "Choose a new file only to replace the current image."}
      />

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
