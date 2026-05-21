import Link from "next/link";
import { createClient } from "../../../utils/supabase/server";
import { FiCalendar, FiChevronRight, FiBarChart2 } from "react-icons/fi";

export default async function Page() {
  const supabase = await createClient();

  const { data: school_year, error } = await supabase
    .from("school_year")
    .select("id, year_label, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm backdrop-blur">
              <FiBarChart2 />
              Academic Analytics
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              MPS Dashboard
            </h1>

            <p className="mt-3 max-w-xl text-sm text-blue-100">
              Access and manage Mean Percentage Score reports organized by
              school year.
            </p>
          </div>

          <div className="hidden md:flex">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-sm text-blue-100">Available Records</p>

              <h2 className="mt-2 text-5xl font-bold">{school_year.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mt-10 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">School Years</h2>

        <p className="mt-1 text-sm text-slate-500">
          Select a school year to open MPS reports
        </p>
      </div>

      {/* Empty */}
      {school_year.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <FiBarChart2 size={28} />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-700">
            No MPS Records Yet
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            School year reports will appear here once created.
          </p>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {[...school_year]
          .sort((a, b) => {
            const startA = Number(a.year_label.split("-")[0]);
            const startB = Number(b.year_label.split("-")[0]);

            return startB - startA;
          })
          .map((data) => (
            <Link
              key={data.id}
              href={{
                pathname: `/mps/${data.year_label}`,
              }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                {/* Glow */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100 blur-3xl opacity-50 transition group-hover:opacity-80" />

                <div className="relative z-10">
                  {/* Top */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                      <FiBarChart2 size={24} />
                    </div>

                    <div className="rounded-full bg-slate-100 p-2 text-slate-500 transition group-hover:bg-blue-600 group-hover:text-white">
                      <FiChevronRight size={18} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      School Year
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">
                      {data.year_label}
                    </h2>

                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                      <FiCalendar size={16} />

                      <span>
                        {new Date(data.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
