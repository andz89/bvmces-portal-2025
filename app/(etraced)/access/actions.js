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

export async function getClassesEnrollment({ school_year_id }) {
  const supabase = await createClient();

  // ✅ Allowed school months
  const schoolMonths = [
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
  ];

  const currentDate = new Date();

  let targetMonth = currentDate.toLocaleString("en-US", {
    month: "long",
  });

  // ✅ If current month is not June-April,
  // use April instead
  if (!schoolMonths.includes(targetMonth)) {
    targetMonth = "March";
  }

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
      )
      `,
    )
    .eq("school_year_id", school_year_id)
    .eq("enrollment.month", targetMonth);

  if (error) throw error;

  return data;
}
