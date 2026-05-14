"use client";

import FullPageLoader from "../../../components/loader/FullPageLoader";
import { useState, useEffect } from "react";
import { updateGPA } from "./actions";
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

export default function EditGPAModal({
  openEdit,
  onClose,
  initialData,
  school_year,
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        grade: initialData.class.grade || "",
        quarter: initialData.quarter || "",

        section: initialData.class.section || "",

        subject: initialData.subject || "",

        not_meet_male: initialData.not_meet_male || 0,

        not_meet_female: initialData.not_meet_female || 0,

        fs_male: initialData.fs_male || 0,

        fs_female: initialData.fs_female || 0,

        s_male: initialData.s_male || 0,

        s_female: initialData.s_female || 0,

        vs_male: initialData.vs_male || 0,

        vs_female: initialData.vs_female || 0,

        e_male: initialData.e_male || 0,

        e_female: initialData.e_female || 0,
      });
    }
  }, [initialData]);

  const [formData, setFormData] = useState({
    subject: "",

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
  });

  if (!openEdit) return null;

  function handleChange(e) {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    const class_id = initialData.class_id;
    const quarter = initialData.quarter;
    const subject = initialData.subject;

    try {
      await updateGPA(class_id, quarter, subject, formData, school_year);
      toast.success("GPA updated successfully.");
      onClose();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div>
        {loading && <FullPageLoader />}
        <form onSubmit={handleSubmit}>
          <div className="bg-gray-100/80  fixed  z-[9999]  w-full h-full overflow-auto top-0    ">
            <div className="bg-white p-6 rounded-xl shadow space-y-6 w-[700px] mx-auto my-5">
              <h2 className="text-2xl font-bold mb-6">Update GPA</h2>
              {/* TOP INFO */}
              <div className=" gap-4">
                <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100">
                  <div className="space-y-1">
                    <p className="text-md text-gray-900 font-medium ">
                      Quarter {formData.quarter} / Grade {formData.grade} -{" "}
                      {formData.section?.toUpperCase()} /{" "}
                      {formData.subject.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* GPA COUNTS */}
              <div className="flex flex-col gap-4  ">
                {[
                  ["not_meet_male", "Failed Male"],
                  ["not_meet_female", "Failed Female"],

                  ["fs_male", "FS Male"],
                  ["fs_female", "FS Female"],

                  ["s_male", "S Male"],
                  ["s_female", "S Female"],

                  ["vs_male", "VS Male"],
                  ["vs_female", "VS Female"],

                  ["e_male", "Excellent Male"],
                  ["e_female", "Excellent Female"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-sm mb-1">{label}</label>

                    <input
                      type="number"
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    />
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 justify-end w-full index-9999 fixed  top-5 right-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-red-400 rounded cursor-pointer bg-red-400 hover:bg-red-500 text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
