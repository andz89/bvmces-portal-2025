import SchoolFormsClient from "../../features/school-forms/SchoolFormsClient";
import { getSchoolForms } from "../../features/school-forms/actions";
import { checkRole } from "../../../utils/lib/checkRole";
import RefreshError from "../lesson-plan/RefreshError";
import { redirect } from "next/navigation";

const page = async () => {
  const profile = await checkRole();

  if (!profile) {
    redirect("/login");
  }

  let records = [];

  try {
    records = await getSchoolForms();
  } catch (err) {
    console.error(err);

    return (
      <RefreshError
        message={
          err instanceof Error
            ? err.message
            : "Unable to load submissions. Please refresh the page."
        }
      />
    );
  }

  return <SchoolFormsClient profile={profile} records={records} />;
};

export default page;
