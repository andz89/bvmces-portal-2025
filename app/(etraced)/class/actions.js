"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../../utils/supabase/server";
export async function getSchoolYear(year_label) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("school_year")
    .select("*")
    .eq("year_label", year_label)
    .single();

  if (error) throw error;
  return data;
}

export async function getClasses(school_year_id, profile) {
  const supabase = await createClient();

  // Admin & visitor → all classes
  if (profile.role === "admin" || profile.role === "visitor") {
    const { data, error } = await supabase
      .from("class")
      .select(
        `
  *,
  enrollment (*),
   users!adviser_id (
      id,
      full_name,
      email
    )
`,
      )
      .eq("school_year_id", school_year_id)
      .order("grade", { ascending: true })
      .order("section", { ascending: true });

    if (error) throw error;
    return data;
  }

  // Editor → filtered by grade
  if (profile.role === "editor") {
    const { data, error } = await supabase
      .from("class")
      .select(
        `
  *,
  enrollment (*),
   users!adviser_id (
      id,
      full_name,
      email
    )
`,
      )
      .eq("school_year_id", school_year_id)
      .in("grade", profile.gradeToEdit)
      .order("grade", { ascending: true })
      .order("section", { ascending: true });

    if (error) throw error;
    return data;
  }

  // Fallback (important)
  return [];
}
export async function createClass({
  school_year_id,
  grade,
  section,
  year_label,
}) {
  const supabase = await createClient();

  //  Check if section already exists in the same school year
  const { data: existingClass, error: checkError } = await supabase
    .from("class")
    .select("id")
    .eq("school_year_id", school_year_id)
    .eq("section", section)
    .maybeSingle();

  if (checkError) {
    return { message: checkError.code };
  }

  if (existingClass) {
    return { message: "section_exists" };
  }

  //   Insert new class
  const { error } = await supabase.from("class").insert({
    school_year_id,
    school_year: year_label,
    grade,
    section,
  });

  if (error) {
    return { message: error.code };
  }

  return { message: "true" };
}
export async function updateSection({ id, section, school_year_id }) {
  const supabase = await createClient();

  //   Check if section already exists in the same school year
  const { data: existingClass, error: checkError } = await supabase
    .from("class")
    .select("id")
    .eq("school_year_id", school_year_id)
    .eq("section", section)
    .maybeSingle();

  if (checkError) {
    return { error: checkError.code };
  }

  if (existingClass) {
    return { error: "section_exists" };
  }
  //  Insert new class
  const { error } = await supabase
    .from("class")
    .update({
      section,
    })
    .eq("id", id);

  if (error) {
    return { error: error.code };
  }

  return { message: "true" };
}
export async function getUsers(profile) {
  const supabase = await createClient();

  if (profile.role !== "admin") {
    return { message: "unauthorized" };
  }

  const { data, error } = await supabase.from("users").select("*");

  if (error) throw error;
  return data;
}
export async function assignAdviser({ classId, adviserId }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("class")
    .update({
      adviser_id: adviserId,
    })
    .eq("id", classId);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
export async function deleteClass(classId, password) {
  if (password !== process.env.DELETE_PASSWORD) {
    return { message: "invalid_password" };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("class").delete().eq("id", classId);

  if (error) {
    return { message: error.code };
  }

  return { message: "true" };
}
export async function createSchoolYear(yearLabel) {
  const supabase = await createClient();

  if (!yearLabel?.trim()) return;

  /* Inactive all school years */
  const { error: inactiveError } = await supabase
    .from("school_year")
    .update({
      status: "inactive",
    })
    .not("id", "is", null);

  if (inactiveError) {
    console.log(inactiveError);

    return {
      error: inactiveError.message,
    };
  }

  /* Create new active school year */
  const { error } = await supabase.from("school_year").insert({
    year_label: yearLabel,
    status: "active",
  });

  if (error) {
    console.log(error);

    return {
      error: error.message,
    };
  }

  revalidatePath("/admin-dashboard");

  return {
    success: true,
  };
}
export async function getAllSchoolYears() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("school_year")
    .select("*")
    .order("year_label", { ascending: false });

  if (error) throw error;
  return data;
}
