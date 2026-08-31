"use client";
import { useRef, useState } from "react";
import { BiUpload, BiUser } from "react-icons/bi";
import toast from "react-hot-toast";
import SuccessModal from "./SuccessModal";
export default function DataEntryForm({
  profile,
  upload_lesson_plan,
  canSubmit,
}) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [fileName, setFileName] = useState("");
  const MAX_FILE_SIZE = 52428800;
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must not exceed 50 MB.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      console.log("BEFORE UPLOAD FETCH");

      const response = await fetch("/api/lesson-plan/upload", {
        method: "POST",
        body: formData,
      });

      console.log("UPLOAD RESPONSE:", response.status);

      const result = await response.json();

      if (!response.ok || result.status === "error") {
        throw new Error(result.message || "Upload failed.");
      }

      setShowSuccess(true);

      formRef.current.reset();
      setFileName("");
      setShowForm(false);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);

      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" ">
      {profile.grade && !canSubmit && !upload_lesson_plan && (
        <div className="rounded-xl bg-amber-100 px-4 py-3 text-sm text-amber-800">
          Lesson plan submissions are only open from Friday 8:00 AM to Monday
          8:00 AM.
        </div>
      )}
      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />

      {/* <div
        className="w-45 bg-emerald-600 text-white py-3 px-1 font-semibold text-sm text-center  rounded-2xl cursor-pointer hover:bg-emerald-700 transition"
        onClick={() => setShowForm(true)}
      >
        Submit Lesson Plan
      </div> */}

      {profile.grade && (canSubmit || upload_lesson_plan) && (
        <div
          className="w-45 bg-emerald-600 text-white py-3 px-1 font-semibold text-sm text-center rounded-2xl cursor-pointer hover:bg-emerald-700 transition"
          onClick={() => setShowForm(true)}
        >
          Submit Lesson Plan
        </div>
      )}
      {/* <div
        className="w-45 bg-emerald-600 text-white py-3 px-1 font-semibold text-sm text-center  rounded-2xl cursor-pointer hover:bg-emerald-700 transition"
        onClick={() => setShowForm(true)}
      >
        Submit Lesson Plan
      </div> */}
      <div
        className={`fixed inset-0 size-auto     bg-slate-100/50 z-50 h-screen    flex items-center justify-center   mx-auto w-full ${showForm ? "" : "hidden"}`}
      >
        <div className=" w-3xl mx-auto bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="border-b border-neutral-100 px-8 py-6">
            <h1 className="text-2xl font-bold text-neutral-900">
              Submit Lesson Plan
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Complete the form below and upload your lesson plan.
            </p>
          </div>

          {/* Form */}
          <form className="p-8 space-y-6" ref={formRef} onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                School Year
              </label>

              <div className="relative">
                <input
                  type="text"
                  name="schoolYear"
                  readOnly
                  value="2026-2027"
                  className="w-full rounded-2xl border border-neutral-200    px-5 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>
            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Teacher Name
              </label>

              <div className="relative">
                <BiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xl" />

                <input
                  value={profile?.full_name || ""}
                  readOnly
                  type="text"
                  name="teacherName"
                  placeholder="Enter teacher name"
                  className="uppercase w-full rounded-2xl border border-neutral-200 pl-12 pr-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <input
              type="hidden"
              value={profile?.grade || ""}
              name="grade"
              className="uppercase w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />

            <input
              type="hidden"
              value={profile?.id || ""}
              readOnly
              name="teacher_id"
              placeholder="Enter teacher name"
              className="uppercase w-full rounded-2xl border border-neutral-200 pl-12 pr-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
            <select
              name="lesson_level"
              required
              defaultValue=""
              className="
    w-full
    rounded-2xl
    border
    border-neutral-200
    bg-white
    px-4
    py-3
    outline-none
    transition
    focus:border-emerald-500
    focus:ring-4
    focus:ring-emerald-100
  "
            >
              <option value="" disabled>
                Select Grade
              </option>

              <option value="Kinder">Kinder</option>

              {Array.from({ length: 6 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Week
              </label>

              <div className="relative">
                <select
                  name="week"
                  required
                  defaultValue=""
                  className="
        w-full
        rounded-2xl
        border
        border-neutral-200
        bg-white
        px-4
        py-3
        outline-none
        transition
        focus:border-emerald-500
        focus:ring-4
        focus:ring-emerald-100
      "
                >
                  <option value="" disabled>
                    Select Week
                  </option>

                  {Array.from({ length: 15 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Term
              </label>

              <div className="relative">
                <select
                  name="term"
                  required
                  defaultValue=""
                  className="
        w-full
        rounded-2xl
        border
        border-neutral-200
        bg-white
        px-4
        py-3
        outline-none
        transition
        focus:border-emerald-500
        focus:ring-4
        focus:ring-emerald-100
      "
                >
                  <option value="" disabled>
                    Select Term
                  </option>

                  {Array.from({ length: 3 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Subject
              </label>

              <div className="relative">
                <select
                  name="subject"
                  required
                  defaultValue=""
                  className="
                w-full
                rounded-2xl
                border
                border-neutral-200
                bg-white
                px-4
                py-3
                outline-none
                transition
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-100
              "
                >
                  <option value="" disabled>
                    Select Subject
                  </option>

                  <option value="English">English</option>
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Filipino">Filipino</option>
                  <option value="Araling Panlipunan">Araling Panlipunan</option>
                  <option value="MAKABANSA">MAKABANSA</option>
                  <option value="MAPEH">MAPEH</option>
                  <option value="EPP">EPP</option>
                  <option value="GMRC">GMRC</option>
                  <option value="Reading and Literacy">
                    Reading and Literacy
                  </option>
                  <option value="Language">Language</option>
                </select>
              </div>
            </div>
            {/* Upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Upload Document
              </label>

              <label className="block cursor-pointer">
                <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 hover:border-emerald-500 transition p-8 text-center">
                  <BiUpload className="mx-auto text-4xl text-emerald-600 mb-3" />

                  <p className="font-medium text-neutral-800">
                    Click to upload
                  </p>

                  <p className="text-sm text-neutral-500 mt-1">
                    Excel, PDF, Word or any document
                  </p>

                  {fileName && (
                    <p className="mt-4 text-sm font-medium text-emerald-700">
                      {fileName}
                    </p>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  name="file"
                  accept=".doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) {
                      setFileName("");
                      return;
                    }

                    const allowedExtensions = [".doc", ".docx"];
                    const fileName = file.name.toLowerCase();

                    const isWordFile = allowedExtensions.some((ext) =>
                      fileName.endsWith(ext),
                    );

                    if (!isWordFile) {
                      toast.error(
                        "Only Microsoft Word (.doc, .docx) files are allowed.",
                      );
                      e.target.value = "";
                      setFileName("");
                      return;
                    }

                    if (file.size > MAX_FILE_SIZE) {
                      toast.error("File size must not exceed 50 MB.");
                      e.target.value = "";
                      setFileName("");
                      return;
                    }

                    setFileName(file.name);
                  }}
                />
              </label>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 border-t border-neutral-100 pt-4">
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    if (loading) return;

                    formRef.current.reset();
                    setFileName("");

                    setShowForm(false);
                  }}
                  className="
        rounded-xl
        px-5
        py-3
        text-sm
        font-medium
        text-white
        transition-colors
        hover:bg-red-600
        bg-red-700
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
                >
                  Cancel
                </button>

                <button
                  disabled={loading}
                  className="
        rounded-xl
        bg-gradient-to-r
        from-emerald-600
        to-green-600
        px-6
        py-3
        text-sm
        font-semibold
        text-white
        transition-all
        duration-200
        hover:from-emerald-700
        hover:to-green-700
        hover:shadow-md
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
                >
                  {loading ? "Uploading..." : "Upload Lesson Plan"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
