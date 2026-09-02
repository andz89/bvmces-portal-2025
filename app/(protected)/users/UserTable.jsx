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
        border-lis-panel-border
        rounded-sm
        
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
          border-lis-panel-border
          bg-lis-panel-header/60
          
        "
      >
        {/* Left */}
        <div className="flex items-center gap-4">
          <div
            className="
              h-12
              w-12
              rounded-sm
              bg-lis-primary
              text-white
              flex
              items-center
              justify-center
              
            "
          >
            <BiUser size={24} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-lis-text">
              User Management
            </h2>

            <p className="text-sm text-lis-muted mt-1">
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
            rounded-sm
            bg-lis-primary
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-lis-primary
            
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
            rounded-sm
            bg-lis-primary
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-lis-primary
            
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
          <thead className="bg-lis-panel-header">
            <tr className="border-b border-lis-panel-border">
              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-lis-muted
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
                  text-lis-muted
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
                  text-lis-muted
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
                  text-lis-muted
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
                  text-lis-muted
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
                  text-lis-muted
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
                  border-lis-panel-border
                  transition
                  hover:bg-lis-panel-header/70
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
                        rounded-sm
                        bg-lis-panel-header
                        text-lis-text
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
                      <p className="font-medium text-lis-text">
                        {user.full_name}
                      </p>

                      <p className="text-xs text-lis-muted mt-1">
                        Active User
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-5">
                  <p className="text-sm text-lis-text">{user.email}</p>
                </td>

                {/* Role */}
                <td className="px-6 py-5">
                  <span
                    className="
                      inline-flex
                      items-center
                      rounded-full
                      bg-lis-panel-header
                      px-3
                      py-1
                      text-xs
                      font-medium
                      capitalize
                      text-lis-text
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
                      bg-lis-panel-header
                      px-3
                      py-1
                      text-xs
                      font-medium
                      capitalize
                      text-lis-text
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
        md:bg-lis-panel-header
        px-3
        py-1
        text-xs
        font-semibold
        text-lis-success-text
      "
                    >
                      All Access Granted
                    </span>
                  ) : user.role === "visitor" ? (
                    <span className="text-sm text-lis-muted">No Access</span>
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
            bg-lis-panel-header
            px-3
            py-1
            text-xs
            font-medium
            text-lis-text
          "
                          >
                            {grade.replace("-", " ").toUpperCase()}
                          </span>
                        ))}
                    </div>
                  ) : (
                    <span className="text-sm text-lis-muted">No Access</span>
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
    rounded-sm
    border
    border-lis-panel-border
    bg-white
    px-4
    py-2
    text-sm
    font-medium
    text-lis-muted
    transition
    hover:bg-lis-warning-bg
    hover:text-lis-warning-text
    hover:border-lis-warning-border
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
                        rounded-sm
                        border
                        border-lis-panel-border
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-lis-text
                        transition
                        hover:bg-lis-panel-header
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
                        rounded-sm
                        border
                        border-lis-panel-border
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-lis-muted
                        transition
                        hover:bg-lis-danger-bg
                        hover:text-lis-danger-text
                        hover:border-lis-danger-border
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
                        rounded-sm
                        bg-lis-panel-header
                        flex
                        items-center
                        justify-center
                        text-lis-muted
                      "
                    >
                      <BiUser size={30} />
                    </div>

                    <h3 className="text-xl font-semibold text-lis-text">
                      No Users Found
                    </h3>

                    <p className="text-sm text-lis-muted">
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
