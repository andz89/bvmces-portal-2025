"use server";

import { createClient } from "@/utils/supabase/server";
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

export async function getClassesEnrollment({ school_year_id }) {
  try {
    const supabase = await createClient();
    /* Get active month from school_year table */
    const { data: schoolYearData, error: schoolYearError } = await supabase
      .from("school_year")
      .select("active_month")
      .eq("id", school_year_id)
      .single();

    if (schoolYearError) {
      console.error(schoolYearError);

      return {
        error: "Failed to get school year data.",
      };
    }

    const targetMonth = schoolYearData.active_month;
    const { data, error } = await supabase
      .from("class")
      .select(
        `
      id,
      grade,
      section,
      school_year,
    
       enrollment!inner (
        id,
        boys,
        girls,
        month
      ),   users!adviser_id (
      id,
      full_name,
      email
    )

      `,
      )
      .eq("school_year_id", school_year_id)
      .eq("enrollment.month", targetMonth);

    if (error) {
      console.error(error);

      return {
        error: "Failed to fetch class enrollments.",
      };
    }

    return {
      data,
    };
  } catch (error) {
    console.error(error);

    return {
      error: "Server timeout. Please try again.",
    };
  }
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
