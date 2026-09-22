"use server";

import { createClient } from "../../../../utils/supabase/server";

// MPS (Quarter) has been superseded by MPS Term and is now read-only:
// no new records, edits, or deletes are accepted.
const READ_ONLY_MESSAGE =
  "MPS (Quarter) is read-only. Please use MPS Term instead.";

export async function createMPSReport() {
  return { error: READ_ONLY_MESSAGE };
}

export async function getMPSReports(year_label) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Unauthorized",
      data: [],
    };
  }

  const { data, error } = await supabase
    .from("mps")
    .select(
      `
    *,
    class:class_id!inner (
      id,
      grade,
      section,
      school_year,
       adviser:users!adviser_id (
        id,
        full_name,
        email
      )
    )
  `,
    )
    .eq("class.school_year", year_label);

  if (error) {
    return {
      error: error.message,
      data: [],
    };
  }

  return { data };
}
export async function getClass(school_year) {
  const supabase = await createClient();
  const { data: classes } = await supabase
    .from("class")
    .select("id, section, grade")
    .eq("school_year", school_year);

  return { classes };
}

export async function deleteMPSReport() {
  return {
    success: false,
    message: READ_ONLY_MESSAGE,
  };
}

export async function updateMPSReport() {
  return { error: READ_ONLY_MESSAGE };
}
