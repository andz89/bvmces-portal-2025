"use server";

import { revalidatePath } from "next/cache";
import { checkRole } from "../../../utils/lib/checkRole";
import { createClient } from "../../../utils/supabase/server";

function appScriptUrl() {
  const url = process.env.APPSCRIPT_URL_LLC;
  if (!url) {
    throw new Error("APPSCRIPT_URL_LLC is not configured.");
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
    throw new Error("Unexpected response from the LLC service.");
  }

  if (result.status === "error") {
    throw new Error(result.message);
  }

  return result;
}

// Grades the given profile is allowed to write LLC entries for, taken
// straight from their account's gradeToEdit array (set by an admin under
// /users — a teacher can be assigned more than one grade). Admins may
// write to any grade, signalled by returning null (no restriction).
// Visitors and any editor with no assigned grades get no edit rights.
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
  return editableGrades.includes(String(grade));
}

export async function getLLC(school_year) {
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
      error: err instanceof Error ? err.message : "Unable to load LLC entries.",
      data: [],
    };
  }

  const ownerIds = Array.from(
    new Set((rows || []).map((r) => r.owner_id).filter(Boolean)),
  );

  let ownersById = new Map();
  if (ownerIds.length > 0) {
    const { data: owners } = await supabase
      .from("users")
      .select("id, full_name")
      .in("id", ownerIds);

    ownersById = new Map((owners || []).map((o) => [String(o.id), o]));
  }

  const data = (rows || []).map((row) => ({
    ...row,
    canEdit: canEditGrade(editableGrades, row.grade),
    owner: ownersById.get(String(row.owner_id)) || null,
  }));

  return { data, editableGrades };
}

export async function saveLLC({ grade, subject, term, school_year, content }) {
  const profile = await checkRole();
  if (!profile) {
    return { error: "Unauthorized" };
  }

  const editableGrades = getEditableGrades(profile);
  if (!canEditGrade(editableGrades, grade)) {
    return {
      error: "You are not assigned to edit this grade level.",
    };
  }

  try {
    await callAppsScript("save", {
      grade,
      subject,
      term,
      school_year,
      content,
      owner_email: profile.email,
      owner_id: profile.id,
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Unable to save the LLC entry.",
    };
  }

  revalidatePath(`/llc/${school_year}`);

  return { success: true };
}

export async function deleteLLC({ grade, subject, term, school_year, password }) {
  if (password !== process.env.DELETE_PASSWORD) {
    return { message: "invalid_password" };
  }

  const profile = await checkRole();
  if (!profile || profile.role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await callAppsScript("delete", { grade, subject, term, school_year });
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Unable to delete the LLC entry.",
    };
  }

  revalidatePath(`/llc/${school_year}`);

  return { success: true, message: "LLC entry deleted successfully" };
}
