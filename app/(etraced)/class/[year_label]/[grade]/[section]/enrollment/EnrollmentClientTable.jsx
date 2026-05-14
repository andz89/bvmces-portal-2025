"use client";

import { useState, useMemo } from "react";

import CreateEnrollmentModal from "./CreateEnrollmentModal";

import FullPageLoader from "../../../../../../components/loader/FullPageLoader";
import UpdateEnrollmentModal from "./UpdateEnrollmentModal";
export default function EnrollmentClientTable({
  section,
  grade,
  year_label,
  profile,
  class_id,
  enrollmentData,
}) {
  const MONTH_ORDER = [
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
    "january",
    "february",
    "march",
    "april",
  ];

  const sortedEnrollmentData = useMemo(() => {
    if (!enrollmentData) return [];

    return [...enrollmentData].sort((a, b) => {
      const aIndex = MONTH_ORDER.indexOf(a.month.toLowerCase());
      const bIndex = MONTH_ORDER.indexOf(b.month.toLowerCase());

      return aIndex - bIndex;
    });
  }, [enrollmentData]);

  const [editingRow, setEditingRow] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Totals
  const totalBoys = sortedEnrollmentData.reduce(
    (sum, item) => sum + (item.boys || 0),
    0,
  );

  const totalGirls = sortedEnrollmentData.reduce(
    (sum, item) => sum + (item.girls || 0),
    0,
  );

  const totalEnrollment = totalBoys + totalGirls;

  return (
    <>
      {loading && <FullPageLoader />}

      <CreateEnrollmentModal
        section={section}
        grade={grade}
        year_label={year_label}
        class_id={class_id}
        enrollmentData={enrollmentData}
      />
      {openUpdateModal && (
        <UpdateEnrollmentModal
          section={section}
          grade={grade}
          year_label={year_label}
          class_id={class_id}
          editingData={editingRow}
          onClose={() => {
            setOpenUpdateModal(false);
            setEditingRow(null);
          }}
        />
      )}
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Grade {grade.toUpperCase()} - {section.toUpperCase()}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Monthly enrollment summary
            </p>
          </div>

          {/* Summary Cards */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 min-w-[120px] shadow-sm text-center">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Boys
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalBoys}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 min-w-[120px] shadow-sm text-center">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Girls
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalGirls}
              </p>
            </div>

            <div className="bg-blue-600 text-white rounded-xl px-4 py-3 min-w-[140px] shadow-sm text-center">
              <p className="text-xs uppercase tracking-wide text-blue-100">
                Total
              </p>

              <p className="text-2xl font-bold mt-1">{totalEnrollment}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                    Month
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
                    Boys
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
                    Girls
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
                    Total
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedEnrollmentData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {item.month}
                    </td>

                    <td className="px-5 py-4 text-center text-gray-700">
                      {item.boys}
                    </td>

                    <td className="px-5 py-4 text-center text-gray-700">
                      {item.girls}
                    </td>

                    <td className="px-5 py-4 text-center font-semibold text-gray-900">
                      {item.boys + item.girls}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => {
                          setOpenUpdateModal(true);
                          setEditingRow(item);
                        }}
                        className="px-3 py-1.5 text-sm rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
