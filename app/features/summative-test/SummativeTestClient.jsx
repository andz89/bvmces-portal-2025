"use client";

import { useState, useEffect } from "react";
import SummativeTestForm from "./SummativeTestForm";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import SearchInput from "../reports/SearchInput";
import {
  BiPlus,
  BiSolidTrash,
  BiEdit,
  BiLinkAlt,
  BiCopy,
} from "react-icons/bi";
import { getSummativeTests, deleteSummativeTest } from "./actions";
import toast from "react-hot-toast";
import FullPageLoader from "@/app/components/loader/FullPageLoader";

export default function SummativeTestClient({ profile, records }) {
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState(records ?? []);
  const [searchTerm, setSearchTerm] = useState("");
  const [term, setTerm] = useState("1");

  const refreshRecords = async () => {
    setLoading(true);

    try {
      const res = await getSummativeTests();
      setItems(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Unable to refresh the list.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openForm]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      setDeleteError("");

      const result = await deleteSummativeTest(deleteId);

      if (result?.error) {
        setDeleteError(result.error);
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      setDeleteError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const sortedItems = (Array.isArray(items) ? items : [])
    .filter((item) => String(item.term) === String(term))
    .filter((item) => {
      if (!searchTerm) return true;
      const t = searchTerm.toLowerCase();
      return (
        item.title?.toLowerCase().includes(t) ||
        item.description?.toLowerCase().includes(t)
      );
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="min-h-screen bg-gray-50">
      {openForm && (
        <SummativeTestForm
          key={editingRecord?.id || "create"}
          editingRecord={editingRecord}
          setEditingRecord={setEditingRecord}
          setOpenForm={setOpenForm}
          refreshRecords={refreshRecords}
        />
      )}

      {loading && <FullPageLoader />}

      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Summative Test
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Submit your Summative Test and TOS files here.
              </p>
            </div>

            {profile?.grade && (
              <button
                onClick={() => {
                  setEditingRecord(null);
                  setOpenForm(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 cursor-pointer"
              >
                <BiPlus size={18} />
                Submit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 py-6">
        <div className="mb-4 flex items-center md:justify-between md:flex-row flex-col gap-2">
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-40 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-400"
          >
            <option value="1">Term 1</option>
            <option value="2">Term 2</option>
            <option value="3">Term 3</option>
          </select>

          <SearchInput
            onSearch={(keyword) => setSearchTerm(keyword)}
            onClear={() => {
              setSearchTerm("");
              refreshRecords();
            }}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
            <div className="text-sm font-medium text-gray-700">
              Term {term}
            </div>
            <div className="text-xs text-gray-500">
              {sortedItems.length} submission
              {sortedItems.length === 1 ? "" : "s"}
            </div>
          </div>

          {sortedItems.length === 0 ? (
            <div className="py-16 text-center">
              <h3 className="text-sm font-medium text-gray-700">
                No submissions yet
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                Submitted summative tests for this term will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr className="text-left text-gray-500 text-xs uppercase tracking-wide">
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-5 py-3 font-medium">Grade</th>
                    <th className="px-5 py-3 font-medium">Subject</th>
                    <th className="px-5 py-3 font-medium">Term</th>
                    <th className="px-5 py-3 font-medium">School Year</th>
                    <th className="px-5 py-3 font-medium">Submitted By</th>
                    <th className="px-5 py-3 font-medium">Files</th>
                    <th className="px-5 py-3 font-medium text-center">--</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {sortedItems.map((item) => (
                    <tr key={item.id} className="text-sm hover:bg-gray-50 transition">
                      <td className="px-5 py-4 max-w-60">
                        <div className="font-medium text-gray-900 break-words">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="mt-1 text-xs text-gray-400 break-words">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-600">{item.grade}</td>
                      <td className="px-5 py-4 text-gray-600">{item.subject}</td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          {item.term}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">{item.school_year}</td>
                      <td className="px-5 py-4 max-w-40 break-all text-gray-500">
                        {item.owner_email}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          {item.link && (
                            <FileLink label="Summative Test" href={item.link} />
                          )}
                          {item.link2 && <FileLink label="TOS" href={item.link2} />}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {profile?.id === item.owner_id && (
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => {
                                setEditingRecord(item);
                                setOpenForm(true);
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                            >
                              <BiEdit size={16} />
                            </button>

                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
                            >
                              <BiSolidTrash size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        open={!!deleteId}
        loading={deleting}
        error={deleteError}
        onCancel={() => {
          if (deleting) return;
          setDeleteError("");
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function FileLink({ label, href }) {
  return (
    <div className="flex items-center gap-1">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 transition hover:text-gray-900"
      >
        <BiLinkAlt size={13} />
        {label}
      </a>
      <button
        title="Copy link"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(href);
            toast.success("Link copied!");
          } catch (error) {
            console.error(error);
            toast.error("Failed to copy link.");
          }
        }}
        className="flex p-1 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
      >
        <BiCopy size={12} />
      </button>
    </div>
  );
}
