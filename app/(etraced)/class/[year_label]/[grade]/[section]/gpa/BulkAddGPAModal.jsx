"use client";

import { useState } from "react";
import { createBulkGPA } from "./actions";
import FullPageLoader from "../../../../../../components/loader/FullPageLoader";

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

const QUARTERS = ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"];

export default function BulkAddGPAModal({
  open,
  onClose,
  classID,
  year_label,
  section,
}) {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [quarters, setQuarters] = useState([]);

  if (!open) return null;

  function toggleValue(value, list, setList) {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  }

  async function handleSubmit() {
    if (!subjects.length || !quarters.length) {
      alert("Please select at least one subject and quarter.");
      return;
    }

    setLoading(true);

    try {
      await createBulkGPA({
        class_id: classID,
        year_label,
        section,
        subjects,
        quarters,
        baseValues: {
          not_meet_male: 0,
          not_meet_female: 0,
          fs_male: 0,
          fs_female: 0,
          s_male: 0,
          s_female: 0,
          vs_male: 0,
          vs_female: 0,
          e_male: 0,
          e_female: 0,
        },
      });

      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[520px] space-y-4">
        {loading && <FullPageLoader />}

        <h2 className="text-lg font-semibold">Bulk Create GPA</h2>

        {/* SUBJECTS */}
        <div>
          <label className="text-sm font-medium">Subjects</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {SUBJECTS.map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={subjects.includes(s)}
                  onChange={() => toggleValue(s, subjects, setSubjects)}
                />
                {s.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        {/* QUARTERS */}
        <div>
          <label className="text-sm font-medium">Quarters</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {QUARTERS.map((q) => (
              <label key={q} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={quarters.includes(q)}
                  onChange={() => toggleValue(q, quarters, setQuarters)}
                />
                {q}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Records
          </button>
        </div>
      </div>
    </div>
  );
}
