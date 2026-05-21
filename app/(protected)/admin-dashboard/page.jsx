// app/(admin)/school-year/page.jsx

import { BiCalendar, BiCheckCircle } from "react-icons/bi";

import { getSchoolYears } from "./actions";

import EditSchoolYearModal from "./EditSchoolYearModal";

export default async function Page() {
  const schoolYears = await getSchoolYears();

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-4 md:p-8">
      <div
        className="
          max-w-7xl
          mx-auto
          bg-white
          rounded-[32px]
          border
          border-neutral-200
          shadow-[0_10px_35px_rgba(0,0,0,0.05)]
          overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-5
            px-6
            md:px-8
            py-7
            border-b
            border-neutral-100
            bg-neutral-50/70
            backdrop-blur-sm
          "
        >
          {/* Left */}
          <div className="flex items-start gap-4">
            <div
              className="
                h-16
                w-16
                rounded-3xl
                bg-neutral-900
                text-white
                flex
                items-center
                justify-center
                shadow-sm
              "
            >
              <BiCalendar size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                School Year
              </h1>

              <p className="text-sm text-neutral-500 mt-2">
                Manage school year settings, statuses, and enrollment reference
                months.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-neutral-200
              bg-white
              px-5
              py-4
              shadow-sm
            "
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Total Records
              </p>

              <h3 className="text-2xl font-black text-neutral-900 mt-1">
                {schoolYears.length}
              </h3>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            {/* Head */}
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th
                  className="
                    px-6
                    py-5
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-neutral-500
                  "
                >
                  School Year
                </th>

                <th
                  className="
                    px-6
                    py-5
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-neutral-500
                  "
                >
                  Status
                </th>

                <th
                  className="
                    px-6
                    py-5
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-neutral-500
                  "
                >
                  Enrollment Month
                </th>

                <th
                  className="
                    px-6
                    py-5
                    text-right
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-neutral-500
                  "
                >
                  Action
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {schoolYears?.length > 0 ? (
                schoolYears.map((item) => (
                  <tr
                    key={item.id}
                    className="
                        border-b
                        border-neutral-100
                        transition
                        hover:bg-neutral-50/70
                      "
                  >
                    {/* Year */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="
                              h-12
                              w-12
                              rounded-2xl
                              bg-neutral-100
                              text-neutral-700
                              flex
                              items-center
                              justify-center
                              shrink-0
                            "
                        >
                          <BiCalendar size={24} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-neutral-900">
                            {item.year_label}
                          </h3>

                          <p className="text-sm text-neutral-500 mt-1">
                            Academic School Year
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            px-4
                            py-2
                            text-xs
                            font-semibold
                            ${
                              item.status === "active"
                                ? `
                                  bg-emerald-50
                                  text-emerald-700
                                  border
                                  border-emerald-100
                                `
                                : `
                                  bg-neutral-100
                                  text-neutral-600
                                  border
                                  border-neutral-200
                                `
                            }
                          `}
                      >
                        {item.status === "active" && <BiCheckCircle />}

                        {item.status || "N/A"}
                      </span>
                    </td>

                    {/* Month */}
                    <td className="px-6 py-5">
                      <div
                        className="
                            inline-flex
                            items-center
                            rounded-2xl
                            border
                            border-neutral-200
                            bg-white
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-neutral-700
                            shadow-sm
                          "
                      >
                        {item.active_month || "N/A"}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-5">
                      <div className="flex justify-end">
                        <EditSchoolYearModal item={item} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="space-y-4">
                      <div
                        className="
                          mx-auto
                          h-20
                          w-20
                          rounded-3xl
                          bg-neutral-100
                          flex
                          items-center
                          justify-center
                          text-neutral-400
                        "
                      >
                        <BiCalendar size={36} />
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold text-neutral-700">
                          No School Year Found
                        </h3>

                        <p className="text-sm text-neutral-500 mt-2">
                          No school year records are currently available.
                        </p>
                      </div>
                    </div>
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
