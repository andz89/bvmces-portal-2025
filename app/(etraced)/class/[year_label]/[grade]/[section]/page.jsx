import Link from "next/link";
import { createClient } from "../../../../../../utils/supabase/server";
import GPAClientTable from "./gpa/GPAClientTable";

import { checkRole } from "../../../../../../utils/lib/checkRole";
import MPSClientTable from "./mps/MPSClientTable";
import EnrollmentClientTable from "./enrollment/EnrollmentClientTable";
export default async function Page({ params, searchParams }) {
  const { section } = await params;
  const { id } = await searchParams;
  const { year_label } = await params;
  const { grade } = await params;

  const supabase = await createClient();
  const profile = await checkRole();
  const { data: mpsData } = await supabase
    .from("mps")
    .select(
      `
      id,
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
        class:class_id (
      id,
      grade,
      section,
      school_year_id
    )
    `
    )
    .eq("class_id", id)

    .order("created_at", { ascending: false });

  const { data: enrollmentData, error } = await supabase
    .from("enrollment")
    .select(
      `
    id,
    boys,
    girls,
    month,
    class:class_id (
      id,
      grade,
      section,
      school_year_id
    )
  `
    )
    .eq("class_id", id);
  const { data: gpa, error: errorGPA } = await supabase
    .from("gpa")
    .select(
      `
    id,
    subject,
    quarter,
    not_meet_male,
    not_meet_female,
    fs_male,
    fs_female,
    s_male,
    s_female,
    vs_male,
    vs_female,
    e_male,
    e_female
  `
    )
    .eq("class_id", id)
    .order("subject");

  return (
    <div className="py-6 px-2 space-y-6  ">
      <h2 className="text-xl font-semibold">
        {grade.toUpperCase().replace("-", " ")} - {section.toUpperCase()} S.Y.{" "}
        {year_label}
      </h2>
      <EnrollmentClientTable
        section={section}
        grade={grade}
        year_label={year_label}
        profile={profile}
        class_id={id}
        enrollmentData={enrollmentData ?? []}
      />
      <MPSClientTable
        section={section}
        grade={grade}
        year_label={year_label}
        profile={profile}
        classID={id}
        mpsData={mpsData ?? []}
      />

      <GPAClientTable
        year_label={year_label}
        profile={profile}
        section={section}
        grade={grade}
        classID={id}
        data={gpa ?? []}
      />
    </div>
  );
}
