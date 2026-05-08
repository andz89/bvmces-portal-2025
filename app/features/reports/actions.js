"use server";

import { createClient } from "../../../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { reportSchema } from "./reportSchema";

export async function createReport(prevState, formData) {
  const type = formData.get("type");

  const rawData = {
    description: formData.get("description"),
    filename: formData.get("filename"),
    link: formData.get("link"),
    type,
    stage: formData.get("stage") || "null",
    school_year: formData.get("school_year") || "null",
  };

  // only include these fields if NOT template
  if (type !== "Templates") {
    rawData.stage = formData.get("stage");
    rawData.school_year = formData.get("school_year");
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
  // ✅ extract values
  const data = {
    description: formData.get("description"),
    filename: formData.get("filename"),
    link: formData.get("link"),
    type: formData.get("type"),
    stage: formData.get("stage") || "null",
    school_year: formData.get("school_year") || "null",
    owner_email: user.email,
    owner_id: user.id,
  };

  const { error } = await supabase.from("files").insert([data]);

  if (error) {
    return { error: error.message };
  }
  // ✅ revalidate page
  revalidatePath(pathname);
  return { success: true };
}

export async function getReports(type) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  let query = supabase
    .from("files")
    .select("*")
    .order("created_at", { ascending: false });

  // optional filter
  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  return { data };
}
export async function deleteReport(prevState, formData) {
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
    description: formData.get("description"),
    filename: formData.get("filename"),
    link: formData.get("link"),
    type,
  };

  // only include these fields if NOT template
  if (type !== "Templates") {
    rawData.stage = formData.get("stage");
    rawData.school_year = formData.get("school_year");
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

  revalidatePath(pathname);

  return { success: true };
}
