"use client";

import { BiX, BiSave } from "react-icons/bi";

export default function EnrollmentForm({ onClose }) {
  const months = [
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50  p-4">
      {/* Modal */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-sm bg-white  animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative overflow-hidden bg-lis-primary    px-8 py-7 text-white">
          {/* Glow */}
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 " />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Monthly Enrollment Form
              </h1>

              <p className="mt-2 text-sm text-white/80">
                Monitor boys, girls, and total enrollment from June to April.
              </p>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-sm bg-white/10  transition hover:bg-white/20"
            >
              <BiX size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="max-h-[80vh] overflow-y-auto p-6">
          {/* Table */}
          <div className="overflow-x-auto rounded-sm border border-lis-panel-border">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-lis-panel-header text-lis-text">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Month
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Boys
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Girls
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {months.map((month) => (
                  <tr
                    key={month}
                    className="border-t border-lis-panel-border transition hover:bg-lis-panel-header"
                  >
                    {/* Month */}
                    <td className="px-6 py-4 font-semibold text-lis-text">
                      {month}
                    </td>

                    {/* Boys */}
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0"
                        name={`boys_${month.toLowerCase()}`}
                        placeholder="0"
                        className="w-full rounded-sm border border-lis-panel-border bg-white px-4 py-2 text-center outline-none transition focus:border-lis-primary focus:ring-4 focus:ring-lis-primary"
                      />
                    </td>

                    {/* Girls */}
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0"
                        name={`girls_${month.toLowerCase()}`}
                        placeholder="0"
                        className="w-full rounded-sm border border-lis-panel-border bg-white px-4 py-2 text-center outline-none transition focus:border-lis-primary focus:ring-4 focus:ring-lis-primary"
                      />
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0"
                        name={`total_${month.toLowerCase()}`}
                        placeholder="0"
                        readOnly
                        className="w-full rounded-sm border border-lis-panel-border bg-lis-panel-header px-4 py-2 text-center font-semibold text-lis-text outline-none"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {/* Cancel */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-lis-panel-border bg-white px-6 py-3 font-medium text-lis-muted transition hover:bg-lis-panel-header"
            >
              Cancel
            </button>

            {/* Save */}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-lis-primary   px-6 py-3 font-medium text-white  transition hover:scale-[1.02] "
            >
              <BiSave size={20} />
              Save Enrollment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
