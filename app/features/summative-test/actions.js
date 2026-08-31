"use server";

import { revalidatePath } from "next/cache";
import { checkRole } from "../../../utils/lib/checkRole";
import { v4 as uuidv4 } from "uuid";

const WORD_EXTENSIONS = [".doc", ".docx"];

function isWordFile(fileName) {
  const lower = (fileName || "").toLowerCase();
  return WORD_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export async function getSummativeTests() {
  const appScriptUrl = process.env.APPSCRIPT_URL_SUMMATIVE_TEST;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL_SUMMATIVE_TEST is not configured.");
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

// Verifies the caller owns the given submission by re-fetching the live
// list from Apps Script (the source of truth) rather than trusting the
// client's claim.
async function ownsSummativeTest(id, ownerId) {
  const all = await getSummativeTests();
  const record = all.find((r) => String(r.id) === String(id));
  if (!record) return false;
  return String(record.owner_id) === String(ownerId);
}

export async function createSummativeTest(formData) {
  const profile = await checkRole();

  if (!profile) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const grade = formData.get("grade");
  const subject = formData.get("subject");
  const term = formData.get("term");
  const school_year = formData.get("school_year");

  if (!title || !grade || !subject || !term || !school_year) {
    return { error: "Please fill in all required fields." };
  }

  const file = formData.get("file");
  const file2 = formData.get("file2");

  if (!file || file.size === 0) {
    return { error: "Please upload the Summative Test file." };
  }
  if (!file2 || file2.size === 0) {
    return { error: "Please upload the TOS file." };
  }
  if (!isWordFile(file.name)) {
    return { error: "Summative Test file must be a Word document (.doc, .docx)." };
  }
  if (!isWordFile(file2.name)) {
    return { error: "TOS file must be a Word document (.doc, .docx)." };
  }

  try {
    const appScriptUrl = process.env.APPSCRIPT_URL_SUMMATIVE_TEST;

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

    const buffer2 = Buffer.from(await file2.arrayBuffer());
    const fileData2 = {
      fileName: file2.name,
      mimeType: file2.type,
      data: buffer2.toString("base64"),
    };

    const payload = {
      action: "addSummativeTest",
      data: {
        id: uuidv4(),
        title,
        description,
        grade,
        subject,
        term,
        school_year,
        owner_email: profile.email,
        owner_id: profile.id,
        fileData,
        fileData2,
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

    revalidatePath("/summative-test");
    return { success: true };
  } catch (err) {
    console.error("createSummativeTest failed:", err);

    return {
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the submission.",
    };
  }
}

export async function updateSummativeTest(id, formData) {
  const profile = await checkRole();

  if (!profile) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const grade = formData.get("grade");
  const subject = formData.get("subject");
  const term = formData.get("term");
  const school_year = formData.get("school_year");

  if (!title || !grade || !subject || !term || !school_year) {
    return { error: "Please fill in all required fields." };
  }

  const isOwner = await ownsSummativeTest(id, profile.id);

  if (!isOwner) {
    return { error: "You can only edit your own submissions." };
  }

  try {
    const appScriptUrl = process.env.APPSCRIPT_URL_SUMMATIVE_TEST;

    if (!appScriptUrl) {
      return {
        error: "The file service is not configured. Please contact an admin.",
      };
    }

    const response = await fetch(appScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateSummativeTest",
        data: { id, title, description, grade, subject, term, school_year },
      }),
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

    revalidatePath("/summative-test");
    return { success: true };
  } catch (err) {
    console.error("updateSummativeTest failed:", err);

    return {
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the submission.",
    };
  }
}

export async function deleteSummativeTest(id) {
  const profile = await checkRole();

  if (!profile) {
    return { error: "Unauthorized" };
  }

  const isOwner = await ownsSummativeTest(id, profile.id);

  if (!isOwner) {
    return { error: "You can only delete your own submissions." };
  }

  const appScriptUrl = process.env.APPSCRIPT_URL_SUMMATIVE_TEST;

  if (!appScriptUrl) {
    return {
      error: "The file service is not configured. Please contact an admin.",
    };
  }

  try {
    const res = await fetch(appScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", data: { id } }),
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

    revalidatePath("/summative-test");
    return { success: true };
  } catch (err) {
    console.error("deleteSummativeTest failed:", err);

    return {
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting the submission.",
    };
  }
}
