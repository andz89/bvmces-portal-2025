import { redirect } from "next/navigation";
import { getSchoolYear, getClassesEnrollment } from "./actions";
import ClassClient from "./ClassClient";
import { checkRole } from "../../../utils/lib/checkRole.js";
import SchoolYearSelect from "./SchoolYearSelect.jsx";

export default async function Page({ searchParams }) {
  const profile = await checkRole();

  // ✅ AWAIT searchParams
  const params = await searchParams;

  const year_label =
    typeof params.year === "string" ? params.year : "2025-2026";
  // Default school year
  if (!year_label) {
    redirect("/access?year=2025-2026");
  }

  const year_data = await getSchoolYear(year_label);

  if (!year_data) {
    redirect("/access");
  }

  const classes = await getClassesEnrollment(year_data.id, profile);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 mb-10">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-2">
        <h1 className="text-xl font-semibold">Classes for School Year</h1>
        <div className="">
          <SchoolYearSelect currentYear={year_label} />
        </div>
      </div>

      <ClassClient
        key={year_label} // 🔴 THIS forces remount
        school_year_id={year_data.id}
        profile={profile}
        year_label={year_label}
        initialData={classes}
      />
    </div>
  );
}
