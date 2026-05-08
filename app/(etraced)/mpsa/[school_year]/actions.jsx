"use server";

import { createClient } from "../../../../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { reportSchema } from "./reportSchema";
export async function createMPSReport(prevState, formData) {
  const rawData = {
    section: formData.get("section"),
    school_year: formData.get("school_year"),

    quarter: formData.get("quarter"),
    grade: formData.get("grade"),
    gmrc: formData.get("gmrc"),
    epp: formData.get("epp"),
    filipino: formData.get("filipino"),
    english: formData.get("english"),
    math: formData.get("math"),
    science: formData.get("science"),
    ap: formData.get("ap"),
    mapeh: formData.get("mapeh"),
    reading_literacy: formData.get("reading_literacy"),
    llc_source: formData.get("llc_source"),
    mps_source: formData.get("mps_source"),
  };
  const validated = reportSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      error: validated.error.issues[0].message,
      values: rawData,
    };
  }
  const supabase = await createClient();

  // ✅ get logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Unauthorized" };
  }

  const normalizedSection = rawData.section.trim().toLowerCase();

  console.log(rawData);
  const data = {
    section: normalizedSection,

    quarter: rawData.quarter,
    school_year: rawData.school_year,
    grade: rawData.grade,

    gmrc: rawData.gmrc ? Number(rawData.gmrc) : null,
    epp: rawData.epp ? Number(rawData.epp) : null,
    filipino: rawData.filipino ? Number(rawData.filipino) : null,
    english: rawData.english ? Number(rawData.english) : null,
    math: rawData.math ? Number(rawData.math) : null,
    science: rawData.science ? Number(rawData.science) : null,
    ap: rawData.ap ? Number(rawData.ap) : null,
    mapeh: rawData.mapeh ? Number(rawData.mapeh) : null,
    reading_literacy: rawData.reading_literacy
      ? Number(rawData.reading_literacy)
      : null,
    llc_source: rawData.llc_source,
    mps_source: rawData.mps_source,
    // owner_email: user.email,
    // owner_id: user.id,
  };
  // ✅ check duplicate section per quarter

  const { data: existingSection, error: checkError } = await supabase
    .from("mps_duplicate")
    .select("id")
    .eq("quarter", rawData.quarter)
    .ilike("section", normalizedSection)
    .maybeSingle();

  if (checkError) {
    return {
      error: checkError.message,
      values: rawData,
    };
  }

  if (existingSection) {
    return {
      error: `Section "${rawData.section}" already exists in Quarter ${rawData.quarter}`,
      values: rawData,
    };
  }
  const { error } = await supabase.from("mps_duplicate").insert([data]);

  if (error) {
    return { error: error.message, values: rawData };
  }

  revalidatePath("/mpsa");

  return { success: true };
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
    .from("mps_duplicate")
    .select("*")
    .eq("school_year", year_label);

  if (error) {
    return {
      error: error.message,
      data: [],
    };
  }

  return { data };
}

export async function deleteMPSReport(prevState, formData) {
  const supabase = await createClient();

  const id = formData.get("id");
  const password = formData.get("password");
  const pathname = formData.get("pathname");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (password !== "132289132289") {
    return { error: "Wrong password" };
  }

  const { error } = await supabase.from("mps_duplicate").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/mpsa");

  return { success: true };
}

export async function updateMPSReport(id, prevState, formData) {
  const rawData = {
    section: formData.get("section"),
    school_year: formData.get("school_year"),

    quarter: formData.get("quarter"),
    grade: formData.get("grade"),

    gmrc: formData.get("gmrc"),
    epp: formData.get("epp"),
    filipino: formData.get("filipino"),
    english: formData.get("english"),
    math: formData.get("math"),
    science: formData.get("science"),
    ap: formData.get("ap"),
    mapeh: formData.get("mapeh"),

    reading_literacy: formData.get("reading_literacy"),

    llc_source: formData.get("llc_source"),
    mps_source: formData.get("mps_source"),
  };

  // validate
  const validated = reportSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      error: validated.error.issues[0].message,
      values: rawData,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // sanitized update data
  const updatedData = {
    section: rawData.section,
    school_year: rawData.school_year,

    quarter: rawData.quarter,
    grade: rawData.grade,

    gmrc: rawData.gmrc ? Number(rawData.gmrc) : null,

    epp: rawData.epp ? Number(rawData.epp) : null,

    filipino: rawData.filipino ? Number(rawData.filipino) : null,

    english: rawData.english ? Number(rawData.english) : null,

    math: rawData.math ? Number(rawData.math) : null,

    science: rawData.science ? Number(rawData.science) : null,

    ap: rawData.ap ? Number(rawData.ap) : null,

    mapeh: rawData.mapeh ? Number(rawData.mapeh) : null,

    reading_literacy: rawData.reading_literacy
      ? Number(rawData.reading_literacy)
      : null,

    llc_source: rawData.llc_source,
    mps_source: rawData.mps_source,
  };

  const { error } = await supabase
    .from("mps_duplicate")
    .update(updatedData)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/mpsa");

  return { success: true };
}
