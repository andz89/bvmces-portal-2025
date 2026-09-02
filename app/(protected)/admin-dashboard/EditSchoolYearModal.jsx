"use client";

import { useState, useTransition } from "react";

import { BiCalendar, BiEditAlt, BiX } from "react-icons/bi";

import { updateSchoolYear } from "./actions";

import { toast } from "react-hot-toast";

export default function EditSchoolYearModal({ item }) {
  const [open, setOpen] = useState(false);

  const [yearLabel] = useState(item.year_label || "");

  const [status, setStatus] = useState(item.status || "");

  const [activeMonth, setActiveMonth] = useState(item.active_month || "");

  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await updateSchoolYear({
        id: item.id,
        active_month: activeMonth,
      });

      if (res.error) {
        toast.error(res.error);

        return;
      }

      toast.success("School year updated");

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
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="
          inline-flex
          items-center
          gap-2
          rounded-sm
          border
          border-lis-panel-border
          bg-white
          px-4
          py-2.5
          text-sm
          font-medium
          text-lis-text
          transition
          hover:bg-lis-panel-header
        "
      >
        <BiEditAlt size={18} />

        <span>Edit</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          {/* Overlay */}
          <div
            className="
              fixed
              inset-0
              bg-black/30
              
            "
            onClick={() => setOpen(false)}
          />

          {/* Content */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="
                w-full
                max-w-xl
                rounded-sm
                border
                border-lis-panel-border
                bg-white
                
                overflow-hidden
              "
            >
              {/* Header */}
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                  border-b
                  border-lis-panel-border
                  px-7
                  py-6
                "
              >
                <div className="flex items-start gap-4">
                  <div
                    className="
                      h-14
                      w-14
                      rounded-sm
                      bg-lis-panel-header
                      text-lis-text
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <BiCalendar size={26} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-lis-text">
                      Edit School Year
                    </h2>

                    <p className="text-sm text-lis-muted mt-1">
                      Update school year details and settings.
                    </p>
                  </div>
                </div>

                {/* Close */}
                <button
                  onClick={() => setOpen(false)}
                  className="
                    h-10
                    w-10
                    rounded-sm
                    border
                    border-lis-panel-border
                    flex
                    items-center
                    justify-center
                    text-lis-muted
                    transition
                    hover:bg-lis-panel-header
                    hover:text-lis-text
                  "
                >
                  <BiX size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="px-7 py-7 space-y-6">
                {/* Year */}
                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-lis-text
                    "
                  >
                    School Year
                  </label>

                  <input
                    type="text"
                    readOnly
                    value={yearLabel}
                    className="
                      w-full
                      rounded-sm
                      border
                      border-lis-panel-border
                      bg-lis-panel-header
                      px-4
                      py-3.5
                      text-sm
                      text-lis-text
                      outline-none
                    "
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-lis-text
                    "
                  >
                    Status
                  </label>

                  <input
                    type="text"
                    readOnly
                    value={status}
                    className="
                      w-full
                      rounded-sm
                      border
                      border-lis-panel-border
                      bg-lis-panel-header
                      px-4
                      py-3.5
                      text-sm
                      text-lis-text
                      outline-none
                    "
                  />
                </div>

                {/* Month */}
                <div>
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-lis-text
                    "
                  >
                    Enrollment Reference Month
                  </label>

                  <select
                    value={activeMonth}
                    onChange={(e) => setActiveMonth(e.target.value)}
                    className="
                      w-full
                      rounded-sm
                      border
                      border-lis-panel-border
                      bg-white
                      px-4
                      py-3.5
                      text-sm
                      text-lis-text
                      outline-none
                      transition
                      focus:border-lis-primary
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
              <div
                className="
                  flex
                  flex-col-reverse
                  sm:flex-row
                  sm:items-center
                  sm:justify-end
                  gap-3
                  border-t
                  border-lis-panel-border
                  px-7
                  py-5
                  bg-lis-panel-header
                "
              >
                {/* Cancel */}
                <button
                  onClick={() => setOpen(false)}
                  className="
                    w-full
                    sm:w-auto
                    rounded-sm
                    border
                    border-lis-panel-border
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-lis-text
                    transition
                    hover:bg-lis-panel-header
                  "
                >
                  Cancel
                </button>

                {/* Save */}
                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="
                    w-full
                    sm:w-auto
                    rounded-sm
                    bg-lis-primary
                    px-6
                    py-3
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-lis-primary
                    disabled:opacity-60
                  "
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
