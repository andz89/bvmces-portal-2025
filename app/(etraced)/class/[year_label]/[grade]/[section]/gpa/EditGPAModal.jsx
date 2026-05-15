"use client";

import React, { useState, useEffect } from "react";

import { BiSave, BiX, BiEditAlt } from "react-icons/bi";

import FullPageLoader from "@/app/components/loader/FullPageLoader";

import { updateGPA } from "./actions";

import toast from "react-hot-toast";

export default function EditGPAModal({
  openEdit,
  onClose,
  initialData,
  school_year,
}) {
  const [loading, setLoading] = useState(false);

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

    const grade = initialData.class.grade;

    const section = initialData.class.section;

    try {
      await updateGPA(
        class_id,
        quarter,
        subject,
        formData,
        grade,
        section,
        school_year,
      );

      toast.success("GPA updated successfully.");

      onClose();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

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

  const categories = [
    {
      title: "Failed",
      color: "from-red-500 to-rose-600",

      male: "not_meet_male",

      female: "not_meet_female",
    },

    {
      title: "Fairly Satisfactory",

      color: "from-orange-500 to-amber-600",

      male: "fs_male",

      female: "fs_female",
    },

    {
      title: "Satisfactory",

      color: "from-blue-500 to-cyan-600",

      male: "s_male",

      female: "s_female",
    },

    {
      title: "Very Satisfactory",

      color: "from-emerald-500 to-green-600",

      male: "vs_male",

      female: "vs_female",
    },

    {
      title: "Excellent",

      color: "from-violet-500 to-purple-600",

      male: "e_male",

      female: "e_female",
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {loading && <FullPageLoader />}

      {/* Overlay */}
      <div
        className="
          fixed
          inset-0
          bg-black/40
          backdrop-blur-sm
        "
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
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
                  <BiEditAlt size={30} />
                </div>

                <div>
                  <h2 className="text-3xl font-black text-white">
                    Edit GPA Record
                  </h2>

                  <p className="text-emerald-100 mt-2">
                    Update learner performance statistics and GPA counts.
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
                  <p className="text-xs uppercase text-emerald-100">Quarter</p>

                  <p className="text-lg font-bold text-white mt-1">
                    {formData.quarter}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[75vh] overflow-y-auto bg-[#f5f7fb] px-6 md:px-8 py-8">
            {/* Summary */}
            <div
              className="
                rounded-3xl
                bg-gradient-to-r
                from-emerald-50
                to-green-50
                border
                border-emerald-100
                p-6
                mb-8
              "
            >
              <div className="flex flex-wrap items-center gap-4">
                {/* Grade */}
                <div
                  className="
                    rounded-2xl
                    bg-white
                    border
                    border-emerald-100
                    px-5
                    py-4
                    shadow-sm
                  "
                >
                  <p className="text-xs uppercase text-gray-500">Grade</p>

                  <h3 className="text-lg font-bold text-gray-800 mt-1">
                    Grade {formData.grade}
                  </h3>
                </div>

                {/* Section */}
                <div
                  className="
                    rounded-2xl
                    bg-white
                    border
                    border-emerald-100
                    px-5
                    py-4
                    shadow-sm
                  "
                >
                  <p className="text-xs uppercase text-gray-500">Section</p>

                  <h3 className="text-lg font-bold text-gray-800 mt-1 uppercase">
                    {formData.section}
                  </h3>
                </div>

                {/* Subject */}
                <div
                  className="
                    rounded-2xl
                    bg-white
                    border
                    border-emerald-100
                    px-5
                    py-4
                    shadow-sm
                  "
                >
                  <p className="text-xs uppercase text-gray-500">Subject</p>

                  <h3 className="text-lg font-bold text-gray-800 mt-1 uppercase">
                    {formData.subject}
                  </h3>
                </div>
              </div>
            </div>

            {/* GPA Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.title}
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
                      className={`
                          h-12
                          w-12
                          rounded-2xl
                          bg-gradient-to-r
                          ${category.color}
                          text-white
                          flex
                          items-center
                          justify-center
                          font-bold
                          shadow-lg
                        `}
                    >
                      {category.title.charAt(0)}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {category.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Learner count input
                      </p>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Male */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Male
                      </label>

                      <input
                        type="number"
                        name={category.male}
                        value={formData[category.male]}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>

                    {/* Female */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Female
                      </label>

                      <input
                        type="number"
                        name={category.female}
                        value={formData[category.female]}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
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
              onClick={onClose}
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
              type="submit"
              disabled={loading}
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

              <span>{loading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
