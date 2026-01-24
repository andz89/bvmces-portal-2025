import { redirect } from "next/navigation";
import { getClasses, getSchoolYear, getAllSchoolYears } from "./actions";
import ClassClient from "./ClassClient";
import { checkRole } from "../../../utils/lib/checkRole.js";
import SchoolYearSelect from "./SchoolYearSelect.jsx";

export default async function Page({ searchParams }) {
  const profile = await checkRole();

  const params = await searchParams;

  const schoolYears = await getAllSchoolYears();
  const sortedYears = [...schoolYears].sort((a, b) => {
    const startA = parseInt(a.year_label.slice(0, 4), 10);
    const startB = parseInt(b.year_label.slice(0, 4), 10);
    return startB - startA; // highest first
  });

  const activeYear = params?.year ?? sortedYears?.[0]?.year_label;

  const year_data = await getSchoolYear(activeYear);

  if (!year_data) {
    redirect(`/class?year=${sortedYears[0].year_label}`);
  }
  const classes = await getClasses(year_data.id, profile);

  return (
    <div className="p-6 space-y-6 h-screen">
      <div className="flex items-center gap-5  ">
        <h1 className="text-xl font-semibold">
          {profile.role !== "admin"
            ? `${classes[0].grade.toUpperCase().replace("-", " ")}   CLASSES`
            : "Classes for School Year"}
        </h1>

        <SchoolYearSelect
          currentYear={activeYear}
          profile={profile}
          schoolYears={sortedYears}
        />
      </div>

      <ClassClient
        key={activeYear}
        school_year_id={year_data.id}
        profile={profile}
        year_label={activeYear}
        initialData={classes}
      />
    </div>
  );
}
