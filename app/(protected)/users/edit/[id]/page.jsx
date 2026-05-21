import { createClient } from "../../../../../utils/supabase/server";
// import UserEditForm from "../../UserEditForm";

export default async function EditUserPage({ params }) {
  const p = await params;
  const supabase = await createClient();

  const { data: user } = await supabase
    .from("users")
    .select("id, full_name, email, role, grade")
    .eq("id", p.id)
    .single();

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div className="h-screen mt-20">
      <UserEditForm user={user} />
    </div>
  );
}
