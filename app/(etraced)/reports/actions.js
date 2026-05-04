"use server";

import { createClient } from "../../../utils/supabase/server";

export async function createReport(prevState, formData) {
  const supabase = await createClient();

  // ✅ get logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Unauthorized" };
  }

  // ✅ extract values
  const data = {
    description: formData.get("description"),
    filename: formData.get("filename"),
    link: formData.get("link"),
    type: formData.get("type"),
    stage: formData.get("stage"),
    school_year: formData.get("school_year"),
    owner_email: user.email,
    owner_id: user.id,
  };

  // ✅ basic validation
  if (!data.filename || !data.type || !data.stage) {
    return { error: "Please fill all required fields" };
  }

  const { error } = await supabase.from("reports").insert([data]);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
