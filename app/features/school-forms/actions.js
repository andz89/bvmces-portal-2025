"use server";

import { revalidatePath } from "next/cache";
import { checkRole } from "../../../utils/lib/checkRole";
import { v4 as uuidv4 } from "uuid";
import { SF2_ROWS, SF_NEEDS_GRADE_SECTION } from "./sf2Rows";

export async function getSchoolForms() {
  const appScriptUrl = process.env.APPSCRIPT_URL_SCHOOL_FORMS;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL_SCHOOL_FORMS is not configured.");
  }

  const res = await fetch(appScriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ action: "getFiles" }),
  });

  if (!res.ok) {
    throw new Error(
      "Something went wrong. Please try again later or check the submissions list.",
    );
  }

  const result = await res.json();

  if (result.status === "error") {
    throw new Error(result.message);
  }
  return result;
}

// checkRole() talks to Supabase and can throw on a network/session hiccup.
// Catch that here so the form gets a readable error instead of a rejected
// server action.
async function getProfileSafe() {
  try {
    return { profile: await checkRole() };
  } catch (err) {
    console.error("checkRole failed:", err);
    return {
      error:
        "Could not verify your session. Please refresh the page and sign in again.",
    };
  }
}

function buildSf2FromFormData(formData) {
  const sf2 = {
    month: formData.get("sf2_month"),
    days_of_classes: formData.get("sf2_days_of_classes"),
  };

  if (!sf2.month || !sf2.days_of_classes) {
    return { error: "Please fill in all required fields." };
  }

  for (const { key } of SF2_ROWS) {
    const m = formData.get(`sf2_${key}_m`);
    const f = formData.get(`sf2_${key}_f`);
    const total = formData.get(`sf2_${key}_total`);

    if (m === null || m === "" || f === null || f === "" || total === null || total === "") {
      return { error: "Please fill in all required fields." };
    }

    sf2[`${key}_m`] = m;
    sf2[`${key}_f`] = f;
    sf2[`${key}_total`] = total;
  }

  return { sf2 };
}

export async function createSchoolForm(formData) {
  const { profile, error: profileError } = await getProfileSafe();

  if (profileError) {
    return { error: profileError };
  }
  if (!profile) {
    return { error: "Unauthorized" };
  }

  const sf = formData.get("sf");
  const note = formData.get("note");
  const grade = formData.get("grade");
  const school_year = formData.get("school_year");
  const section = formData.get("section");
  const file = formData.get("file");

  if (!sf || !note || !school_year) {
    return { error: "Please fill in all required fields." };
  }
  if (SF_NEEDS_GRADE_SECTION.includes(sf) && (!grade || !section)) {
    return { error: "Please fill in all required fields." };
  }
  if (!file || file.size === 0) {
    return { error: "Please upload a file." };
  }

  const MAX_FILE_SIZE = 52428800;
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File size must not exceed 50 MB." };
  }

  const ALLOWED_EXTENSIONS = [
    ".xlsx", ".xls", ".doc", ".docx", ".png", ".jpg", ".jpeg",
  ];
  const lowerName = file.name.toLowerCase();
  if (!ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))) {
    return { error: "File must be an Excel, Word, or image file." };
  }

  let sf2 = undefined;

  if (sf === "sf-2") {
    const built = buildSf2FromFormData(formData);
    if (built.error) return { error: built.error };
    sf2 = built.sf2;
  }

  try {
    const appScriptUrl = process.env.APPSCRIPT_URL_SCHOOL_FORMS;

    if (!appScriptUrl) {
      return {
        error: "The file service is not configured. Please contact an admin.",
      };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileData = {
      fileName: file.name,
      mimeType: file.type,
      data: buffer.toString("base64"),
    };

    const payload = {
      action: "addSchoolForm",
      data: {
        id: uuidv4(),
        sf,
        note,
        school_year,
        owner_name: profile.full_name,
        owner_email: profile.email,
        role: profile.role,
        fileData,
        ...(SF_NEEDS_GRADE_SECTION.includes(sf) && { grade, section }),
        ...(sf2 && { sf2 }),
      },
    };

    const response = await fetch(appScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await response.text();
    let result;

    try {
      result = JSON.parse(body);
    } catch {
      console.error("Apps Script returned non-JSON:", body.slice(0, 500));
      return { error: "Unexpected response from the file service." };
    }

    if (result.status !== "success") {
      return { error: result.message || "Unable to save submission." };
    }

    revalidatePath("/school-forms");
    return { success: true, record: result.record };
  } catch (err) {
    console.error("createSchoolForm failed:", err);

    return {
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the submission.",
    };
  }
}

export async function deleteSchoolForm(id, sf) {
  const profile = await checkRole();

  if (!profile) {
    return { error: "Unauthorized" };
  }
  if (!id || !sf) {
    return { error: "Submission not found." };
  }

  const appScriptUrl = process.env.APPSCRIPT_URL_SCHOOL_FORMS;

  if (!appScriptUrl) {
    return {
      error: "The file service is not configured. Please contact an admin.",
    };
  }

  try {
    const res = await fetch(appScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        data: {
          sf,
          id,
          requesterEmail: profile.email,
          requesterRole: profile.role,
        },
      }),
    });

    if (!res.ok) {
      return { error: "Failed to delete submission. Please try again later." };
    }

    const body = await res.text();
    let result;

    try {
      result = JSON.parse(body);
    } catch {
      console.error("Apps Script returned non-JSON:", body.slice(0, 500));
      return { error: "Unexpected response from the file service." };
    }

    if (result.status !== "success") {
      return { error: result.message || "Unable to delete submission." };
    }

    revalidatePath("/school-forms");
    return { success: true };
  } catch (err) {
    console.error("deleteSchoolForm failed:", err);

    return {
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting the submission.",
    };
  }
}

export async function updateSchoolForm(id, sf, formData) {
  const { profile, error: profileError } = await getProfileSafe();

  if (profileError) {
    return { error: profileError };
  }
  if (!profile) {
    return { error: "Unauthorized" };
  }
  if (!id || !sf) {
    return { error: "Submission not found." };
  }

  const note = formData.get("note");
  const grade = formData.get("grade");
  const school_year = formData.get("school_year");
  const section = formData.get("section");
  const file = formData.get("file");

  if (!note || !school_year) {
    return { error: "Please fill in all required fields." };
  }
  if (SF_NEEDS_GRADE_SECTION.includes(sf) && (!grade || !section)) {
    return { error: "Please fill in all required fields." };
  }

  let fileData = undefined;

  if (file && file.size > 0) {
    const MAX_FILE_SIZE = 52428800;
    if (file.size > MAX_FILE_SIZE) {
      return { error: "File size must not exceed 50 MB." };
    }

    const ALLOWED_EXTENSIONS = [
      ".xlsx", ".xls", ".doc", ".docx", ".png", ".jpg", ".jpeg",
    ];
    const lowerName = file.name.toLowerCase();
    if (!ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))) {
      return { error: "File must be an Excel, Word, or image file." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    fileData = {
      fileName: file.name,
      mimeType: file.type,
      data: buffer.toString("base64"),
    };
  }

  let sf2 = undefined;

  if (sf === "sf-2") {
    const built = buildSf2FromFormData(formData);
    if (built.error) return { error: built.error };
    sf2 = built.sf2;
  }

  const appScriptUrl = process.env.APPSCRIPT_URL_SCHOOL_FORMS;

  if (!appScriptUrl) {
    return {
      error: "The file service is not configured. Please contact an admin.",
    };
  }

  try {
    const payload = {
      action: "updateSchoolForm",
      data: {
        sf,
        id,
        note,
        school_year,
        requesterEmail: profile.email,
        requesterRole: profile.role,
        ...(SF_NEEDS_GRADE_SECTION.includes(sf) && { grade, section }),
        ...(sf2 && { sf2 }),
        ...(fileData && { fileData }),
      },
    };

    const response = await fetch(appScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await response.text();
    let result;

    try {
      result = JSON.parse(body);
    } catch {
      console.error("Apps Script returned non-JSON:", body.slice(0, 500));
      return { error: "Unexpected response from the file service." };
    }

    if (result.status !== "success") {
      return { error: result.message || "Unable to update submission." };
    }

    revalidatePath("/school-forms");
    return { success: true, record: result.record };
  } catch (err) {
    console.error("updateSchoolForm failed:", err);

    return {
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the submission.",
    };
  }
}
