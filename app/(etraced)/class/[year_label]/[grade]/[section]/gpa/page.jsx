"use server";

import GPAClient from "./GPAClient";
import { checkRole } from "@/utils/lib/checkRole";

import { getGPA } from "./actions";
export default async function Page({ params, searchParams }) {
  const profile = await checkRole();
  const { section } = await params;
  const { id } = await searchParams;
  const { year_label: year_label } = await params;
  const { grade } = await params;
  const gpa = await getGPA(year_label, id);
  return (
    <div>
      {" "}
      <GPAClient
        profile={profile}
        school_year={year_label}
        gpa={gpa}
        section={section}
        class_id={id}
        grade={grade}
      />
    </div>
  );
}
import { React } from "react";
