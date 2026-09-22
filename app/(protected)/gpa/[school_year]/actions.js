"use server";

import { createClient } from "../../../../utils/supabase/server";

// GPA (Quarter) has been superseded by GPA Term and is now read-only:
// no new records, edits, or deletes are accepted.
const READ_ONLY_MESSAGE =
  "GPA (Quarter) is read-only. Please use GPA Term instead.";

export async function createBulkGPA() {
  throw new Error(READ_ONLY_MESSAGE);
}

export async function getGPA(school_year) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gpa")
    .select(
      `
      *,
      class:class_id!inner (
        id,
        grade,
        section,
        adviser:users!adviser_id (
        id,
        full_name,
        email
      )
      )
    `,
    )

    .eq("class.school_year", school_year);
  // .order("section", { ascending: true })
  // .order("subject", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
export async function getClass(school_year) {
  const supabase = await createClient();
  const { data: classes } = await supabase
    .from("class")
    .select("id, section, grade")
    .eq("school_year", school_year);

  return { classes };
}

export async function updateGPA() {
  throw new Error(READ_ONLY_MESSAGE);
}

export async function deleteGPA() {
  return {
    success: false,
    message: READ_ONLY_MESSAGE,
  };
}
