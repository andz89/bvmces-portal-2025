"use client";

import { useActionState, useEffect } from "react";

import { BiSave, BiX, BiBookOpen } from "react-icons/bi";

import { createMPSReport, updateMPSReport } from "./actions";

export default function MPSForm({
  classData = [],
  initialData = null,
  school_year,
  setInitialData,
  setEditingReport,
  setSuccessMessage,
  setOpenForm,
}) {
  // --------------------------------------------------
  // Mode
  // --------------------------------------------------
  const isEditing = Boolean(initialData);

  const action = isEditing ? updateMPSReport : createMPSReport;

  const [state, formAction, pending] = useActionState(action, null);

  // --------------------------------------------------
  // Labels
  // --------------------------------------------------
  const formTitle = isEditing ? "Edit MPS Report" : "Create MPS Report";

  const statusLabel = isEditing ? "Editing" : "New Report";

  const successLabel = isEditing
    ? "File updated successfully!"
    : "File submitted successfully!";

  // --------------------------------------------------
  // Effects
  // --------------------------------------------------
  useEffect(() => {
    if (state?.success) {
      setSuccessMessage(successLabel);

      if (isEditing) {
        setInitialData(null);
      }
    }
  }, [state]);

  // --------------------------------------------------
  // Styles
  // --------------------------------------------------
  const inputClass = `
    w-full
    rounded-2xl
    border
    border-gray-200
    bg-white
    px-4
    py-3
    text-sm
    text-gray-700
    outline-none
    transition
    focus:border-emerald-500
    focus:ring-4
    focus:ring-emerald-100
  `;

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  const subjects = [
    "gmrc",
    "epp",
    "filipino",
    "english",
    "math",
    "science",
    "ap",
    "mapeh",
    "reading_literacy",
  ];

  const classValue = state?.values?.class_id || initialData?.class?.id || "";

  const quarterValue = state?.values?.quarter || initialData?.quarter || "";

  const getFieldValue = (field) =>
    state?.values?.[field] || initialData?.[field] || "";

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Overlay */}
      <div
        className="
          fixed
          inset-0
          bg-black/40
          backdrop-blur-sm
        "
        onClick={() => setOpenForm(false)}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <form
          action={formAction}
          className="
            relative
            w-full
            max-w-6xl
            overflow-hidden
            rounded-[32px]
            bg-white
            shadow-[0_25px_80px_rgba(0,0,0,0.25)]
          "
        >
          {/* Header */}
          <div
            className="
              relative
              overflow-hidden
              bg-gradient-to-r
              from-emerald-600
              via-green-600
              to-teal-600
              px-8
              py-7
            "
          >
            {/* Glow */}
            <div className="absolute right-0 top-0 h-40 w-40 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              {/* Left */}
              <div className="flex items-start gap-4">
                <div
                  className="
                    h-16
                    w-16
                    rounded-2xl
                    bg-white/10
                    backdrop-blur-xl
                    border
                    border-white/10
                    text-white
                    flex
                    items-center
                    justify-center
                  "
                >
                  <BiBookOpen size={30} />
                </div>

                <div>
                  <h2 className="text-3xl font-black text-white">
                    {formTitle}
                  </h2>

                  <p className="text-emerald-100 mt-2">
                    Manage academic performance and learner progress summaries.
                  </p>
                </div>
              </div>

              {/* School Year */}
              <div className="flex gap-3 flex-wrap">
                <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl px-4 py-3">
                  <p className="text-xs uppercase text-emerald-100">
                    School Year
                  </p>

                  <p className="text-lg font-bold text-white mt-1">
                    {school_year}
                  </p>
                </div>

                <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl px-4 py-3">
                  <p className="text-xs uppercase text-emerald-100">Status</p>

                  <p className="text-lg font-bold text-white mt-1">
                    {statusLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[75vh] overflow-y-auto bg-[#f5f7fb] px-6 md:px-8 py-8">
            {/* Error */}
            {state?.error && (
              <div
                className="
                  mb-6
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-600
                "
              >
                {state.error}
              </div>
            )}

            {/* Top Controls */}
            <div
              className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                p-6
                shadow-sm
                mb-8
              "
            >
              <input
                type="hidden"
                name="id"
                defaultValue={initialData?.id || ""}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {/* Class */}
                {!isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Select Class
                    </label>

                    <select
                      key={classValue}
                      name="class_id"
                      defaultValue={classValue}
                      className={inputClass}
                    >
                      <option value="">Select Class</option>

                      {classData.classes?.map((item) => (
                        <option key={item.id} value={item.id}>
                          Grade {item.grade.toUpperCase()}
                          {" - "}
                          {item.section.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    {/* Grade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Grade
                      </label>

                      <input
                        readOnly
                        type="text"
                        defaultValue={initialData?.class?.grade || ""}
                        className={`${inputClass} bg-gray-100`}
                      />

                      <input
                        name="class_id"
                        readOnly
                        type="hidden"
                        defaultValue={initialData?.class_id || ""}
                      />
                    </div>

                    {/* Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Section
                      </label>

                      <input
                        readOnly
                        type="text"
                        defaultValue={initialData?.class?.section || ""}
                        className={`${inputClass} bg-gray-100`}
                      />
                    </div>
                  </>
                )}

                {/* School Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    School Year
                  </label>

                  <input
                    readOnly
                    type="text"
                    name="school_year"
                    defaultValue={school_year}
                    className={`${inputClass} bg-gray-100`}
                  />
                </div>

                {/* Quarter */}
                {!isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Quarter
                    </label>

                    <select
                      key={quarterValue}
                      name="quarter"
                      defaultValue={quarterValue}
                      className={inputClass}
                    >
                      <option value="">Select Quarter</option>

                      <option value="1">Quarter 1</option>
                      <option value="2">Quarter 2</option>
                      <option value="3">Quarter 3</option>
                      <option value="4">Quarter 4</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Quarter
                    </label>

                    <input
                      readOnly
                      name="quarter"
                      type="text"
                      defaultValue={initialData?.quarter || ""}
                      className={`${inputClass} bg-gray-100`}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Subject Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {subjects.map((subject, index) => (
                <div
                  key={subject}
                  className="
                    bg-white
                    rounded-3xl
                    border
                    border-gray-100
                    p-6
                    shadow-sm
                  "
                >
                  {/* Card Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="
                        h-12
                        w-12
                        rounded-2xl
                        bg-gradient-to-r
                        from-emerald-500
                        to-green-600
                        text-white
                        flex
                        items-center
                        justify-center
                        font-bold
                        shadow-lg
                      "
                    >
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-800 uppercase">
                        {subject.replace("_", " ")}
                      </h3>

                      <p className="text-sm text-gray-500">Subject MPS score</p>
                    </div>
                  </div>

                  {/* Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Enter Score
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      name={subject}
                      defaultValue={getFieldValue(subject)}
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Source URLs */}
            <div
              className="
                mt-8
                bg-white
                rounded-3xl
                border
                border-gray-100
                p-6
                shadow-sm
              "
            >
              <h3 className="text-xl font-bold text-gray-800 mb-5">
                Source Links
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* LLC */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    LLC Source
                  </label>

                  <input
                    type="url"
                    name="llc_source"
                    defaultValue={getFieldValue("llc_source")}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>

                {/* MPS */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    MPS Source
                  </label>

                  <input
                    type="url"
                    name="mps_source"
                    defaultValue={getFieldValue("mps_source")}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="
              border-t
              border-gray-100
              bg-white
              px-6
              md:px-8
              py-5
              flex
              flex-col
              sm:flex-row
              items-center
              justify-end
              gap-3
            "
          >
            {/* Cancel */}
            <button
              type="button"
              onClick={() => setOpenForm(false)}
              className="
                w-full
                sm:w-auto
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-gray-200
                bg-white
                px-6
                py-3
                font-medium
                text-gray-700
                hover:bg-gray-50
                transition
              "
            >
              <BiX size={20} />

              <span>Cancel</span>
            </button>

            {/* Save */}
            <button
              disabled={pending}
              className="
                w-full
                sm:w-auto
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-emerald-600
                to-green-600
                px-7
                py-3
                font-semibold
                text-white
                shadow-lg
                hover:scale-[1.01]
                transition
                disabled:opacity-60
              "
            >
              <BiSave size={20} />

              <span>{pending ? "Saving..." : "Save Report"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
