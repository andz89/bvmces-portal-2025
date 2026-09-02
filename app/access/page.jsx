import { redirect } from "next/navigation";
import {
  getSchoolYear,
  getClassesEnrollment,
  getAllSchoolYears,
} from "./actions";
import ClassClient from "./ClassClient";
import { checkRole } from "@/utils/lib/checkRole.js";
import SchoolYearSelect from "./SchoolYearSelect.jsx";

import { FiBookOpen, FiUsers, FiCalendar } from "react-icons/fi";

export default async function Page({ searchParams }) {
  // Parallel fetching
  const [profile, schoolYears] = await Promise.all([
    checkRole(),
    getAllSchoolYears(),
  ]);

  const params = await searchParams;

  // Sort latest first
  const sortedYears = [...schoolYears].sort((a, b) => {
    const startA = parseInt(a.year_label.slice(0, 4), 10);

    const startB = parseInt(b.year_label.slice(0, 4), 10);

    return startB - startA;
  });

  // No redirect
  const year_label = params?.year || sortedYears[0]?.year_label;

  // No school years
  if (!year_label) {
    notFound();
  }

  // Get school year
  const year_data = await getSchoolYear(year_label);

  // Invalid year
  if (!year_data) {
    notFound();
  }

  // Get classes
  const res = await getClassesEnrollment({
    school_year_id: year_data.id,
  });

  if (res?.error) {
    return <div>Error: {res.error}</div>;
  }

  const classes = res.data;
  return (
    <div className="min-h-screen bg-lis-bg">
      {/* Page header */}
      <div className="border-b border-lis-panel-border bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left */}
            <div>
              <p className="text-sm text-lis-muted">Academic Management</p>

              <h1 className="mt-1 text-3xl font-normal tracking-tight text-lis-heading">
                Enrollment Dashboard
              </h1>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="rounded-sm border border-lis-panel-border bg-lis-panel-header px-5 py-3">
                <div className="flex items-center gap-3">
                  <FiUsers size={20} className="text-lis-muted" />

                  <div>
                    <p className="text-xs text-lis-muted">Total Classes</p>

                    <h2 className="text-xl font-bold text-lis-text">
                      {classes?.length || 0}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="rounded-sm border border-lis-panel-border bg-lis-panel-header px-5 py-3">
                <div className="flex items-center gap-3">
                  <FiCalendar size={20} className="text-lis-muted" />

                  <div>
                    <p className="text-xs text-lis-muted">School Year</p>

                    <h2 className="text-xl font-bold text-lis-text">{year_label}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 rounded-sm border border-lis-panel-border bg-white p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-lis-heading">
              School Year Enrollment
            </h2>

            <p className="mt-1 text-sm text-lis-muted">
              View and manage enrollment records by school year
            </p>
          </div>

          {/* School Year Selector */}
          <div className="w-full md:w-auto">
            <SchoolYearSelect currentYear={year_label} />
          </div>
        </div>

        {/* Client Component */}
        <div className="rounded-sm bg-white p-4 md:p-6 border border-lis-panel-border">
          <ClassClient
            key={year_label}
            school_year_id={year_data.id}
            year_status={year_data.status}
            profile={profile}
            year_label={year_label}
            initialData={classes}
          />
        </div>
      </div>
    </div>
  );
}
