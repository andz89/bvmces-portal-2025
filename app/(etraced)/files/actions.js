"use server";

import { createClient } from "../../../utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function addFile(formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const type = formData.get("type").toLowerCase();

  const { error } = await supabase.from("files").insert({
    title: formData.get("title"),
    description: formData.get("description"),
    link: formData.get("link"),
    type,
    created_by: user.email,
  });

  if (error) throw new Error(error.message);

  // ✅ Optimized: refresh server data only
  revalidatePath("/files");
}

export async function updateFile(formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id");

  const { error } = await supabase
    .from("files")
    .update({
      title: formData.get("title"),
      description: formData.get("description"),
      link: formData.get("link"),
      type: formData.get("type"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/files");
}
export async function deleteFile(formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id");

  const { error } = await supabase.from("files").delete().eq("id", id);
  // .eq("created_by", user.id);
  console.log(error);
  if (error) throw new Error(error.message);

  revalidatePath("/files");
}
