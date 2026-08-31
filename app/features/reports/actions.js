"use server";

import { createClient } from "../../../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { reportSchema } from "./reportSchema";
import { v4 as uuidv4 } from "uuid";

export async function createReport(formData) {
  const type = formData.get("type");

  const rawData = {
    description: formData.get("description"),
    filename: formData.get("filename"),
    type,
    stage: formData.get("stage") || "null",
    school_year: formData.get("school_year") || "null",
  };

  // only include these fields if NOT template
  if (type === "templates") {
    rawData.stage = "-----";
    rawData.school_year = "-----";
  }

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
  const pathname = formData.get("pathname");
  const file = formData.get("file");

  try {
    const appScriptUrl = process.env.APPSCRIPT_URL_FILE;

    if (!appScriptUrl) {
      return {
        error: "The file service is not configured. Please contact an admin.",
      };
    }

    let fileData = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());

      fileData = {
        fileName: file.name,
        mimeType: file.type,
        data: buffer.toString("base64"),
      };
    }

    const payload = {
      action: "addTemplate",
      data: {
        id: uuidv4(),
        filename: rawData.filename,
        description: rawData.description,
        type: rawData.type,
        stage: rawData.stage,
        school_year: rawData.school_year,
        owner_email: user.email,
        owner_id: user.id,
        ...(fileData && { fileData }),
      },
    };

    const response = await fetch(appScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = await response.text();

    let result;

    try {
      result = JSON.parse(body);
    } catch {
      console.error("Apps Script returned non-JSON:");
      console.error("Status:", response.status);
      console.error("Body:", body);

      return {
        error: "Unexpected response from the file service.",
      };
    }

    if (result.status !== "success") {
      return {
        error: result.message || "Unable to save template.",
      };
    }

    revalidatePath(pathname);

    return {
      success: true,
    };
  } catch (err) {
    console.error("createReport failed:", err);

    return {
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the report.",
    };
  }
}

export async function getReports(type) {
  const appScriptUrl = process.env.APPSCRIPT_URL_FILE;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL_FILE is not configured.");
  }
  const res = await fetch(appScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      action: "getFiles",
      data: { type },
    }),
  });

  if (!res.ok) {
    throw new Error(
      "Something went wrong. Please try again later or check the uploaded files in the list.",
    );
  }

  const result = await res.json();

  if (result.status === "error") {
    throw new Error(result.message);
  }
  return result;
}

export async function deleteReport(file_id, password, type) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (password !== "132289") {
    return { error: "Wrong password" };
  }

  const appScriptUrl = process.env.APPSCRIPT_URL_FILE;

  if (!appScriptUrl) {
    return {
      result: false,
      error: "The file service is not configured. Please contact an admin.",
    };
  }

  try {
    const res = await fetch(appScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "delete",
        data: { file_id, type },
      }),
    });

    if (!res.ok) {
      console.error("Failed to delete report. Status:", res.status);
      return {
        result: false,
        error: "Failed to delete report. Please try again later.",
      };
    }

    const body = await res.text();
    let result;

    try {
      result = JSON.parse(body);
    } catch {
      console.error("Apps Script returned non-JSON:", body.slice(0, 500));
      return {
        result: false,
        error: "Unexpected response from the file service.",
      };
    }

    if (result.status !== "success") {
      return {
        result: false,
        error: result.message || "Unable to delete report.",
      };
    }

    return { result: true };
  } catch (err) {
    console.error("deleteReport failed:", err);

    return {
      result: false,
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting the report.",
    };
  }
}

export async function updateReport(id, formData) {
  const type = formData.get("type");

  const rawData = {
    description: formData.get("description"),
    filename: formData.get("filename"),
    type,
    stage: formData.get("stage") || "null",
    school_year: formData.get("school_year") || "null",
  };

  // only include these fields if NOT template
  if (type === "templates") {
    rawData.stage = "-----";
    rawData.school_year = "-----";
  }
  const validated = reportSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      error: validated.error.issues[0].message,
      values: rawData,
    };
  }

  const supabase = await createClient();
  const pathname = formData.get("pathname");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const appScriptUrl = process.env.APPSCRIPT_URL_FILE;

    if (!appScriptUrl) {
      return {
        error: "The file service is not configured. Please contact an admin.",
      };
    }

    const response = await fetch(appScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateFile",
        data: {
          id,
          filename: rawData.filename,
          description: rawData.description,
          type: rawData.type,
          stage: rawData.stage,
          school_year: rawData.school_year,
        },
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
      return { error: result.message || "Unable to update report." };
    }

    revalidatePath(pathname);

    return { success: true };
  } catch (err) {
    console.error("updateReport failed:", err);

    return {
      error:
        err instanceof Error
          ? err.message
          : "Something went wrong while updating the report.",
    };
  }
}
