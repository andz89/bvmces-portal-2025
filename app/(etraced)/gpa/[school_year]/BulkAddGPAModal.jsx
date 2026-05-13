"use client";

import { useState } from "react";
import { createBulkGPA } from "./actions";
import FullPageLoader from "../../../components/loader/FullPageLoader";

import toast from "react-hot-toast";
const SUBJECTS = [
  "gmrc",
  "epp/MTB",
  "filipino",
  "english",
  "math",
  "science",
  "ap",
  "mapeh",
  "reading",
];

const QUARTERS = ["1", "2", "3", "4"];

export default function BulkAddGPAModal({
  open,
  onClose,
  school_year,
  classData,
}) {
  const [loading, setLoading] = useState(false);

  const [quarter, setQuarter] = useState("");
  const [section, setSection] = useState("");
  const [grade, setGrade] = useState("");
  const [class_id, setClassId] = useState("");
  const [schoolYear, setSchoolYear] = useState(school_year || "");
  if (!open) return null;

  async function handleSubmit() {
    if (!quarter) {
      toast.error("Please select a quarter.");
      return;
    }

    setLoading(true);

    try {
      await createBulkGPA({
        school_year: schoolYear,
        section,
        grade,
        quarter,
        class_id,
      });

      toast.success("GPA created successfully.");

      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {loading && <FullPageLoader />}

      <div className="bg-white p-6 rounded w-[420px] space-y-4 ">
        <h2 className="text-lg font-semibold">Create GPA Record</h2>

        {/* SUBJECTS */}
        <div>
          <div className="flex gap-2  flex-wrap w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Select Class
              </label>

              <select
                name="class_id"
                className="w-full border border-gray-300 rounded-lg p-2"
                onChange={(e) => setClassId(e.target.value)}
              >
                <option value="">Select Class</option>

                {classData.classes?.map((item) => (
                  <option key={item.id} value={item.id}>
                    GRADE - {item.grade.toUpperCase()} -{" "}
                    {item.section.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full ">
              <label>School Year</label>
              <input
                readOnly
                type="text"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                className="bg-gray-200 p-1 rounded border-1 border-gray-300 focus:border-gray-300 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* QUARTERS */}
        <div>
          <label className="text-sm font-medium">Quarter</label>

          <select
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mt-2"
          >
            <option value="">Select Quarter</option>

            <option value="1">1st Quarter</option>

            <option value="2">2nd Quarter</option>

            <option value="3">3rd Quarter</option>

            <option value="4">4th Quarter</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="cursor-pointer hover:bg-red-500 border border-red-400 text-white px-4 py-2 rounded bg-red-400 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded cursor-pointer"
          >
            Create Records
          </button>
        </div>
      </div>
    </div>
  );
}
