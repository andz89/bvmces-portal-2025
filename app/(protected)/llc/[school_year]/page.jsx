import React from "react";
import { redirect } from "next/navigation";
import LLCClient from "./LLCClient";
import { checkRole } from "../../../../utils/lib/checkRole";
import RefreshError from "../../lesson-plan/RefreshError";
import { getLLC } from "../../../features/llc/actions";

const page = async ({ params }) => {
  const profile = await checkRole();

  if (!profile) {
    redirect("/login");
  }

  const { school_year } = await params;

  const llc = await getLLC(school_year);

  if (llc.error) {
    return <RefreshError message={llc.error} />;
  }

  return (
    <div className="w-full">
      <LLCClient
        profile={profile}
        llc={llc.data}
        editableGrades={llc.editableGrades}
        school_year={school_year}
      />
    </div>
  );
};

export default page;
