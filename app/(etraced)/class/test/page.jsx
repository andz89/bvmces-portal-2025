import { getSchoolYears } from "./actions";
import SchoolYearClient from "./SchoolYearClient";
import { checkRole } from "../../../../utils/lib/checkRole";
export default async function Page() {
  const schoolYears = await getSchoolYears();
  const profile = await checkRole();
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">School Year</h1>

      <SchoolYearClient profile={profile} initialData={schoolYears} />
    </div>
  );
}
