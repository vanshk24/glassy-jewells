import { supabase } from "~/supabase/client";
import type { SiteSettings, UpdateSiteSettingsInput } from "~/types/site-settings";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }

  return data as SiteSettings;
}

export async function updateSiteSettings(
  updates: UpdateSiteSettingsInput
): Promise<{ success: boolean; data?: SiteSettings; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1)
      .select()
      .single();

    if (error) {
      console.error("Error updating site settings:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as SiteSettings };
  } catch (err) {
    console.error("Unexpected error updating site settings:", err);
    return { success: false, error: "Failed to update site settings" };
  }
}
