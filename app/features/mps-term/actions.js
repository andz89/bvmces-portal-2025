"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { checkRole } from "../../../utils/lib/checkRole";
import { createClient } from "../../../utils/supabase/server";
import { reportSchema } from "./reportSchema";

function appScriptUrl() {
  const url = process.env.APPSCRIPT_URL_MPS_TERM;
  if (!url) {
    throw new Error("APPSCRIPT_URL_MPS_TERM is not configured.");
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
    throw new Error("Unexpected response from the file service.");
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

// Grades the given profile is allowed to edit MPS Term reports for, taken
// straight from their account's gradeToEdit array (set by an admin under
// /users — a teacher can be assigned more than one grade). Admins may
// edit any grade, signalled by returning null (no restriction). Visitors
// and any editor with no assigned grades get no edit rights.
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
// permission decision) so updateMPSTermReport can check the real grade
// behind a class_id.
async function getClassGrade(class_id) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("class")
    .select("grade")
    .eq("id", class_id)
    .maybeSingle();

  return data?.grade ?? null;
}

export async function getMPSTermReports(school_year) {
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
    rows = await callAppsScript("getFiles", { school_year });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Unable to load reports.",
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

export async function createMPSTermReport(prevState, formData) {
  const rawData = {
    class_id: formData.get("class_id"),
    term: formData.get("term"),
    exam_type: formData.get("exam_type"),
    gmrc: formData.get("gmrc"),
    epp: formData.get("epp"),
    filipino: formData.get("filipino"),
    english: formData.get("english"),
    math: formData.get("math"),
    science: formData.get("science"),
    ap: formData.get("ap"),
    mapeh: formData.get("mapeh"),
    reading_literacy: formData.get("reading_literacy"),
  };

  const school_year = formData.get("school_year");

  const validated = reportSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      error: validated.error.issues[0].message,
      values: rawData,
    };
  }

  if (!school_year) {
    return { error: "School year is missing.", values: rawData };
  }

  const file = formData.get("file");
  if (!file || file.size === 0) {
    return { error: "Please upload the MPS file.", values: rawData };
  }

  const profile = await checkRole();
  if (!profile || profile.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileData = {
      fileName: file.name,
      mimeType: file.type,
      data: buffer.toString("base64"),
    };

    await callAppsScript("addMPSTerm", {
      id: uuidv4(),
      class_id: rawData.class_id,
      term: rawData.term,
      exam_type: rawData.exam_type,
      school_year,
      gmrc: Number(rawData.gmrc),
      epp: Number(rawData.epp),
      filipino: Number(rawData.filipino),
      english: Number(rawData.english),
      math: Number(rawData.math),
      science: Number(rawData.science),
      ap: Number(rawData.ap),
      mapeh: Number(rawData.mapeh),
      reading_literacy: Number(rawData.reading_literacy),
      owner_email: profile.email,
      owner_id: profile.id,
      fileData,
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Unable to save report.",
      values: rawData,
    };
  }

  revalidatePath(`/mps-term/${school_year}`);
  return { success: true };
}

export async function updateMPSTermReport(prevState, formData) {
  const id = formData.get("id");
  const term = formData.get("term");
  const exam_type = formData.get("exam_type");
  const school_year = formData.get("school_year");

  const rawData = {
    class_id: formData.get("class_id"),
    term,
    exam_type,
    gmrc: formData.get("gmrc"),
    epp: formData.get("epp"),
    filipino: formData.get("filipino"),
    english: formData.get("english"),
    math: formData.get("math"),
    science: formData.get("science"),
    ap: formData.get("ap"),
    mapeh: formData.get("mapeh"),
    reading_literacy: formData.get("reading_literacy"),
  };

  const validated = reportSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      error: validated.error.issues[0].message,
      values: rawData,
    };
  }

  const profile = await checkRole();
  if (!profile) {
    return { error: "Unauthorized" };
  }

  const grade = await getClassGrade(rawData.class_id);
  const editableGrades = getEditableGrades(profile);

  if (!canEditGrade(editableGrades, grade)) {
    return { error: "You are not assigned to edit this grade level." };
  }

  try {
    const payload = {
      id,
      term,
      exam_type,
      school_year,
      gmrc: Number(rawData.gmrc),
      epp: Number(rawData.epp),
      filipino: Number(rawData.filipino),
      english: Number(rawData.english),
      math: Number(rawData.math),
      science: Number(rawData.science),
      ap: Number(rawData.ap),
      mapeh: Number(rawData.mapeh),
      reading_literacy: Number(rawData.reading_literacy),
    };

    const file = formData.get("file");
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      payload.fileData = {
        fileName: file.name,
        mimeType: file.type,
        data: buffer.toString("base64"),
      };
    }

    await callAppsScript("updateMPSTerm", payload);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Unable to update report.",
      values: rawData,
    };
  }

  revalidatePath(`/mps-term/${school_year}`);
  return { success: true };
}

export async function deleteMPSTermReport({ rowData, password, school_year }) {
  if (password !== process.env.DELETE_PASSWORD) {
    return { message: "invalid_password" };
  }

  const profile = await checkRole();
  if (!profile || profile.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await callAppsScript("delete", {
      id: rowData.id,
      term: rowData.term,
      school_year,
    });
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unable to delete report.",
    };
  }

  revalidatePath(`/mps-term/${school_year}`);

  return { success: true, message: "Report deleted successfully" };
}
