"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../utils/supabase/server";
import { z } from "zod";

import { textValueSchema, uuidSchema } from "./utils/zodSchemas";

const updateSectionSchema = z.object({
  id: uuidSchema("class ID"),

  school_year_id: uuidSchema("school year ID"),

  section: textValueSchema({
    field: "Section",
    min: 3,
    max: 16,
  }),
});
const createClassSchema = z.object({
  grade: textValueSchema({
    field: "Grade",
    min: 1,
    max: 16,
  }),
  school_year_id: uuidSchema("school year ID"),

  section: textValueSchema({
    field: "Section",
    min: 3,
    max: 16,
  }),
  year_label: textValueSchema({
    field: "School Year",
    min: 1,
    max: 16,
  }),
});
const assignAdviserSchema = z.object({
  adviserId: uuidSchema("adviser ID is missing"),
  classId: uuidSchema("adviser ID is missing"),
});
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
  const { data: schoolYearData, error: schoolYearError } = await supabase
    .from("school_year")
    .select("active_month")
    .eq("id", school_year_id)
    .single();

  if (schoolYearError) {
    console.log(schoolYearError);
    return;
  }

  const targetMonth = schoolYearData.active_month;
  // Admin & visitor → all classes
  if (profile?.role === "admin" || profile?.role === "visitor") {
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
      .eq("enrollment.month", targetMonth)
      .eq("school_year_id", school_year_id)
      .order("grade", { ascending: true })
      .order("section", { ascending: true });

    if (error) throw error;
    return data;
  }

  // Editor → filtered by grade
  if (profile?.role === "editor") {
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
export async function createClass(data) {
  const validatedFields = createClassSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    };
  }

  const { grade, section, school_year_id, year_label } = validatedFields.data;

  const supabase = await createClient();

  //  Check if section already exists in the same school year
  const { data: existingClass, error: checkError } = await supabase
    .from("class")
    .select("id")
    .eq("school_year_id", school_year_id)
    .eq("section", section.toLowerCase())

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
export async function updateSection(data) {
  const validatedFields = updateSectionSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    };
  }

  const { id, section, school_year_id } = validatedFields.data;

  const supabase = await createClient();

  // Check duplicate section
  const { data: existingClass, error: checkError } = await supabase
    .from("class")
    .select("id")
    .eq("school_year_id", school_year_id)
    .eq("section", section.toLowerCase())
    .neq("id", id)
    .maybeSingle();

  if (checkError) {
    return { error: checkError.message };
  }

  if (existingClass) {
    return { error: "section_exists" };
  }

  // Update section
  const { error } = await supabase
    .from("class")
    .update({
      section: section.toLowerCase(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
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
export async function assignAdviser(data) {
  console.log(data);
  const validatedFields = assignAdviserSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    };
  }
  const { classId, adviserId } = validatedFields.data;

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
  try {
    if (password !== process.env.DELETE_PASSWORD) {
      return { message: "invalid_password" };
    }

    const supabase = await createClient();

    const { error } = await supabase.from("class").delete().eq("id", classId);

    if (error) {
      console.error(error);

      return {
        message: error.code || "delete_failed",
      };
    }

    return { message: "true" };
  } catch (error) {
    console.error(error);

    // fetch timeout / network issue / unknown server error
    return {
      message: "server_timeout",
    };
  }
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
