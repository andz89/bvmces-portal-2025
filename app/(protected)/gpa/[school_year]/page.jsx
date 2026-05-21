import { React } from "react";

import { checkRole } from "../../../../utils/lib/checkRole";
import GPAClient from "./GPAClient";
import { getGPA, getClass } from "./actions";
const page = async ({ params }) => {
  const profile = await checkRole();

  const { school_year: school_year } = await params;
  const gpa = await getGPA(school_year);
  const classData = await getClass(school_year);
  return (
    <div className=" ">
      <GPAClient
        profile={profile}
        school_year={school_year}
        gpa={gpa}
        classData={classData}
      />
    </div>
  );
};

export default page;
