"use client";

import { useState } from "react";
import { createSchoolYear, deleteSchoolYear, getSchoolYears } from "./actions";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
export default function SchoolYearClient({ initialData, profile }) {
  const [schoolYears, setSchoolYears] = useState(initialData);
  const [yearLabel, setYearLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    const data = await getSchoolYears();
    setSchoolYears(data);
  };

  const handleCreate = async () => {
    setLoading(true);
    await createSchoolYear(yearLabel);
    setYearLabel("");
    await refresh();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const ok = confirm(
      "Deleting this school year will remove all related classes and records. Continue?"
    );

    if (!ok) return;

    await deleteSchoolYear(id);
    await refresh();
  };

  return (
    <div className="space-y-6">
      {/* Create */}
      {profile.admin === "admin" && (
        <div className="flex gap-2">
          <input
            value={yearLabel}
            onChange={(e) => setYearLabel(e.target.value)}
            placeholder="e.g. 2025–2026"
            className="border rounded px-3 py-2 w-60"
          />
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {schoolYears.map((sy) => (
          <div
            key={sy.id}
            className="border rounded-lg bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="p-4 flex items-center justify-between">
              {" "}
              <div>
                <Link
                  href={{
                    pathname: `/class/${sy.year_label}`,
                    query: { id: sy.id },
                  }}
                  className=" hover:underline"
                >
                  <h3 className="text-lg font-semibold">{sy.year_label}</h3>
                </Link>
                {new Date(sy.created_at).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(sy.id)}
                  className="cursor-pointer  text-sm hover:underline"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {schoolYears.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">
            No school years found
          </div>
        )}
      </div>
    </div>
  );
}
