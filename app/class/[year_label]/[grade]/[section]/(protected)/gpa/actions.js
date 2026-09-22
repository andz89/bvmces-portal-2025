"use server";

import { createClient } from "@/utils/supabase/server";

// GPA (Quarter) has been superseded by GPA Term and is now read-only:
// no new records, edits, or deletes are accepted.
const READ_ONLY_MESSAGE =
  "GPA (Quarter) is read-only. Please use GPA Term instead.";

export async function createBulkGPA() {
  return {
    error: READ_ONLY_MESSAGE,
  };
}

export async function getGPA(school_year, id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gpa")
    .select(
      `
      *,
      class:class_id!inner (
        id,
        grade,
        section
      )
    `,
    )

    .eq("class.school_year", school_year)
    .eq("class.id", id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateGPA() {
  return {
    error: READ_ONLY_MESSAGE,
  };
}

export async function deleteGPA() {
  return {
    success: false,
    message: READ_ONLY_MESSAGE,
  };
}
