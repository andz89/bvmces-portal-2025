"use server";

import { createClient } from "../../../../utils/supabase/server";

export async function getSchoolYears() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("school_year")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createSchoolYear(yearLabel) {
  const supabase = await createClient();

  if (!yearLabel?.trim()) return;

  const { error } = await supabase
    .from("school_year")
    .insert({ year_label: yearLabel });

  if (error) throw error;
}

export async function deleteSchoolYear(id) {
  const supabase = await createClient();
  const { error } = await supabase.from("school_year").delete().eq("id", id);

  if (error) throw error;
}
