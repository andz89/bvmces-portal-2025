import React from "react";
import MPSClient from "./MPSClient";
import { checkRole } from "../../../../utils/lib/checkRole";
import { getMPSReports } from "./actions";
const page = async ({ params }) => {
  const profile = await checkRole();

  const { school_year: school_year } = await params;
  console.log(school_year);
  const mps = await getMPSReports(school_year);

  return (
    <div>
      <MPSClient profile={profile} mps={mps.data} school_year={school_year} />
    </div>
  );
};

export default page;
