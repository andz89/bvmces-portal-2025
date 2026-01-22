import { redirect } from "next/navigation";
import { getClasses, getSchoolYear } from "./actions";
import ClassClient from "./ClassClient";
import { checkRole } from "../../../utils/lib/checkRole.js";
import SchoolYearSelect from "./SchoolYearSelect.jsx";
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }) {
  const profile = await checkRole();

  const year_label = searchParams?.year;

  // Default school year
  if (!year_label) {
    redirect("/class?year=2025-2026");
  }

  const year_data = await getSchoolYear(year_label);

  if (!year_data) {
    redirect("/class");
  }

  const classes = await getClasses(year_data.id, profile);

  return (
    <div className="p-6 space-y-6 h-screen">
      <div className="flex  items-center gap-2">
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
