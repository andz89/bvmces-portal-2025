import Link from "next/link";
import { createClient } from "../../../utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();

  const { data: school_year, error } = await supabase
    .from("school_year")
    .select("id,year_label,  created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="p-6 space-y-6 h-screen">
      <div>
        <h1 className="text-xl font-semibold">MPS</h1>
        <p className="text-sm text-gray-500">
          Manage MPS descriptions by school year
        </p>
      </div>

      {/* MPS List */}
      <div className="bg-white rounded  ">
        <div className=" flex gap-2 w-full flex-wrap  ">
          {school_year.length === 0 && (
            <div className="p-4 text-center text-gray-500 border rounded bg-gray-50">
              No MPS records yet
            </div>
          )}

          {school_year.map((classData) => (
            <div key={classData.id} className="w-[300px]">
              <Link
                href={{
                  pathname: `/mps/${classData.year_label}`,
                  query: { id: classData.id },
                }}
              >
                <div
                  key={classData.id}
                  className="flex items-center justify-between border rounded p-4 bg-white hover:bg-gray-50 transition"
                >
                  <div>
                    <div className="text-sm font-semibold text-blue-600  ">
                      {classData.year_label}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      Created:{" "}
                      {new Date(classData.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-xs text-gray-400">→</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
