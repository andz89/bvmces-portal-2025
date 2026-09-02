"use client";
import toast from "react-hot-toast";
import FullPageLoader from "@/app/components/loader/FullPageLoader";
import { useState } from "react";
import { BiArchive, BiX } from "react-icons/bi";
import { toArchiveUser } from "./actions";
export default function ArchiveUsersModal({
  open,
  onClose,
  archivedUsers = [],
  refresh,
}) {
  if (!open) return null;
  const [loading, setLoading] = useState(false);

  const handleToRestoreUser = async (userId) => {
    try {
      setLoading(true);

      const res = await toArchiveUser(userId, false);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      const updatedStatus = await refresh();

      if (updatedStatus?.error) {
        toast.error("Failed to refresh archived users.");
        return;
      }

      toast.success("User restored successfully");
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
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        
        p-4
      "
    >
      {loading && <FullPageLoader />}

      <div
        className="
          w-full
          max-w-5xl
          rounded-sm
          bg-white
          
          border
          border-lis-panel-border
          overflow-hidden
        "
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-lis-panel-border
            bg-lis-panel-header
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                h-12
                w-12
                rounded-sm
                bg-lis-warning-bg
                text-lis-warning-text
                flex
                items-center
                justify-center
              "
            >
              <BiArchive size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-lis-text">
                Archived Users
              </h2>

              <p className="text-sm text-lis-muted mt-1">
                Users moved to archive can no longer login.
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="
              h-11
              w-11
              rounded-sm
              border
              border-lis-panel-border
              flex
              items-center
              justify-center
              text-lis-muted
              hover:bg-lis-panel-header
              transition
            "
          >
            <BiX size={22} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-lis-panel-header">
              <tr className="border-b border-lis-panel-border">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-lis-muted">
                  User
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-lis-muted">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-lis-muted">
                  Role
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-lis-muted">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {archivedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="
                    border-b
                    border-lis-panel-border
                    hover:bg-lis-panel-header
                    transition
                  "
                >
                  {/* User */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          h-11
                          w-11
                          rounded-sm
                          bg-lis-panel-header
                          flex
                          items-center
                          justify-center
                          font-semibold
                          text-lis-text
                        "
                      >
                        {user.full_name?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-lis-text">
                          {user.full_name}
                        </p>

                        <p className="text-xs text-lis-muted mt-1">
                          Archived User
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

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleToRestoreUser(user.id)}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-sm
                          bg-lis-success
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-white
                          hover:bg-lis-success-hover
                          transition
                        "
                      >
                        Restore User
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!archivedUsers.length && (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
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
                        <BiArchive size={30} />
                      </div>

                      <h3 className="text-xl font-semibold text-lis-text">
                        No Archived Users
                      </h3>

                      <p className="text-sm text-lis-muted">
                        Archived users will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
