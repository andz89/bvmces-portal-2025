"use server";

import { createClient } from "../../../../../../../utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createMPS(formData) {
  const supabase = await createClient();

  const school_year = formData.get("school_year");

  const { data, error } = await supabase
    .from("mps_descriptions")
    .insert({ school_year })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/mps");

  return data.id;
}

export async function createOrUpdateMPSData(
  formData,
  section,
  year_label,
  grade
) {
  const supabase = await createClient();

  const id = formData.get("id");
  const class_id = formData.get("classID");
  console.log("=========", class_id);
  const quarter = formData.get("quarter").toLowerCase();
  const link = formData.get("link");
  const payload = {
    class_id,
    quarter,
    gmrc: formData.get("gmrc") || 0,
    epp: formData.get("epp") || 0,
    filipino: formData.get("filipino") || 0,
    english: formData.get("english") || 0,
    math: formData.get("math") || 0,
    science: formData.get("science") || 0,
    ap: formData.get("ap") || 0,
    mapeh: formData.get("mapeh") || 0,
    reading_literacy: formData.get("reading_literacy") || 0,
    link: link || null,
  };

  /* -----------------------------------
     1. DUPLICATE CHECK
  ----------------------------------- */
  let duplicateQuery = supabase
    .from("mps")
    .select("id")
    .eq("class_id", class_id)
    .eq("quarter", quarter);

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
    throw new Error(`  ${quarter} already exists`);
  }

  /* -----------------------------------
     2. INSERT OR UPDATE
  ----------------------------------- */
  let result;

  if (id) {
    result = await supabase.from("mps").update(payload).eq("id", id);
  } else {
    result = await supabase.from("mps").insert(payload);
  }

  if (result.error) {
    console.error("MPS save error:", result.error);
    throw new Error(result.error.message);
  }

  /* -----------------------------------
     3. REVALIDATE
  ----------------------------------- */
  revalidatePath(`/class/${year_label}/${section}/${class_id}`);

  return { success: true };
}

export async function deleteMPSData(id, mps_description_id, password) {
  if (password !== process.env.DELETE_PASSWORD) {
    return { message: "invalid_password" };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("mps").delete().eq("id", id);

  if (error) {
    console.error("Delete MPS error:", error);
    return { message: "error" };
  }

  revalidatePath(`/admin/mps/${mps_description_id}`);
  return { message: "true" };
}
