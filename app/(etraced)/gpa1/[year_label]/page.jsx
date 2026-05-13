import { createClient } from "@/../utils/supabase/server";
import GPAClientTable from "./GPAClientTable";
import { notFound } from "next/navigation";

export default async function Page({ params, searchParams }) {
  const supabase = await createClient();

  const { year_label } = await params;
  const { id } = await searchParams; // school_year_id (UUID)

  if (!id) notFound();

  const { data: gpaData, error } = await supabase
    .from("gpa")
    .select(
      `
      *,
      class:class_id!inner (
        id,
        grade,
        section,
        school_year_id
      )
    `
    )
    .eq("class.school_year_id", id);

  if (error) {
    console.error(error);
    throw error;
  }

  return (
    <GPAClientTable
      key={id} // 🔴 important if switching years
      data={gpaData ?? []}
      classPath={`/class/?year=${year_label}`}
    />
  );
}
