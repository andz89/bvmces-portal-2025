"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useActionState, useEffect } from "react";
import { createMPSReport, updateMPSReport } from "./actions";
export default function MPSForm({
  initialData = null,
  school_year,
  setInitialData,
  setEditingReport,
  setSuccessMessage,
  setOpenForm,
}) {
  console.log(initialData?.id);
  const action = initialData
    ? updateMPSReport.bind(null, initialData.id)
    : createMPSReport;
  // const action = createMPSReport;
  const [state, formAction, pending] = useActionState(action, null);
  useEffect(() => {
    if (state?.success) {
      if (initialData) {
        setSuccessMessage("File updated successfully!");
        setInitialData(null);
      } else {
        setSuccessMessage("File submitted successfully!");
      }
    }
  }, [state]);

  return (
    <div>
      <div>
        <form action={formAction}>
          <div className="bg-gray-100/80  fixed    w-full h-full overflow-auto top-0    ">
            <div className="bg-white p-6 rounded-xl shadow space-y-6 w-[700px] mx-auto my-5">
              {/* Feedback */}
              {state?.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
              )}
              <div className="grid grid-cols-4 md:grid-cols-1 gap-4  ">
                <h3 className="font-bold text-[25px]">Add MPS</h3>
                {/* grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Grade
                  </label>

                  <select
                    key={state?.values?.grade || initialData?.grade || ""}
                    name="grade"
                    defaultValue={
                      state?.values?.grade || initialData?.grade || ""
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="">Select grade</option>
                    <option value="1">Grade 1</option>
                    <option value="2">Grade 2</option>
                    <option value="3">Grade 3</option>
                    <option value="4">Grade 4</option>
                    <option value="5">Grade 5</option>
                    <option value="6">Grade 6</option>
                  </select>
                </div>
                {/* Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Section
                  </label>

                  <input
                    type="text"
                    name="section"
                    defaultValue={
                      state?.values?.section || initialData?.section || ""
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    School Year
                  </label>
                  <input
                    readOnly
                    type="text"
                    name="school_year"
                    defaultValue={school_year}
                    className="bg-gray-100 focus:outline-none  w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* Quarter */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Quarter
                  </label>

                  <select
                    key={state?.values?.quarter || initialData?.quarter || ""}
                    name="quarter"
                    defaultValue={
                      state?.values?.quarter || initialData?.quarter || ""
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="">Select quarter</option>
                    <option value="1">Quarter 1</option>
                    <option value="2">Quarter 2</option>
                    <option value="3">Quarter 3</option>
                    <option value="4">Quarter 4</option>
                  </select>
                </div>

                {/* GMRC */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    GMRC
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="gmrc"
                    defaultValue={
                      state?.values?.gmrc || initialData?.gmrc || ""
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* EPP */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    EPP
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="epp"
                    defaultValue={state?.values?.epp || initialData?.epp || ""}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* Filipino */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Filipino
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="filipino"
                    defaultValue={
                      state?.values?.filipino || initialData?.filipino || ""
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* English */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    English
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="english"
                    defaultValue={
                      state?.values?.english || initialData?.english || ""
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* Math */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Math
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="math"
                    defaultValue={
                      state?.values?.math || initialData?.math || ""
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* Science */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Science
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="science"
                    defaultValue={
                      state?.values?.science || initialData?.science || ""
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* AP */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    AP
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="ap"
                    defaultValue={state?.values?.ap || initialData?.ap || ""}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* MAPEH */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    MAPEH
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="mapeh"
                    defaultValue={
                      state?.values?.mapeh || initialData?.mapeh || ""
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* Reading Literacy */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Reading Literacy
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="reading_literacy"
                    defaultValue={
                      state?.values?.reading_literacy ||
                      initialData?.reading_literacy ||
                      ""
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                {/* LLC Source */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    LLC Source
                  </label>

                  <input
                    type="url"
                    name="llc_source"
                    defaultValue={
                      state?.values?.llc_source || initialData?.llc_source || ""
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    MPS Source
                  </label>

                  <input
                    type="url"
                    name="mps_source"
                    defaultValue={
                      state?.values?.mps_source || initialData?.mps_source || ""
                    }
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end w-full index-9999 fixed  top-5 right-5">
            <button
              onClick={() => setOpenForm(false)}
              className="bg-red-400 px-4 py-2 rounded text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={pending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded  disabled:opacity-90  "
            >
              {pending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
