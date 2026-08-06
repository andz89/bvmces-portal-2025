"use server";

import { createClient } from "../../../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { reportSchema } from "./reportSchema";
import { v4 as uuidv4 } from "uuid";

export async function getGoogleConfig(type) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("google_config")
    .select("folder_id, spreadSheet_id, sheet_name")
    .eq("type", type)
    .limit(1)
    .single();
  if (error) {
    console.error(error);
    return { error: error.message };
  }
  return { data, error };
}
export async function createReport(formData) {
  const type = formData.get("type");
  const { data: googleConfig, error: configError } =
    await getGoogleConfig(type);

  if (configError) {
    return { error: configError };
  }

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
      filename: formData.get("filename"),
      description: formData.get("description"),

      type: formData.get("type"),
      stage: formData.get("stage") || "null",
      school_year: formData.get("school_year") || "null",
      owner_email: user.email,
      owner_id: user.id,
      ...(fileData && { fileData }),
      folder_id: googleConfig.folder_id,
      sheet_name: googleConfig.sheet_name,
      spreadSheet_id: googleConfig.spreadSheet_id,
    },
  };
  const appScriptUrl = process.env.APPSCRIPT_URL_FILE;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL_FILE is not configured.");
  }

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
}
export async function getReports(googleConfig) {
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
      data: {
        folder_id: googleConfig.folder_id,
        sheet_name: googleConfig.sheet_name,
        spreadSheet_id: googleConfig.spreadSheet_id,
      },
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

export async function deleteReport(file_id, password, googleConfig) {
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
    throw new Error("APPSCRIPT_URL_FILE is not configured.");
  }
  const res = await fetch(appScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "delete",
      data: {
        file_id: file_id,
        folder_id: googleConfig.folder_id,
        sheet_name: googleConfig.sheet_name,
        spreadSheet_id: googleConfig.spreadSheet_id,
      },
    }),
  });
  console.log("Delete report response status:", res);
  if (!res.ok) {
    console.error("Failed to delete report. Status:", res.status);
    return {
      result: false,
      error: "Failed to delete report. Please try again later.",
    };
  }

  return { result: true };
}
export async function deleteReport1(formData) {
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
  const { error } = await supabase
    .from("files")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(pathname);

  return { success: true };
}

export async function updateReport(id, prevState, formData) {
  const type = formData.get("type");

  const rawData = {
    // id,
    description: formData.get("description"),
    filename: formData.get("filename"),
    link: formData.get("link"),
    type,
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

  const updatedData = {
    description: formData.get("description"),
    filename: formData.get("filename"),
    link: formData.get("link"),
    type: formData.get("type"),
    stage: formData.get("stage") || "null",
    school_year: formData.get("school_year") || "null",
  };

  const { error } = await supabase
    .from("files")
    .update(updatedData)
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function findReport(keyword, type) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("type", type)
      .ilike("filename", `%${keyword}%`);

    if (error) {
      console.error(error);

      return {
        error: error.message,
      };
    }
    console.log(data);
    return {
      data,
    };
  } catch (error) {
    console.error(error);

    return {
      error: "Server timeout. Please try again.",
    };
  }
}
