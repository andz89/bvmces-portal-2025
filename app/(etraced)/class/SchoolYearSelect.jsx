"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import FullPageLoader from "../../components/loader/FullPageLoader";
import { createSchoolYear } from "./actions";
export default function SchoolYearSelect({ currentYear, role, schoolYears }) {
  const [loading, setLoading] = useState(false);

  const [yearLabel, setYearLabel] = useState("");
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const nextSchoolYear = (() => {
    if (!schoolYears?.length) return "";

    const highest = schoolYears[0].year_label; // already sorted DESC
    const start = parseInt(highest.slice(0, 4), 10);
    const end = start + 1;

    return `${end}-${end + 1}`;
  })();

  function handleChange(e) {
    const year = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", year);

    startTransition(() => {
      router.push(`?${params.toString()}`);
      router.refresh();
    });
  }
  const handleCreate = async () => {
    setLoading(true);
    await createSchoolYear(yearLabel);
    setYearLabel("");
    // await refresh();
    setLoading(false);
  };
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
      {isPending && <FullPageLoader />}
      <div className="flex flex-col gap-1 w-full sm:w-[200px]">
        <select
          value={currentYear}
          onChange={handleChange}
          className=" border p-3"
        >
          {schoolYears.map((year) => (
            <option key={year.id} value={year.year_label}>
              {year.year_label}
            </option>
          ))}
        </select>
      </div>
      {role === "admin" && (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-fit"
        >
          Create School Year
        </button>
      )}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Create School Year</h2>

            <select
              value={yearLabel || nextSchoolYear}
              onChange={(e) => setYearLabel(e.target.value)}
              className="border rounded px-3 py-2 w-full mb-4"
            >
              <option value={nextSchoolYear}>{nextSchoolYear}</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleCreate(yearLabel || nextSchoolYear);
                  setOpen(false);
                }}
                disabled={loading || !nextSchoolYear}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
