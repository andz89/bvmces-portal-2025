"use client";

import { useState } from "react";
import { createOrUpdateGPA } from "./actions";
import FullPageLoader from "../../../../../../components/loader/FullPageLoader";

export default function AddEditGPAModal({
  year_label,
  profile,
  section,
  grade,
  open,
  onClose,
  editingData,
  classID,
}) {
  const isEdit = Boolean(editingData);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData) {
    setLoading(true);

    try {
      await createOrUpdateGPA(formData, classID, year_label, section, grade);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const input = "w-full border px-2 py-2 rounded bg-white focus:outline-none";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[520px] space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit GPA" : "Add GPA"}
        </h2>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await handleSubmit(formData);
          }}
          className="space-y-3"
        >
          {loading && <FullPageLoader />}
          {isEdit && <input type="hidden" name="id" value={editingData.id} />}

          <div className="flex flex-col gap-1 ">
            <label className="text-xs font-medium ">Subject</label>
            <select
              name="subject"
              defaultValue={editingData?.subject || ""}
              required
              className={`${input}  `}
            >
              <option className="" value="" disabled>
                Select subject
              </option>

              <option value="gmrc">GMRC</option>
              <option value="epp/mtb">EPP/MTB</option>
              <option value="filipino">FILIPINO</option>
              <option value="english">ENGLISH</option>
              <option value="math">MATH</option>
              <option value="science">SCIENCE</option>
              <option value="ap">ARALING PANLIPUNAN</option>
              <option value="mapeh">MAPEH</option>
              <option value="reading">READING</option>
            </select>
          </div>

          <div
            className={`flex flex-col gap-1 ${
              profile.role !== "admin" ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <label className="text-xs font-medium text-gray-600">Quarter</label>
            <select
              readOnly={profile.role === "admin" ? false : true}
              name="quarter"
              defaultValue={
                editingData?.quarter
                  ? editingData.quarter
                      .toLowerCase()
                      .replace("quarter", "")
                      .trim()
                      .replace("1st", "1st Quarter")
                      .replace("2nd", "2nd Quarter")
                      .replace("3rd", "3rd Quarter")
                      .replace("4th", "4th Quarter")
                  : ""
              }
              required
              className={input}
            >
              <option value="" disabled>
                Select Quarter
              </option>

              {["1st", "2nd", "3rd", "4th"].map((q) => (
                <option key={q} value={`${q} Quarter`}>
                  {q} Quarter
                </option>
              ))}
            </select>
          </div>
          {/* FAILED */}
          <div className="bg-gray-200 p-2  rounded-sm">
            <label className="text-sm font-medium text-gray-600 text-slate-800">
              Failed
            </label>

            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium text-slate-800">
                  BOYS
                </label>

                <input
                  name="not_meet_male"
                  defaultValue={editingData?.not_meet_male || ""}
                  className={input}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">
                  GIRLS
                </label>
                <input
                  name="not_meet_female"
                  defaultValue={editingData?.not_meet_female || ""}
                  className={input}
                />
              </div>
            </div>
          </div>
          {/* FAIRLY SAT */}
          <div className="bg-gray-200 p-2  rounded-sm">
            <label className="text-sm font-medium text-gray-600 text-slate-800">
              FAIRLY SATISFACTORY
            </label>

            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium text-slate-800">
                  BOYS
                </label>

                <input
                  name="fs_male"
                  defaultValue={editingData?.fs_male || ""}
                  className={input}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">
                  GIRLS
                </label>
                <input
                  name="fs_female"
                  defaultValue={editingData?.fs_female || ""}
                  className={input}
                />
              </div>
            </div>
          </div>

          {/* s SAT */}
          <div className="bg-gray-200 p-2  rounded-sm">
            <label className="text-sm font-medium text-gray-600 text-slate-800">
              SATISFACTORY
            </label>

            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium text-slate-800">
                  BOYS
                </label>

                <input
                  name="s_male"
                  defaultValue={editingData?.s_male || ""}
                  className={input}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">
                  GIRLS
                </label>
                <input
                  name="s_female"
                  defaultValue={editingData?.s_female || ""}
                  className={input}
                />
              </div>
            </div>
          </div>

          {/* vs SAT */}
          <div className="bg-gray-200 p-2  rounded-sm">
            <label className="text-sm font-medium text-gray-600 text-slate-800">
              VERY SATISFACTORY
            </label>

            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium text-slate-800">
                  BOYS
                </label>

                <input
                  name="vs_male"
                  defaultValue={editingData?.vs_male || ""}
                  className={input}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">
                  GIRLS
                </label>
                <input
                  name="vs_female"
                  defaultValue={editingData?.vs_female || ""}
                  className={input}
                />
              </div>
            </div>
          </div>

          {/* e SAT */}
          <div className="bg-gray-200 p-2  rounded-sm">
            <label className="text-sm font-medium text-gray-600 text-slate-800">
              EXCELLENT SATISFACTORY
            </label>

            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium text-slate-800">
                  BOYS
                </label>

                <input
                  name="e_male"
                  defaultValue={editingData?.e_male || ""}
                  className={input}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-800">
                  GIRLS
                </label>
                <input
                  name="e_female"
                  defaultValue={editingData?.e_female || ""}
                  className={input}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
