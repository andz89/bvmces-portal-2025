// app/(admin)/school-year/page.jsx

import { getSchoolYears } from "./actions";
import EditSchoolYearModal from "./EditSchoolYearModal";

export default async function Page() {
  const schoolYears = await getSchoolYears();

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">School Year</h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage school year records
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-center p-4 text-sm font-semibold text-gray-600">
                  Year Label
                </th>

                <th className="text-center p-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-center p-4 text-sm font-semibold text-gray-600">
                  Enrollment Reference Month
                </th>

                <th className="text-center p-4 text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {schoolYears?.length > 0 ? (
                schoolYears.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 text-sm text-gray-700 text-center">
                      {item.year_label}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${
                            item.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }
                        `}
                      >
                        {item.status || "N/A"}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-gray-700 text-center">
                      {item.active_month || "N/A"}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center text-center">
                        <EditSchoolYearModal item={item} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400">
                    No school year found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
