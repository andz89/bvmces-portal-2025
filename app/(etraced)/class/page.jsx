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

    return startB - startA;
  });

  // ✅ Redirect to latest school year
  if (!params?.year && sortedYears.length > 0) {
    redirect(`/class?year=${sortedYears[0].year_label}`);
  }

  const activeYear = params?.year;

  const year_data = await getSchoolYear(activeYear);

  if (!year_data) {
    if (sortedYears.length > 0) {
      redirect(`/class?year=${sortedYears[0].year_label}`);
    }

    redirect("/class");
  }

  const classes = await getClasses(year_data.id, profile);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Top Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/* Left */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {profile.role === "editor"
                ? `${classes[0]?.grade
                    ?.toUpperCase()
                    ?.replace("-", " ")} Classes`
                : "Classes Dashboard"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage and organize school classes
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="min-w-[220px]">
              <SchoolYearSelect
                currentYear={activeYear}
                profile={profile}
                schoolYears={sortedYears}
              />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mt-10">
          {/* Card Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-5 py-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Class List</h3>{" "}
            {/* Total Classes */}
            <div className="bg-gray-50 border border-gray-200 rounded px-2 py-1 flex  justify-center items-center gap-2 ">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                Total Classes
              </p>

              <p className="text-lg font-bold text-gray-900 ">
                {classes.length}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            <ClassClient
              key={activeYear}
              school_year_id={year_data.id}
              profile={profile}
              year_label={activeYear}
              initialData={classes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
