"use server";
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EnrollmentClientTable from "./EnrollmentClientTable";
import { checkRole } from "@/utils/lib/checkRole";
import { getEnrollment } from "./actions";
export default async function Page({ params, searchParams }) {
  const { section } = await params;
  const { id } = await searchParams;
  const { year_label } = await params;
  const { grade } = await params;
  const profile = await checkRole();

  // if (
  //   profile?.role !== "admin" &&
  //   profile?.role !== "" &&
  //   !profile?.gradeToEdit?.includes(grade)
  // ) {
  //   redirect("/unauthorized");
  // }
  const res = await getEnrollment(id);
  if (res?.error) {
    return <div>Error: {res.error}</div>;
  }
  const enrollmentData = res.data;
  return (
    <div>
      <EnrollmentClientTable
        class_id={id}
        section={section.trim().replace("%20", " ")}
        year_label={year_label}
        grade={grade}
        profile={profile}
        enrollmentData={enrollmentData}
      />
    </div>
  );
}
