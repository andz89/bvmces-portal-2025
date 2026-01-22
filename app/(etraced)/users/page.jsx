import { createClient } from "../../../utils/supabase/server";
import UserTable from "./UserTable";

export default async function Page() {
  const supabase = await createClient();

  // Optional: enforce admin-only access here if not done globally
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // redirect("/login"); // enable if needed
  }

  const { data: users } = await supabase
    .from("users")
    .select("id, full_name, email, role, grade")
    .neq("email", "andzrivero89@gmail.com")
    .order("created_at", { ascending: false });

  return (
    <div className="h-screen p-5">
      <UserTable users={users ?? []} />
    </div>
  );
}
