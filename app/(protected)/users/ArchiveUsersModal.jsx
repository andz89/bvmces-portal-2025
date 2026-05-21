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
        backdrop-blur-sm
        p-4
      "
    >
      {loading && <FullPageLoader />}

      <div
        className="
          w-full
          max-w-5xl
          rounded-[32px]
          bg-white
          shadow-[0_20px_80px_rgba(0,0,0,0.12)]
          border
          border-neutral-200
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
            border-neutral-100
            bg-neutral-50
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                h-12
                w-12
                rounded-2xl
                bg-yellow-100
                text-yellow-700
                flex
                items-center
                justify-center
              "
            >
              <BiArchive size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                Archived Users
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
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
              rounded-2xl
              border
              border-neutral-200
              flex
              items-center
              justify-center
              text-neutral-500
              hover:bg-neutral-100
              transition
            "
          >
            <BiX size={22} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral-50">
              <tr className="border-b border-neutral-200">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  User
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Role
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
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
                    border-neutral-100
                    hover:bg-neutral-50
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
                          rounded-2xl
                          bg-neutral-100
                          flex
                          items-center
                          justify-center
                          font-semibold
                          text-neutral-700
                        "
                      >
                        {user.full_name?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-neutral-900">
                          {user.full_name}
                        </p>

                        <p className="text-xs text-neutral-500 mt-1">
                          Archived User
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

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleToRestoreUser(user.id)}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-xl
                          bg-emerald-600
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-white
                          hover:bg-emerald-700
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
                          rounded-3xl
                          bg-neutral-100
                          flex
                          items-center
                          justify-center
                          text-neutral-400
                        "
                      >
                        <BiArchive size={30} />
                      </div>

                      <h3 className="text-xl font-semibold text-neutral-700">
                        No Archived Users
                      </h3>

                      <p className="text-sm text-neutral-500">
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
