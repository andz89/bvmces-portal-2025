"use client";
import { useState, useEffect } from "react";
import Form from "./Form.jsx";
import { BiPlus, BiSolidTrash, BiEdit, BiLinkAlt } from "react-icons/bi";
import QuarterTable from "./QuarterTable.jsx";

const MPSClient = ({ profile, mps, school_year }) => {
  const [initialData, setInitialData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  useEffect(() => {
    if (successMessage) {
      setOpenForm(false);
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  // ✅ Group by quarter
  const groupedByQuarter = mps.reduce((acc, item) => {
    const quarter = item.quarter || "No Quarter";

    if (!acc[quarter]) {
      acc[quarter] = [];
    }

    acc[quarter].push(item);

    return acc;
  }, {});
  return (
    <div className="mb-15">
      {openForm && (
        <Form
          key={initialData?.id || "create"}
          initialData={initialData}
          setInitialData={setInitialData}
          setOpenForm={setOpenForm}
          setSuccessMessage={setSuccessMessage}
          school_year={school_year}
        />
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl">
          {successMessage}
        </div>
      )}
      <div className="w-full mx-auto py-8 px-4">
        <div className="flex flex-col items-center text-center md:text-left md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">MPS</h1>

            <p className="text-slate-700 text-lg mt-1 font-bold">
              {school_year}
            </p>
          </div>

          {profile.role === "admin" && (
            <button
              onClick={() => {
                setInitialData(null);
                setOpenForm(true);
              }}
              className="flex items-center justify-center px-4 py-2 text-white rounded bg-slate-800 cursor-pointer w-30"
            >
              <BiPlus /> Add File
            </button>
          )}
        </div>
      </div>
      {/* ✅ Separate by quarter */}
      <div className="space-y-8 ">
        {Object.entries(groupedByQuarter).map(([quarter, data]) => (
          <div key={quarter}>
            <QuarterTable
              title={`Quarter ${quarter}`}
              mps={[...data].sort((a, b) => Number(a.grade) - Number(b.grade))}
              profile={profile}
              deleteId={deleteId}
              setDeleteId={setDeleteId}
              setInitialData={setInitialData}
              setOpenForm={setOpenForm}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MPSClient;
