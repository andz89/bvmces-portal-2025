import React from "react";
import { redirect } from "next/navigation";
import GPATermClient from "./GPATermClient";
import { checkRole } from "../../../../utils/lib/checkRole";
import RefreshError from "../../lesson-plan/RefreshError";
import { getGPATerm, getClass } from "../../../features/gpa-term/actions";

const page = async ({ params }) => {
  const profile = await checkRole();

  if (!profile) {
    redirect("/login");
  }

  const { school_year } = await params;

  const [gpa, classData] = await Promise.all([
    getGPATerm(school_year),
    getClass(school_year),
  ]);

  if (gpa.error) {
    return <RefreshError message={gpa.error} />;
  }

  return (
    <div className="w-full">
      <GPATermClient
        profile={profile}
        gpa={gpa.data}
        editableGrades={gpa.editableGrades}
        school_year={school_year}
        classData={classData}
      />
    </div>
  );
};

export default page;
