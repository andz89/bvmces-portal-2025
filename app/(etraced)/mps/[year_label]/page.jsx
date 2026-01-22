import { createClient } from "../../../../utils/supabase/server";
import { notFound } from "next/navigation";
import { checkRole } from "../../../../utils/lib/checkRole";
import MPSClientTable from "./MPSClientTable";

export default async function Page({ params, searchParams }) {
  const supabase = await createClient();
  const { year_label: year_label } = await params;
  // school_year_id comes from URL: ?id=xxxx
  const { id: id } = await searchParams;

  if (!id) notFound();

  // 1️⃣ Get all MPS records whose CLASS belongs to this school year
  const { data: mpsData, error } = await supabase
    .from("mps")
    .select(
      `
    id,
    class_id,
    quarter,
    gmrc,
    epp,
    filipino,
    english,
    math,
    science,
    ap,
    mapeh,
    reading_literacy,
    link,
    created_at,
    class:class_id!inner (
      id,
      grade,
      section,
      school_year_id
    )
  `
    )
    .eq("class.school_year_id", id)
    .order("created_at", { ascending: false });

  console.log(mpsData);
  if (error) {
    console.error(error);
    notFound();
  }

  // 2️⃣ Role check (admin / teacher / etc.)
  const profile = await checkRole();

  // 3️⃣ Render
  return (
    <div className="p-6 space-y-6">
      <h3 className="text-md font-bold">MPS {year_label}</h3>
      <MPSClientTable profile={profile} mpsData={mpsData ?? []} />
    </div>
  );
}
