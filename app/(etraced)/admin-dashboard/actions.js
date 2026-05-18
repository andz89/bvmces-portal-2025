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

  /*
    If setting current school year to active,
    inactive all other school years first
  */
  if (values.status === "active") {
    const { error: inactiveError } = await supabase
      .from("school_year")
      .update({
        status: "inactive",
      })
      .neq("id", values.id);

    if (inactiveError) {
      return {
        error: inactiveError.message,
      };
    }
  }

  /* Update selected school year */
  const { error } = await supabase
    .from("school_year")
    .update({
      status: values.status,
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
