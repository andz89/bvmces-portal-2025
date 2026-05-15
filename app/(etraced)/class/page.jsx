import { redirect } from "next/navigation";
import { getClasses, getSchoolYear, getAllSchoolYears } from "./actions";
import ClassClient from "./ClassClient";
import { checkRole } from "../../../utils/lib/checkRole.js";
import SchoolYearSelect from "./SchoolYearSelect.jsx";
import { BiBookAlt, BiBuildings, BiCalendar } from "react-icons/bi";
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
    <div className="min-h-screen bg-[#f4f7fb] pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            {/* Left */}
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/10
                  bg-white/10
                  backdrop-blur-md
                  px-4
                  py-1.5
                  text-white
                  text-sm
                  mb-5
                "
              >
                School Class Management
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                {profile.role === "editor"
                  ? `${classes[0]?.grade
                      ?.toUpperCase()
                      ?.replace("-", " ")} Classes`
                  : "Classes Dashboard"}
              </h1>

              <p className="text-emerald-100 text-base mt-3 max-w-2xl">
                Manage sections, organize class records, and monitor school
                structure efficiently.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-8">
                {/* School Year */}
                <div
                  className="
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/10
                    rounded-2xl
                    px-5
                    py-4
                    min-w-[180px]
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        h-11
                        w-11
                        rounded-xl
                        bg-white/10
                        flex
                        items-center
                        justify-center
                        text-white
                      "
                    >
                      <BiCalendar size={22} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-emerald-100">
                        School Year
                      </p>

                      <h3 className="text-lg font-bold text-white mt-1">
                        {activeYear}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Classes */}
                <div
                  className="
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/10
                    rounded-2xl
                    px-5
                    py-4
                    min-w-[180px]
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        h-11
                        w-11
                        rounded-xl
                        bg-white/10
                        flex
                        items-center
                        justify-center
                        text-white
                      "
                    >
                      <BiBookAlt size={22} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-emerald-100">
                        Total Classes
                      </p>

                      <h3 className="text-2xl font-black text-white mt-1">
                        {classes.length}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Sections */}
                <div
                  className="
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/10
                    rounded-2xl
                    px-5
                    py-4
                    min-w-[180px]
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        h-11
                        w-11
                        rounded-xl
                        bg-white/10
                        flex
                        items-center
                        justify-center
                        text-white
                      "
                    >
                      <BiBuildings size={22} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-emerald-100">
                        Sections
                      </p>

                      <h3 className="text-2xl font-black text-white mt-1">
                        {[...new Set(classes.map((c) => c.section))].length}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div
              className="
                bg-white/10
                backdrop-blur-xl
                border
                border-white/10
                rounded-3xl
                p-6
                shadow-2xl
                w-full
                max-w-sm
              "
            >
              <h2 className="text-white text-xl font-bold">School Year</h2>

              <p className="text-emerald-100 text-sm mt-1">
                Select and manage active school year records.
              </p>

              <div className="mt-5">
                <SchoolYearSelect
                  currentYear={activeYear}
                  profile={profile}
                  schoolYears={sortedYears}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-[28px]
            shadow-[0_10px_35px_rgba(0,0,0,0.05)]
            overflow-hidden
          "
        >
          {/* Header */}
          <div
            className="
              px-6
              py-5
              border-b
              border-gray-100
              bg-gradient-to-r
              from-emerald-50
              via-green-50
              to-white
            "
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Class List</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Organized list of all active classes and sections.
                </p>
              </div>

              {/* Right */}
              <div
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  px-5
                  py-3
                  shadow-sm
                  min-w-[180px]
                "
              >
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Active Classes
                </p>

                <p className="text-2xl font-black text-gray-800 mt-1">
                  {classes.length}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
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
