"use server";

import { createClient } from "../../../../../../../utils/supabase/server";
import { revalidatePath } from "next/cache";
export async function createOrUpdateEnrollment(formData, year_label, section) {
  const supabase = await createClient();

  const id = formData.get("id"); // present when editing
  const class_id = formData.get("class_id");
  const month = formData.get("month");

  const boys = Number(formData.get("boys")) || 0;
  const girls = Number(formData.get("girls")) || 0;

  if (!class_id) {
    throw new Error("Class ID is required.");
  }

  // UPDATE
  if (id) {
    const { error } = await supabase
      .from("enrollment")
      .update({
        boys,
        girls,
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath(`/class/${year_label}/${section}/${class_id}`);
    return { success: true, action: "updated" };
  }
  /* -----------------------------------
     1. DUPLICATE CHECK
  ----------------------------------- */
  let duplicateQuery = supabase
    .from("enrollment")
    .select("id")
    .eq("class_id", class_id)
    .eq("month", month);

  // Exclude self when updating
  if (id) {
    duplicateQuery = duplicateQuery.neq("id", id);
  }

  const { data: existing, error: duplicateError } =
    await duplicateQuery.maybeSingle();

  if (duplicateError) {
    throw new Error("Failed to validate existing MPS data");
  }

  if (existing) {
    throw new Error(`  ${month} already exists`);
  }
  // INSERT
  const { error } = await supabase.from("enrollment").insert({
    class_id,
    boys,
    girls,
    month,
  });

  if (error) throw error;
  revalidatePath(`/class/${year_label}/${section}/${class_id}`);

  return { success: true, action: "created" };
}
export async function deleteEnrollment(id, year_label, section, class_id) {
  const supabase = await createClient();

  const { error } = await supabase.from("enrollment").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete enrollment data");
  }
  revalidatePath(`/class/${year_label}/${section}/${class_id}`);
}
