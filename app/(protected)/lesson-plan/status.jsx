import React, { useEffect, useRef, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { updateLessonPlanStatus } from "./actions";

const status = ({ plan, profile, setUpdateLessonPlan }) => {
  const [activeStatus, setActiveStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryStatus, setRetryStatus] = useState(null);
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

    try {
      setLoading(true);
      setError("");
      setRetryStatus(status);
      setActiveStatus(null);

      const result = await updateLessonPlanStatus(
        plan.file_id,
        status,
        profile.full_name,
      );

      if (result.status !== "success") {
        throw new Error(result.message || "Unable to update lesson plan.");
      }

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

      setRetryStatus(null);
      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  if (error) {
    return (
      <div className="mt-2 rounded-md bg-red-50 px-2 py-1 w-27">
        <p className="text-xs text-red-600 truncate">{error}</p>

        <button
          onClick={() => handleUpdate(retryStatus)}
          disabled={loading}
          className="mt-1 text-xs font-medium text-white hover:underline disabled:opacity-50 bg-red-400 rounded  py-1 px-2"
        >
          {loading ? "Retrying..." : "Try Again"}
        </button>
      </div>
    );
  }

  return (
    <div ref={menuRef} className="flex flex-col gap-1">
      <div className="  w-30">
        <button
          disabled={loading}
          className={`cursor-pointer   rounded-lg text-xs  uppercase   px-3 py-2  ${
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
            <div className="absolute -right-0 w-30 z-100  -mt-29 rounded border border-neutral-200 bg-white shadow-sm flex flex-col items-start    py-1  text-sm">
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
