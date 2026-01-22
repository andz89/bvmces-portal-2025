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

export async function getClasses(school_year_id, profile) {
  const supabase = await createClient();
  if (profile.role === "admin") {
    const { data, error } = await supabase
      .from("class")
      .select("*")
      .eq("school_year_id", school_year_id)

      .order("grade", { ascending: true })
      .order("section", { ascending: true });
    if (error) throw error;

    return data;
  } else {
    const { data, error } = await supabase
      .from("class")
      .select("*")
      .eq("school_year_id", school_year_id)
      .eq("grade", profile.grade)
      .order("grade", { ascending: true })
      .order("section", { ascending: true });
    if (error) throw error;

    return data;
  }
}

export async function createClass({ school_year_id, grade, section }) {
  const supabase = await createClient();

  const { error } = await supabase.from("class").insert({
    school_year_id,
    grade,
    section,
  });

  if (error) {
    return { message: error.code };
  } else {
    return { message: "true" };
  }
}
export async function deleteClass(class_id) {
  const supabase = await createClient();

  const { error } = await supabase.from("class").delete().eq("id", class_id);

  if (error) {
    return { message: error.code };
  }

  return { message: "true" };
}
