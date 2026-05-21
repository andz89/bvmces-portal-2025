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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-7 text-white">
          {/* Glow */}
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Monthly Enrollment Form
              </h1>

              <p className="mt-2 text-sm text-blue-100">
                Monitor boys, girls, and total enrollment from June to April.
              </p>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur transition hover:bg-white/20"
            >
              <BiX size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="max-h-[80vh] overflow-y-auto p-6">
          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
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
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    {/* Month */}
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {month}
                    </td>

                    {/* Boys */}
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0"
                        name={`boys_${month.toLowerCase()}`}
                        placeholder="0"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-center outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </td>

                    {/* Girls */}
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        min="0"
                        name={`girls_${month.toLowerCase()}`}
                        placeholder="0"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-center outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
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
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-center font-semibold text-slate-700 outline-none"
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
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            {/* Save */}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
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
