import React from "react";
import MPSClient from "./MPSClient";
import { checkRole } from "../../../../utils/lib/checkRole";
import { getMPSReports, getClass } from "./actions";
const page = async ({ params }) => {
  const profile = await checkRole();

  const { school_year: school_year } = await params;
  const mps = await getMPSReports(school_year);
  const classData = await getClass(school_year);

  return (
    <div>
      <MPSClient
        profile={profile}
        mps={mps.data}
        school_year={school_year}
        classData={classData}
      />
    </div>
  );
};

export default page;
