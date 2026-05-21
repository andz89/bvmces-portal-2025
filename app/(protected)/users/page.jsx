import { createClient } from "../../../utils/supabase/server";
import UserTable from "./UserTable";
import { checkRole } from "@/utils/lib/checkRole";

export default async function Page() {
  const supabase = await createClient();
  const profile = await checkRole();
  // Optional: enforce admin-only access here if not done globally
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // redirect("/login"); // enable if needed
  }

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .eq("archive", false)
    .neq("email", "andzrivero89@gmail.com")
    .order("created_at", { ascending: false });

  return (
    <div>
      <UserTable profile={profile} users={users ?? []} />
    </div>
  );
}
