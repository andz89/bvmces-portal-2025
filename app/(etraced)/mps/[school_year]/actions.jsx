"use server";

import { createClient } from "../../../../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { reportSchema } from "./reportSchema";
export async function createMPSReport(prevState, formData) {
  const rawData = {
    class_id: formData.get("class_id"),
    quarter: formData.get("quarter"),
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

  const { data: existing } = await supabase
    .from("mps")
    .select("id")
    .eq("class_id", rawData.class_id)
    .eq("quarter", rawData.quarter)
    .maybeSingle();

  if (existing) {
    return {
      error: "This class already has an MPS report for this quarter.",
      values: rawData,
    };
  }

  // ✅ get logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Unauthorized" };
  }

  const data = {
    class_id: rawData.class_id,
    quarter: rawData.quarter,

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

  const { error } = await supabase.from("mps").insert([data]);

  if (error) {
    return { error: error.message, values: rawData };
  }

  revalidatePath("/mps");

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
    .from("mps")
    .select(
      `
    *,
    class:class_id!inner (
      id,
      grade,
      section,
      school_year
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

  const { error } = await supabase.from("mps").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/mps");

  return { success: true };
}

export async function updateMPSReport(id, prevState, formData) {
  const rawData = {
    class_id: formData.get("class_id"),

    quarter: formData.get("quarter"),

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
    class_id: rawData.class_id,

    quarter: rawData.quarter,

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

  const { error } = await supabase.from("mps").update(updatedData).eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/mps");

  return { success: true };
}
