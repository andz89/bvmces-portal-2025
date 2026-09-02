// app/(admin)/school-year/page.jsx

import { BiCalendar, BiCheckCircle } from "react-icons/bi";

import { getSchoolYears } from "./actions";

import EditSchoolYearModal from "./EditSchoolYearModal";

export default async function Page() {
  const schoolYears = await getSchoolYears();

  return (
    <div className="min-h-screen bg-lis-bg p-4 md:p-8">
      <div
        className="
          max-w-7xl
          mx-auto
          bg-white
          rounded-sm
          border
          border-lis-panel-border
          
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
            border-lis-panel-border
            bg-lis-panel-header/70
            
          "
        >
          {/* Left */}
          <div className="flex items-start gap-4">
            <div
              className="
                h-16
                w-16
                rounded-sm
                bg-lis-primary
                text-white
                flex
                items-center
                justify-center
                
              "
            >
              <BiCalendar size={30} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-lis-text">
                School Year
              </h1>

              <p className="text-sm text-lis-muted mt-2">
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
              rounded-sm
              border
              border-lis-panel-border
              bg-white
              px-5
              py-4
              
            "
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-lis-muted">
                Total Records
              </p>

              <h3 className="text-2xl font-bold text-lis-text mt-1">
                {schoolYears.length}
              </h3>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            {/* Head */}
            <thead className="bg-lis-panel-header border-b border-lis-panel-border">
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
                    text-lis-muted
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
                    text-lis-muted
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
                    text-lis-muted
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
                    text-lis-muted
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
                        border-lis-panel-border
                        transition
                        hover:bg-lis-panel-header/70
                      "
                  >
                    {/* Year */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="
                              h-12
                              w-12
                              rounded-sm
                              bg-lis-panel-header
                              text-lis-text
                              flex
                              items-center
                              justify-center
                              shrink-0
                            "
                        >
                          <BiCalendar size={24} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lis-text">
                            {item.year_label}
                          </h3>

                          <p className="text-sm text-lis-muted mt-1">
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
                                  bg-lis-panel-header
                                  text-lis-success-text
                                  border
                                  border-lis-panel-border
                                `
                                : `
                                  bg-lis-panel-header
                                  text-lis-muted
                                  border
                                  border-lis-panel-border
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
                            rounded-sm
                            border
                            border-lis-panel-border
                            bg-white
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-lis-text
                            
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
                          rounded-sm
                          bg-lis-panel-header
                          flex
                          items-center
                          justify-center
                          text-lis-muted
                        "
                      >
                        <BiCalendar size={36} />
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold text-lis-text">
                          No School Year Found
                        </h3>

                        <p className="text-sm text-lis-muted mt-2">
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
