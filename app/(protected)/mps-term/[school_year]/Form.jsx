"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { BiSave, BiX, BiBookOpen, BiUpload, BiFile } from "react-icons/bi";

import {
  createMPSTermReport,
  updateMPSTermReport,
} from "../../../features/mps-term/actions";
import { EXAM_TYPES } from "../../../features/mps-term/reportSchema";
import toast from "react-hot-toast";

export default function MPSTermForm({
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

  const action = isEditing ? updateMPSTermReport : createMPSTermReport;

  const [state, formAction, pending] = useActionState(action, null);

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  // --------------------------------------------------
  // Labels
  // --------------------------------------------------
  const formTitle = isEditing ? "Edit MPS Term Report" : "Create MPS Term Report";

  const statusLabel = isEditing ? "Editing" : "New Report";

  const successLabel = isEditing
    ? "File updated successfully!"
    : "File submitted successfully!";

  // --------------------------------------------------
  // Effects
  // --------------------------------------------------
  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(successLabel);

      setSuccessMessage(successLabel);

      if (isEditing) {
        setInitialData(null);
      }

      setOpenForm(false);
    }

    if (state.error) {
      toast.error(state.error);
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

  const termValue = state?.values?.term || initialData?.term || "";

  const examTypeValue =
    state?.values?.exam_type || initialData?.exam_type || "Test Exam";

  const getFieldValue = (field) =>
    state?.values?.[field] || initialData?.[field] || "";

  return (
    <div className="fixed inset-0 z-[50] overflow-y-auto">
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

              <input
                type="hidden"
                name="school_year"
                defaultValue={school_year}
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

                {/* Term */}
                {!isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Term
                    </label>

                    <select
                      key={termValue}
                      name="term"
                      defaultValue={termValue}
                      className={inputClass}
                    >
                      <option value="">Select Term</option>

                      <option value="1">Term 1</option>
                      <option value="2">Term 2</option>
                      <option value="3">Term 3</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Term
                    </label>

                    <input
                      readOnly
                      name="term"
                      type="text"
                      defaultValue={initialData?.term || ""}
                      className={`${inputClass} bg-gray-100`}
                    />
                  </div>
                )}

                {/* Exam Type */}
                {!isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Examination Type
                    </label>

                    <select
                      key={examTypeValue}
                      name="exam_type"
                      defaultValue={examTypeValue}
                      className={inputClass}
                    >
                      {EXAM_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Examination Type
                    </label>

                    <input
                      readOnly
                      name="exam_type"
                      type="text"
                      defaultValue={initialData?.exam_type || "Test Exam"}
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

            {/* File Upload */}
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
                MPS File
              </h3>

              <label className="block cursor-pointer">
                <div
                  className="
                    rounded-2xl
                    border
                    border-dashed
                    border-gray-300
                    bg-gray-50
                    hover:border-emerald-400
                    transition
                    p-8
                    text-center
                  "
                >
                  <BiUpload className="mx-auto text-3xl text-gray-400 mb-2" />

                  <p className="text-sm font-medium text-gray-700">
                    Click to upload the MPS file
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {isEditing
                      ? "Leave blank to keep the current file"
                      : "Required"}
                  </p>

                  {fileName && (
                    <p className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-emerald-700">
                      <BiFile size={16} />
                      {fileName}
                    </p>
                  )}

                  {!fileName && isEditing && initialData?.file_url && (
                    <a
                      href={initialData.file_url}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-blue-600 hover:underline"
                    >
                      <BiFile size={16} />
                      Current file
                    </a>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  name="file"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                />
              </label>
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
