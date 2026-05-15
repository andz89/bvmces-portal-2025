"use server";
import React from "react";
import { createClient } from "@/utils/supabase/server";

import EnrollmentClientTable from "./EnrollmentClientTable";
import { checkRole } from "@/utils/lib/checkRole";
export default async function Page({ params, searchParams }) {
  const { section } = await params;
  const { id } = await searchParams;
  const { year_label } = await params;
  const { grade } = await params;
  const profile = await checkRole();

  const supabase = await createClient();

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
  `,
    )
    .eq("class_id", id);

  return (
    <div>
      <EnrollmentClientTable
        class_id={id}
        section={section}
        year_label={year_label}
        grade={grade}
        profile={profile}
        enrollmentData={enrollmentData}
      />
    </div>
  );
}
