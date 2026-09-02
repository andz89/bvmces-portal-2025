import Link from "next/link";
import { createClient } from "../../../utils/supabase/server";
import {
  FiAward,
  FiCalendar,
  FiChevronRight,
  FiBookOpen,
} from "react-icons/fi";

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
    <div className="min-h-screen bg-lis-panel-header p-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-sm bg-lis-primary    p-8 text-white ">
        <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-white/10 " />
        <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-lime-300/20 " />

        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm ">
              <FiAward />
              Academic Performance
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              GPA Dashboard
            </h1>

            <p className="mt-3 max-w-xl text-sm text-white/80">
              Manage and organize GPA records efficiently by school year.
            </p>
          </div>

          <div className="hidden md:flex">
            <div className="rounded-sm border border-white/10 bg-white/10 p-6 ">
              <p className="text-sm text-white/80">Available Records</p>

              <h2 className="mt-2 text-5xl font-bold">{school_year.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="mt-10 mb-6">
        <h2 className="text-2xl font-bold text-lis-text">School Years</h2>

        <p className="mt-1 text-sm text-lis-muted">
          Select a school year to manage GPA reports
        </p>
      </div>

      {/* Empty State */}
      {school_year.length === 0 && (
        <div className="rounded-sm border border-dashed border-lis-panel-border bg-white p-14 text-center ">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-sm bg-lis-panel-header text-lis-muted">
            <FiBookOpen size={28} />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-lis-text">
            No GPA Records Yet
          </h3>

          <p className="mt-2 text-sm text-lis-muted">
            GPA reports will appear here once created.
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
                pathname: `/gpa/${data.year_label}`,
              }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-sm border border-lis-panel-border bg-white p-6  transition-all duration-300 hover:-translate-y-1 ">
                {/* Glow Effect */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-lis-panel-header  opacity-50 transition group-hover:opacity-80" />

                <div className="relative z-10">
                  {/* Top */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-lis-primary   text-white ">
                      <FiAward size={24} />
                    </div>

                    <div className="rounded-full bg-lis-panel-header p-2 text-lis-muted transition group-hover:bg-lis-success group-hover:text-white">
                      <FiChevronRight size={18} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-wider text-lis-muted">
                      School Year
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-lis-text">
                      {data.year_label}
                    </h2>

                    <div className="mt-5 flex items-center gap-2 text-sm text-lis-muted">
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
