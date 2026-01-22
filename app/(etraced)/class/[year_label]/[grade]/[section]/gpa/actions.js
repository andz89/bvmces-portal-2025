"use server";

import { createClient } from "../../../../../../../utils/supabase/server";
import { revalidatePath } from "next/cache";

/* -----------------------------
   CREATE / UPDATE GPA
----------------------------- */
export async function createOrUpdateGPA(
  formData,
  class_id,
  year_label,
  section
) {
  const supabase = await createClient();

  const id = formData.get("id");
  let subject = formData.get("subject");
  let quarter = formData.get("quarter");
  const payload = {
    class_id,
    subject,
    quarter,

    not_meet_male: Number(formData.get("not_meet_male") || 0),
    not_meet_female: Number(formData.get("not_meet_female") || 0),

    fs_male: Number(formData.get("fs_male") || 0),
    fs_female: Number(formData.get("fs_female") || 0),

    s_male: Number(formData.get("s_male") || 0),
    s_female: Number(formData.get("s_female") || 0),

    vs_male: Number(formData.get("vs_male") || 0),
    vs_female: Number(formData.get("vs_female") || 0),

    e_male: Number(formData.get("e_male") || 0),
    e_female: Number(formData.get("e_female") || 0),
  };

  let result;
  /* -----------------------------------
     1. DUPLICATE CHECK
  ----------------------------------- */
  let duplicateQuery = supabase
    .from("gpa")
    .select("id")
    .eq("class_id", class_id)
    .eq("quarter", quarter)
    .eq("subject", subject);

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
    throw new Error(`  ${subject} already exists in ${quarter}`);
  }
  if (id) {
    result = await supabase.from("gpa").update(payload).eq("id", id);
  } else {
    result = await supabase.from("gpa").insert(payload);
  }

  if (result.error) {
    throw new Error(result.error.message);
  }

  revalidatePath(`/class/${year_label}/${section}/${class_id}`);

  return { success: true };
}

/* -----------------------------
   DELETE GPA
----------------------------- */
export async function deleteGPA(id, class_id, year_label, section) {
  const supabase = await createClient();

  const { error } = await supabase.from("gpa").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/class/${year_label}/${section}/${class_id}`);

  return { success: true };
}
