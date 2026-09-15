"use client";

import { useActionState } from "react";
import type { ProfileFormState } from "@/lib/users/actions";
import { APP_ROLE_VALUES, type AppRoleValue } from "@/lib/users/validation";
import { fieldClasses, labelClasses } from "@/components/admin/formStyles";

const initialState: ProfileFormState = {};

const roleLabels: Record<AppRoleValue, string> = {
  super_admin: "Super Admin",
  editor: "Editor",
};

export interface UserEditFormInitialValues {
  fullName: string;
  role: AppRoleValue;
  isActive: boolean;
}

export function UserEditForm({
  action,
  initialValues,
  isSelf,
}: {
  action: (prevState: ProfileFormState, formData: FormData) => Promise<ProfileFormState>;
  initialValues: UserEditFormInitialValues;
  isSelf: boolean;
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
          defaultValue={initialValues.fullName}
          disabled={pending}
          className={fieldClasses}
        />
      </div>

      <div>
        <label htmlFor="role" className={labelClasses}>
          Role
        </label>
        <select
          id="role"
          name="role"
          required
          defaultValue={initialValues.role}
          disabled={pending}
          className={fieldClasses}
        >
          {APP_ROLE_VALUES.map((role) => (
            <option key={role} value={role}>
              {roleLabels[role]}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-slate">
          Super Admin can manage other administrators and Settings alongside all content. Editor
          can manage content and ordinary Settings only.
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={initialValues.isActive}
          disabled={pending}
          className="h-4 w-4 border border-border"
        />
        Active — unchecking immediately revokes all admin backend access
      </label>

      {isSelf && (
        <p className="border border-gold/50 bg-off-white px-4 py-3 text-xs leading-relaxed text-charcoal">
          This is your own account. Deactivating it or removing your Super Admin role will sign
          you out of privileged access on your next request.
        </p>
      )}

      {state.error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={pending}
          className="bg-navy px-5 py-2.5 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
