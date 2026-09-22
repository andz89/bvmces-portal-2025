import React from "react";
import { redirect } from "next/navigation";
import MPSTermClient from "./MPSTermClient";
import { checkRole } from "../../../../utils/lib/checkRole";
import RefreshError from "../../lesson-plan/RefreshError";
import { getMPSTermReports, getClass } from "../../../features/mps-term/actions";

const page = async ({ params }) => {
  const profile = await checkRole();

  if (!profile) {
    redirect("/login");
  }

  const { school_year } = await params;

  const [mps, classData] = await Promise.all([
    getMPSTermReports(school_year),
    getClass(school_year),
  ]);

  if (mps.error) {
    return <RefreshError message={mps.error} />;
  }

  return (
    <div className="w-full">
      <MPSTermClient
        profile={profile}
        mps={mps.data}
        editableGrades={mps.editableGrades}
        school_year={school_year}
        classData={classData}
      />
    </div>
  );
};

export default page;
