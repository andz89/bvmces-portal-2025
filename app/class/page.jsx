import { redirect } from "next/navigation";
import { getClasses, getSchoolYear, getAllSchoolYears } from "./actions.js";
import ClassClient from "./ClassClient.jsx";
import { checkRole } from "../../utils/lib/checkRole.js";
import SchoolYearSelect from "./SchoolYearSelect.jsx";
import { BiBookAlt, BiBuildings, BiCalendar } from "react-icons/bi";
export default async function Page({ searchParams }) {
  // Parallel fetching
  const [profile, schoolYears] = await Promise.all([
    checkRole(),
    getAllSchoolYears(),
  ]);
  if (profile?.role === "null") {
    redirect("/login");
  }
  // Sort school years
  const sortedYears = [...schoolYears].sort((a, b) => {
    const startA = parseInt(a.year_label.slice(0, 4), 10);

    const startB = parseInt(b.year_label.slice(0, 4), 10);

    return startB - startA;
  });

  const params = await searchParams;

  // No redirect → directly use latest year
  const activeYear = params?.year || sortedYears[0]?.year_label;

  // No school years available
  if (!activeYear) {
    notFound();
  }

  // Get selected school year
  const year_data = await getSchoolYear(activeYear);

  // Invalid year
  if (!year_data) {
    notFound();
  }

  // Fetch classes
  const classes = await getClasses(year_data.id, profile);

  return (
    <div className="min-h-screen bg-lis-bg pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden bg-lis-primary   ">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full "></div>

        <div className="absolute bottom-0 left-0 w-72 h-72 bg-lis-panel-header/10 rounded-full "></div>

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
                  
                  px-4
                  py-1.5
                  text-white
                  text-sm
                  mb-5
                "
              >
                School Class Management
              </div>

              <p className="text-white/80 text-base mt-3 max-w-2xl">
                Manage sections, organize class records, and monitor school
                structure efficiently.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-8">
                {/* School Year */}
                <div
                  className="
                    bg-white/10
                    
                    border
                    border-white/10
                    rounded-sm
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
                        rounded-sm
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
                      <p className="text-xs uppercase tracking-wide text-white/80">
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
                    
                    border
                    border-white/10
                    rounded-sm
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
                        rounded-sm
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
                      <p className="text-xs uppercase tracking-wide text-white/80">
                        Total Classes
                      </p>

                      <h3 className="text-2xl font-bold text-white mt-1">
                        {classes.length}
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
                
                border
                border-white/10
                rounded-sm
                p-6
                
                w-full
                max-w-sm
              "
            >
              <h2 className="text-white text-xl font-bold">School Year</h2>

              <p className="text-white/80 text-sm mt-1">
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
            border-lis-panel-border
            rounded-sm
            
            overflow-hidden
          "
        >
          {/* Header */}
          <div
            className="
              px-6
              py-5
              border-b
              border-lis-panel-border
              bg-lis-panel-header
            "
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left */}
              <div>
                <h2 className="text-xl font-normal text-lis-heading">Class List</h2>

                <p className="text-sm text-lis-muted mt-1">
                  Organized list of all active classes and sections.
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
