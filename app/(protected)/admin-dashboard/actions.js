// app/(admin)/school-year/actions.jsx

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function getSchoolYears() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("school_year")
    .select("id,year_label,status,active_month")
    .order("year_label", {
      ascending: false,
    });

  if (error) {
    console.log(error);
    return [];
  }

  return data;
}

export async function updateSchoolYear(values) {
  const supabase = await createClient();

  /* Update selected school year */
  const { error } = await supabase
    .from("school_year")
    .update({
      active_month: values.active_month,
    })
    .eq("id", values.id);

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/admin-dashboard");

  return {
    success: true,
  };
}
