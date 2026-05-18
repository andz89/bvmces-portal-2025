// app/(admin)/school-year/EditSchoolYearModal.jsx

"use client";

import { useState, useTransition } from "react";
import { updateSchoolYear } from "./actions";
import { toast } from "react-hot-toast";

export default function EditSchoolYearModal({ item }) {
  const [open, setOpen] = useState(false);

  const [yearLabel, setYearLabel] = useState(item.year_label || "");
  const [status, setStatus] = useState(item.status || "");
  const [activeMonth, setActiveMonth] = useState(item.active_month || "");

  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await updateSchoolYear({
        id: item.id,

        status: item.status === "inactive" ? "inactive" : status,
        active_month: activeMonth,
      });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("School year updated successfully");
      setOpen(false);
    });
  };
  const months = [
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
  ];
  return (
    <>
      {/* Edit Button */}
      <button
        onClick={() => setOpen(true)}
        className="
          px-4
          py-2
          bg-blue-600
          hover:bg-blue-700
          text-white
          text-sm
          rounded-xl
          transition
          cursor-pointer
        "
      >
        Edit
      </button>

      {/* Modal */}
      {open && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/50
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              bg-white
              w-full
              max-w-lg
              rounded-2xl
              shadow-xl
              p-6
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Edit School Year
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="
                  text-gray-400
                  hover:text-gray-600
                  text-xl
                  cursor-pointer
                "
              >
                ×
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Year Label */}
              <div>
                <label className="text-left text-sm font-medium text-gray-700 block mb-2">
                  Year Label
                </label>

                <input
                  type="text"
                  readOnly
                  value={yearLabel}
                  onChange={(e) => setYearLabel(e.target.value)}
                  className="
                    w-full
                    border
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-left text-sm font-medium text-gray-700 block mb-2">
                  Status
                </label>

                <select
                  value={status}
                  disabled={status === "inactive" ? true : false}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`${status === "inactive" ? "bg-gray-200 border-gray-300" : ""}
                w-full
                border
                rounded-xl
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
                `}
                >
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Active Month */}
              <div>
                <label className="text-left text-sm font-medium text-gray-700 block mb-2">
                  Enrollment Reference Month
                </label>

                <select
                  value={activeMonth}
                  onChange={(e) => setActiveMonth(e.target.value)}
                  className="
      w-full
      border
      rounded-xl
      px-4
      py-3
      outline-none
      focus:ring-2
      focus:ring-blue-500
    "
                >
                  <option value="">Select month</option>

                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setOpen(false)}
                className="
                  px-4
                  py-2
                  border
                  rounded-xl
                  hover:bg-gray-100
                  transition
                  cursor-pointer
                "
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="
                  px-5
                  py-2
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:opacity-50
                  text-white
                  rounded-xl
                  transition
                  cursor-pointer
                "
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
