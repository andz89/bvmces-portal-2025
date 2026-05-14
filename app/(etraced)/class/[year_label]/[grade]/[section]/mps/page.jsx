"use server";
import React from "react";
import MPSClient from "./MPSClient";
import { checkRole } from "@/utils/lib/checkRole";
import { getMPSReports, getClass } from "./actions";
export default async function Page({ params, searchParams }) {
  const { section } = await params;
  const { id } = await searchParams;
  const { grade } = await params;
  const { year_label: year_label } = await params;

  const profile = await checkRole();

  const mps = await getMPSReports(year_label, id);

  return (
    <div>
      <MPSClient
        profile={profile}
        mps={mps.data}
        school_year={year_label}
        section={section}
        class_id={id}
        grade={grade}
      />
    </div>
  );
}
