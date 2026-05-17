"use client";

import React, { useState } from "react";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { BiLogOut } from "react-icons/bi";

const UserInfo = ({ profile }) => {
  const [open, setOpen] = useState(false);

  const gradeOrder = {
    kindergarten: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
  };

  return (
    <div className="relative group z-[9999]">
      {/* Avatar */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          cursor-pointer
          shadow-sm
          h-10
          w-10
          rounded-3xl
          bg-slate-800
          text-white
          hover:bg-slate-900
          flex
          items-center
          justify-center
          font-semibold
          shrink-0
          uppercase
        "
      >
        {profile.full_name?.charAt(0)}
      </button>

      {/* Dropdown */}
      <div
        className={`
          absolute
          right-0
          top-[120%]
          z-[9999]
          w-60
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-1
          shadow-2xl
          transition-all
          duration-200

          group-hover:visible
          group-hover:translate-y-0
          group-hover:opacity-100

          ${
            open
              ? "visible opacity-100 translate-y-0"
              : "invisible opacity-0 translate-y-2"
          }
        `}
      >
        <div className="bg-slate-100 hover:bg-slate-200 rounded-2xl p-1">
          <div className="flex items-center gap-3 rounded-xl px-2 py-3 text-sm text-slate-700 transition">
            <div className="min-w-0 leading-tight flex flex-col">
              <div className="flex items-center mb-1">
                <div
                  className="
                    rounded-full
                    bg-blue-900
                    px-2
                    py-1
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-200
                  "
                >
                  {profile?.role}
                </div>
              </div>

              <p className="truncate text-sm font-semibold text-slate-800 uppercase">
                {profile?.full_name}
              </p>

              <p className="truncate text-sm font-semibold text-slate-800">
                {profile?.email}
              </p>

              {Array.isArray(profile.gradeToEdit) &&
                profile.gradeToEdit.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-sm text-slate-800 mt-1">
                    <span className="font-medium">Grade access:</span>

                    <span>
                      {[...profile.gradeToEdit]
                        .sort((a, b) => gradeOrder[a] - gradeOrder[b])
                        .map((grade, index, arr) => (
                          <span key={grade}>
                            {grade}
                            {index !== arr.length - 1 && ", "}
                          </span>
                        ))}
                    </span>
                  </div>
                )}
            </div>
          </div>

          <div className="m-2">
            <form>
              <button
                formAction={logout}
                className="
                  flex
                  cursor-pointer
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  text-sm
                  bg-slate-800
                  hover:bg-slate-900
                  px-3
                  py-1
                  font-medium
                  text-white
                  shadow-lg
                  transition
                "
              >
                <BiLogOut size={18} />
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
