"use server";

import { revalidatePath } from "next/cache";
import { checkRole } from "../../../utils/lib/checkRole";
import { createClient } from "../../../utils/supabase/server";

function appScriptUrl() {
  const url = process.env.APPSCRIPT_URL_GPA_TERM;
  if (!url) {
    throw new Error("APPSCRIPT_URL_GPA_TERM is not configured.");
  }
  return url;
}

async function callAppsScript(action, data) {
  const res = await fetch(appScriptUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ action, data }),
  });

  const body = await res.text();
  let result;

  try {
    result = JSON.parse(body);
  } catch {
    console.error("Apps Script returned non-JSON:", body.slice(0, 500));
    throw new Error("Unexpected response from the GPA Term service.");
  }

  if (result.status === "error") {
    throw new Error(result.message);
  }

  return result;
}

export async function getClass(school_year) {
  const supabase = await createClient();
  const { data: classes } = await supabase
    .from("class")
    .select("id, section, grade")
    .eq("school_year", school_year);

  return { classes };
}

// Grades the given profile is allowed to edit GPA Term entries for, taken
// straight from their account's gradeToEdit array (set by an admin under
// /users — a teacher can be assigned more than one grade). Admins may edit
// any grade, signalled by returning null (no restriction). Visitors and
// any editor with no assigned grades get no edit rights.
function getEditableGrades(profile) {
  if (!profile) return [];
  if (profile.role === "admin") return null;
  if (profile.role !== "editor") return [];

  return Array.isArray(profile.gradeToEdit)
    ? profile.gradeToEdit.map(String)
    : [];
}

function canEditGrade(editableGrades, grade) {
  if (editableGrades === null) return true; // admin
  if (!editableGrades) return false;
  return editableGrades.includes(String(grade));
}

// Looked up server-side (never trust a client-supplied grade for a
// permission decision) so updateGPATerm can check the real grade behind a
// class_id.
async function getClassGrade(class_id) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("class")
    .select("grade")
    .eq("id", class_id)
    .maybeSingle();

  return data?.grade ?? null;
}

export async function getGPATerm(school_year) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", data: [] };
  }

  const profile = await checkRole();
  const editableGrades = getEditableGrades(profile);

  let rows;

  try {
    rows = await callAppsScript("getRecords", { school_year });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Unable to load GPA Term records.",
      data: [],
    };
  }

  const { data: classes } = await supabase
    .from("class")
    .select(
      `
      id,
      grade,
      section,
      school_year,
      adviser:users!adviser_id (
        id,
        full_name,
        email
      )
    `,
    )
    .eq("school_year", school_year);

  const classById = new Map((classes || []).map((c) => [String(c.id), c]));

  const data = (rows || []).map((row) => {
    const cls = classById.get(String(row.class_id)) || {
      id: row.class_id,
      grade: "?",
      section: "Unknown",
      school_year,
      adviser: null,
    };

    return {
      ...row,
      class: cls,
      canEdit: canEditGrade(editableGrades, cls.grade),
    };
  });

  return { data, editableGrades };
}

export async function createBulkGPATerm({
  school_year,
  section,
  grade,
  term,
  class_id,
}) {
  const profile = await checkRole();
  if (!profile || profile.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const result = await callAppsScript("addBulk", {
    class_id,
    term,
    school_year,
    owner_email: profile.email,
    owner_id: profile.id,
  });

  revalidatePath(`/gpa-term/${school_year}`);

  return {
    success: true,
    inserted: result.inserted,
  };
}

export async function updateGPATerm(
  class_id,
  term,
  subject,
  formData,
  school_year,
) {
  const profile = await checkRole();
  if (!profile) {
    return { success: false, error: "Unauthorized" };
  }

  const grade = await getClassGrade(class_id);
  const editableGrades = getEditableGrades(profile);

  if (!canEditGrade(editableGrades, grade)) {
    return {
      success: false,
      error: "You are not assigned to edit this grade level.",
    };
  }

  await callAppsScript("update", {
    class_id,
    term,
    subject,
    school_year,

    not_meet_male: Number(formData.not_meet_male) || 0,
    not_meet_female: Number(formData.not_meet_female) || 0,

    fs_male: Number(formData.fs_male) || 0,
    fs_female: Number(formData.fs_female) || 0,

    s_male: Number(formData.s_male) || 0,
    s_female: Number(formData.s_female) || 0,

    vs_male: Number(formData.vs_male) || 0,
    vs_female: Number(formData.vs_female) || 0,

    e_male: Number(formData.e_male) || 0,
    e_female: Number(formData.e_female) || 0,
  });

  revalidatePath(`/gpa-term/${school_year}`);

  return {
    success: true,
  };
}

export async function deleteGPATerm({ term, class_id, school_year, password }) {
  if (password !== process.env.DELETE_PASSWORD) {
    return { message: "invalid_password" };
  }

  const profile = await checkRole();
  if (!profile || profile.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await callAppsScript("delete", { class_id, term, school_year });
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unable to delete GPA Term records.",
    };
  }

  revalidatePath(`/gpa-term/${school_year}`);

  return {
    success: true,
    message: "GPA Term deleted successfully",
  };
}
