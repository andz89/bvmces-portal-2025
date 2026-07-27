import React, { useEffect, useRef, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { updateLessonPlanStatus } from "./actions";

const status = ({ plan, profile, setUpdateLessonPlan }) => {
  const [activeStatus, setActiveStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveStatus(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleUpdate = async (status) => {
    if (status === plan.status) {
      setActiveStatus(null);
      return;
    }
    setLoading(true);
    setActiveStatus(null);
    await updateLessonPlanStatus(plan.file_id, status, profile.full_name);

    setUpdateLessonPlan((prev) =>
      prev.map((item) =>
        item.file_id === plan.file_id
          ? {
              ...item,
              status,
              checkedBy: status === "CHECKED" ? profile.full_name : "",
            }
          : item,
      ),
    );

    setLoading(false);
  };

  return (
    <div ref={menuRef} className="flex flex-col gap-1">
      <div className="  w-30">
        <button
          disabled={loading}
          className={`cursor-pointer   rounded-lg text-sm  uppercase   px-3 py-2  ${
            plan.status === "CHECKED"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
          onClick={() => {
            if (profile.role !== "admin") return;
            setActiveStatus((prev) =>
              prev === plan.file_id ? null : plan.file_id,
            );
          }}
        >
          {loading ? "Updating... " : plan.status ? plan.status : "Pending"}{" "}
          {plan.status === "CHECKED" && !loading && <span>BY:</span>}
          {plan.status === "CHECKED" && !loading && (
            <span className=" flex items-center gap-1  text-neutral-500">
              <span
                title={plan.checkedBy}
                className="max-w-20 truncate  text-neutral-700"
              >
                {plan.checkedBy}
              </span>
            </span>
          )}
        </button>

        <div className="relative z-51">
          {activeStatus === plan.file_id && (
            <div className="absolute -right-3  w-30 z-100  -mt-19 rounded border border-neutral-200 bg-white shadow-sm flex flex-col items-start    py-1  text-sm">
              <button
                onClick={() => handleUpdate("PENDING")}
                className="hover:bg-slate-100 px-3 cursor-pointer w-full py-[2px] text-left"
              >
                Pending
              </button>

              <button
                onClick={() => handleUpdate("CHECKED")}
                className="hover:bg-slate-100 px-3  cursor-pointer w-full py-[2px] text-left"
              >
                Checked
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default status;
