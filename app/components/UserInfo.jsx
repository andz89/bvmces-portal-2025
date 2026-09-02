"use client";

import React, { useState } from "react";
import Link from "next/link";
import { logout } from "@/app/login/actions";
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
          h-10
          w-10
          rounded-full
          bg-lis-primary
          text-white
          hover:bg-lis-primary-hover
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
          rounded-sm
          border
          border-lis-panel-border
          bg-white
          p-1
          
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
        <div className="bg-lis-panel-header hover:bg-lis-tab-active rounded-sm p-1">
          <div className="flex items-center gap-3 rounded-sm px-2 py-3 text-sm text-lis-text transition">
            <div className="min-w-0 leading-tight flex flex-col">
              <div className="flex items-center mb-1">
                <div
                  className="
                    rounded-sm
                    bg-lis-primary
                    px-2
                    py-1
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-white
                  "
                >
                  {profile?.role}
                </div>
              </div>

              <p className="truncate text-sm font-semibold text-lis-text uppercase">
                {profile?.full_name}
              </p>

              <p className="truncate text-sm font-semibold text-lis-text">
                {profile?.email}
              </p>

              {Array.isArray(profile.gradeToEdit) &&
                profile.gradeToEdit.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-sm text-lis-text mt-1">
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
                  rounded-sm
                  text-sm
                  bg-lis-primary
                  hover:bg-lis-primary-hover
                  px-3
                  py-1
                  font-medium
                  text-white
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
