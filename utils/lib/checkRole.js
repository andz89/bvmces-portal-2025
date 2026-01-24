import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export async function checkRole() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    return profile;
  } else {
    redirect("/login");
  }
}
