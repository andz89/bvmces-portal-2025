"use client";

import { useState } from "react";

import { BiPlus, BiEdit, BiUser, BiArchive } from "react-icons/bi";
import toast from "react-hot-toast";

import DeleteUserButton from "./DeleteUserButton";
import { toArchiveUser, getArchivedUsers } from "./actions";
import UserModal from "./UserModal";
import FullPageLoader from "@/app/components/loader/FullPageLoader";
import ArchiveUserModal from "./ArchiveUsersModal";
export default function UserTable({ users, profile }) {
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);

  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const gradeOrder = {
    kindergarten: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
  };
  const refresh = async () => {
    const res = await getArchivedUsers();

    if (res?.error) {
      return { error: true };
    }

    setArchivedUsers(res);

    return { success: true };
  };
  const handleGetArchiveUsers = async () => {
    setLoading(true);

    const res = await getArchivedUsers();

    if (res.error) {
      toast.error(res.error);
      return;
    }
    setLoading(false);

    setArchivedUsers(res);
    setOpenArchive(true);
  };
  const handleToArchiverUser = async (userId) => {
    try {
      setLoading(true);

      const res = await toArchiveUser(userId, true);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("User moved to archive successfully");
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong. Please reload the page.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="
      m-2
        bg-white
        border
        border-neutral-200
        rounded-[28px]
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
        overflow-hidden
      "
    >
      {loading && <FullPageLoader />}
      {/* Modal */}
      <UserModal
        open={open}
        onClose={() => setOpen(false)}
        user={selectedUser}
      />
      <ArchiveUserModal
        open={openArchive}
        onClose={() => setOpenArchive(false)}
        archivedUsers={archivedUsers}
        refresh={refresh}
      />
      {/* Header */}
      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
          px-6
          py-5
          border-b
          border-neutral-100
          bg-neutral-50/60
          backdrop-blur-sm
        "
      >
        {/* Left */}
        <div className="flex items-center gap-4">
          <div
            className="
              h-12
              w-12
              rounded-2xl
              bg-neutral-900
              text-white
              flex
              items-center
              justify-center
              shadow-sm
            "
          >
            <BiUser size={24} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              User Management
            </h2>

            <p className="text-sm text-neutral-500 mt-1">
              Manage system users and access permissions
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Add archived users*/}
          <button
            onClick={() => {
              handleGetArchiveUsers();
            }}
            className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-neutral-900
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-neutral-800
            shadow-sm
          "
          >
            <BiUser size={20} />

            <span>Archived</span>
          </button>
          {/* Add Button */}
          <button
            onClick={() => {
              setSelectedUser(null);

              setOpen(true);
            }}
            className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-neutral-900
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-neutral-800
            shadow-sm
          "
          >
            <BiPlus size={20} />

            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* Head */}
          <thead className="bg-neutral-50">
            <tr className="border-b border-neutral-200">
              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-neutral-500
                "
              >
                User
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-neutral-500
                "
              >
                Email
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-neutral-500
                "
              >
                Role
              </th>
              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-neutral-500
                "
              >
                Grade
              </th>
              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-neutral-500
                "
              >
                Grade Access
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-right
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-neutral-500
                "
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="
                  border-b
                  border-neutral-100
                  transition
                  hover:bg-neutral-50/70
                "
              >
                {/* User */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className="
                        h-11
                        w-11
                        rounded-2xl
                        bg-neutral-100
                        text-neutral-700
                        flex
                        items-center
                        justify-center
                        font-semibold
                        shrink-0
                      "
                    >
                      {user.full_name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                      <p className="font-medium text-neutral-900">
                        {user.full_name}
                      </p>

                      <p className="text-xs text-neutral-500 mt-1">
                        Active User
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-5">
                  <p className="text-sm text-neutral-700">{user.email}</p>
                </td>

                {/* Role */}
                <td className="px-6 py-5">
                  <span
                    className="
                      inline-flex
                      items-center
                      rounded-full
                      bg-neutral-100
                      px-3
                      py-1
                      text-xs
                      font-medium
                      capitalize
                      text-neutral-700
                    "
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span
                    className="
                      inline-flex
                      items-center
                      rounded-full
                      bg-neutral-100
                      px-3
                      py-1
                      text-xs
                      font-medium
                      capitalize
                      text-neutral-700
                    "
                  >
                    {user.grade}
                  </span>
                </td>
                {/* Grades */}
                <td className="px-6 py-5">
                  {user.role === "admin" ? (
                    <span
                      className="
        inline-flex
        items-center
        rounded-full
        md:bg-emerald-100
        px-3
        py-1
        text-xs
        font-semibold
        text-emerald-700
      "
                    >
                      All Access Granted
                    </span>
                  ) : user.role === "visitor" ? (
                    <span className="text-sm text-neutral-400">No Access</span>
                  ) : Array.isArray(user.gradeToEdit) &&
                    user.gradeToEdit.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {[...user.gradeToEdit]
                        .sort((a, b) => gradeOrder[a] - gradeOrder[b])
                        .map((grade) => (
                          <span
                            key={grade}
                            className="
            inline-flex
            items-center
            rounded-full
            bg-neutral-100
            px-3
            py-1
            text-xs
            font-medium
            text-neutral-700
          "
                          >
                            {grade.replace("-", " ").toUpperCase()}
                          </span>
                        ))}
                    </div>
                  ) : (
                    <span className="text-sm text-neutral-400">No Access</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={async () => {
                        handleToArchiverUser(user.id);
                      }}
                      className="
                      cursor-pointer
    inline-flex
    items-center
    gap-2
    rounded-xl
    border
    border-neutral-200
    bg-white
    px-4
    py-2
    text-sm
    font-medium
    text-neutral-500
    transition
    hover:bg-yellow-50
    hover:text-yellow-700
    hover:border-yellow-100
  "
                    >
                      <BiArchive size={18} />

                      <span>Archive</span>
                    </button>
                    {/* Edit */}
                    <button
                      onClick={() => {
                        setSelectedUser(user);

                        setOpen(true);
                      }}
                      className="
                      cursor-pointer
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-neutral-200
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-neutral-700
                        transition
                        hover:bg-neutral-100
                      "
                    >
                      <BiEdit size={18} />

                      <span>Edit</span>
                    </button>

                    {/* Delete */}

                    {profile.super_admin === true && (
                      <DeleteUserButton
                        className="
                        inline-flex
                        items-center
                        rounded-xl
                        border
                        border-neutral-200
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-neutral-500
                        transition
                        hover:bg-red-50
                        hover:text-red-600
                        hover:border-red-100
                      "
                        userId={user.id}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty */}
            {!users.length && (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="space-y-3">
                    <div
                      className="
                        mx-auto
                        h-16
                        w-16
                        rounded-3xl
                        bg-neutral-100
                        flex
                        items-center
                        justify-center
                        text-neutral-400
                      "
                    >
                      <BiUser size={30} />
                    </div>

                    <h3 className="text-xl font-semibold text-neutral-700">
                      No Users Found
                    </h3>

                    <p className="text-sm text-neutral-500">
                      No users have been added yet.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
