"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import FullPageLoader from "../components/loader/FullPageLoader";
import { createSchoolYear } from "./actions";
export default function SchoolYearSelect({
  currentYear,
  profile,
  schoolYears,
}) {
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [yearLabel, setYearLabel] = useState("");
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

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
  const handleCreate = async (yearLabel) => {
    setLoading(true);

    const res = await createSchoolYear(yearLabel);

    if (res?.error) {
      setLoading(false);
      return;
    }

    setYearLabel("");

    setLoading(false);

    router.push(`/class?year=${yearLabel}`);
    router.refresh();
  };
  return (
    <>
      {isPending && <FullPageLoader />}

      <div className="flex flex-col    w-full gap-3 ">
        {/* Select */}
        <div className="relative w-full  w-full">
          <select
            value={currentYear}
            onChange={handleChange}
            className="
              w-full
              appearance-none
              rounded-sm
              border border-lis-panel-border
              bg-white
              px-4
              py-3
              pr-10
              text-sm
              font-medium
              text-lis-text
              
              outline-none
              transition-all
              duration-200
              hover:border-lis-panel-border
              focus:border-lis-primary
              focus:ring-4
              focus:ring-lis-primary
            "
          >
            {schoolYears.map((year) => (
              <option key={year.id} value={year.year_label}>
                {year.year_label}
              </option>
            ))}
          </select>

          {/* Arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-lis-muted">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <div className=" w-full">
          {/* Button */}
          {profile?.role === "admin" && (
            <button
              onClick={() => setOpen(true)}
              className="

    w-full
    items-center
    gap-2
    rounded-sm
    border
    border-lis-panel-border
    bg-lis-panel-header
    px-4
    py-3
    cursor-pointer
    hover:bg-lis-tab-active
    text-sm
    text-lis-text
    
    transition
  
  "
            >
              Create School Year
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 "
            onClick={() => setOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-md overflow-hidden rounded-sm bg-white  border border-lis-panel-border">
            {/* Header */}
            <div className="border-b border-lis-panel-border px-6 py-5">
              <h2 className="text-xl font-bold text-lis-text">
                Create School Year
              </h2>

              <p className="mt-1 text-sm text-lis-muted">
                Add a new school year to the system.
              </p>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-lis-text">
                  School Year
                </label>

                <select
                  value={yearLabel || nextSchoolYear}
                  onChange={(e) => setYearLabel(e.target.value)}
                  className="
                    w-full
                    rounded-sm
                    border border-lis-panel-border
                    bg-lis-panel-header
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-lis-text
                    outline-none
                    transition
                    focus:border-lis-primary
                    focus:bg-white
                    focus:ring-4
                    focus:ring-lis-primary
                  "
                >
                  <option value={nextSchoolYear}>{nextSchoolYear}</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-lis-panel-border px-6 py-4 bg-lis-panel-header">
              <button
                onClick={() => setOpen(false)}
                className="
                  rounded-sm
                  border border-lis-panel-border
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-lis-text
                  transition
                  hover:bg-lis-panel-header
                "
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleCreate(yearLabel || nextSchoolYear);
                  setOpen(false);
                }}
                disabled={loading || !nextSchoolYear}
                className="
                  rounded-sm
                  bg-lis-primary
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-lis-primary-hover
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
