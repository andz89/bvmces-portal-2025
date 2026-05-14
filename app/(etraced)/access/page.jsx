import { redirect } from "next/navigation";
import { getSchoolYear, getClassesEnrollment } from "./actions";
import ClassClient from "./ClassClient";
import { checkRole } from "../../../utils/lib/checkRole.js";
import SchoolYearSelect from "./SchoolYearSelect.jsx";

import { FiBookOpen, FiUsers, FiCalendar } from "react-icons/fi";

export default async function Page({ searchParams }) {
  const profile = await checkRole();

  const params = await searchParams;

  const year_label =
    typeof params.year === "string" ? params.year : "2026-2027";

  if (!year_label) {
    redirect("/access?year=2026-2027");
  }

  const year_data = await getSchoolYear(year_label);

  if (!year_data) {
    redirect("/access");
  }

  const classes = await getClassesEnrollment({ school_year_id: year_data.id });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm text-white backdrop-blur">
                <FiBookOpen />
                Academic Management
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
                Class Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-blue-100">
                Manage class sections, enrollment records, and organize school
                year information efficiently.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-5 text-white backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <FiUsers size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-blue-100">Total Classes</p>

                    <h2 className="text-3xl font-bold">
                      {classes?.length || 0}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-5 text-white backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <FiCalendar size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-blue-100">School Year</p>

                    <h2 className="text-2xl font-bold">{year_label}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Toolbar */}
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Classes</h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage class records by school year
            </p>
          </div>

          {/* School Year Selector */}
          <div className="w-full md:w-auto">
            <SchoolYearSelect currentYear={year_label} />
          </div>
        </div>

        {/* Client Component */}
        <div className="rounded-3xl bg-white p-4 md:p-6 shadow-sm border border-slate-200">
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
