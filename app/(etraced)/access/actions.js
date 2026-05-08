"use server";

import { createClient } from "../../../utils/supabase/server";
export async function getSchoolYear(year_label) {
  const supabase = await createClient();
  console.log(year_label);
  const { data, error } = await supabase
    .from("school_year")
    .select("*")
    .eq("year_label", year_label)
    .single();

  if (error) throw error;
  return data;
}

export async function getClassesEnrollment(school_year_id, year_label) {
  const supabase = await createClient();
  let targetMonth;
  const schoolYear = year_label;

  const result = schoolYear.split("-")[1];
  const currentDate = new Date();

  // April 1, 2025
  const targetDate = new Date(`${result}-04-01`);

  if (currentDate >= targetDate) {
    targetMonth = "March";
  } else {
    targetMonth = currentDate.toLocaleString("en-US", {
      month: "long",
    });
  }

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
      `,
    )
    .eq("school_year_id", school_year_id)
    .eq("enrollment.month", targetMonth) // ✅ filter child table
    .order("grade", { ascending: true })
    .order("section", { ascending: true });

  if (error) throw error;
  return data;
}
