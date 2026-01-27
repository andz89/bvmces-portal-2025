import { createClient } from "../supabase/server";

export async function checkRole() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("users") // 👈 FIX HERE
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  return data ?? null;
}
