import { createClient } from "../../../utils/supabase/server";
import FilesClient from "./FilesClient";
import { checkRole } from "../../../utils/lib/checkRole";

export default async function Page({ searchParams }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ READ FROM URL (with default)
  const selectedType = searchParams?.type ?? "school";

  const { data: files } = await supabase
    .from("files")
    .select("*")
    .eq("type", selectedType)
    .order("id", { ascending: false });

  const profile = await checkRole();

  return (
    <FilesClient
      files={files || []}
      selectedType={selectedType}
      email={user.email}
      profile={profile}
    />
  );
}
