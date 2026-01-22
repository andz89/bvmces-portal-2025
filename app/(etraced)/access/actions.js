"use server";

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

export async function getClassesEnrollment(school_year_id, profile) {
  const supabase = await createClient();

  const currentMonth = new Date().toLocaleString("en-US", {
    month: "long",
  });

  const { data, error } = await supabase
    .from("class")
    .select(
      `
      id,
      grade,
      section,
      enrollment (
        id,
        boys,
        girls,
        month
      )
      `
    )
    .eq("school_year_id", school_year_id)
    .eq("enrollment.month", currentMonth) // ✅ filter child table
    .order("grade", { ascending: true })
    .order("section", { ascending: true });

  if (error) throw error;
  return data;
}
