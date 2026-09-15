import { requireText, checkboxOn } from "@/lib/validation/cms";
import { Constants } from "@/lib/supabase/database.types";

const MAX_FULL_NAME = 120;

export const APP_ROLE_VALUES = Constants.public.Enums.app_role;
export type AppRoleValue = (typeof APP_ROLE_VALUES)[number];

export interface ProfileFieldValues {
  fullName: string;
  role: AppRoleValue;
  isActive: boolean;
}

export type ProfileValidationResult = { values: ProfileFieldValues } | { error: string };

export function validateProfileFields(formData: FormData): ProfileValidationResult {
  const fullName = requireText(formData, "full_name", "Full name", MAX_FULL_NAME);
  if ("error" in fullName) return fullName;

  const roleRaw = String(formData.get("role") ?? "");
  if (!APP_ROLE_VALUES.includes(roleRaw as AppRoleValue)) {
    return { error: "Please choose a valid role." };
  }

  return {
    values: {
      fullName: fullName.value,
      role: roleRaw as AppRoleValue,
      isActive: checkboxOn(formData, "is_active"),
    },
  };
}
