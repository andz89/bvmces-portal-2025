"use client";

import { useState, useEffect } from "react";
import Form from "./Form.jsx";
import { BiPlus, BiTable, BiGridAlt } from "react-icons/bi";
import TermTable from "./TermTable.jsx";
import ConsolidatedTable from "./ConsolidatedTable.jsx";

const EXAM_ORDER = ["ST1", "ST2", "Test Exam"];
const TERMS = ["1", "2", "3"];

const MPSTermClient = ({ profile, mps, school_year, classData }) => {
  const [initialData, setInitialData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [viewMode, setViewMode] = useState(true);
  const [activeTerm, setActiveTerm] = useState("1");

  useEffect(() => {
    if (successMessage) {
      setOpenForm(false);

      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Group by term, then by examination type
  const groupedByTerm = mps.reduce((acc, item) => {
    const term = item.term || "No Term";

    if (!acc[term]) {
      acc[term] = {};
    }

    const examType = item.exam_type || "Test Exam";

    if (!acc[term][examType]) {
      acc[term][examType] = [];
    }

    acc[term][examType].push(item);

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-lis-bg pb-20 w-full">
      {/* Form */}
      {openForm && (
        <Form
          key={initialData?.id || "create"}
          initialData={initialData}
          setInitialData={setInitialData}
          setOpenForm={setOpenForm}
          setSuccessMessage={setSuccessMessage}
          school_year={school_year}
          classData={classData}
        />
      )}

      {/* Success */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div
            className="
              rounded-sm
              border
              border-lis-panel-border
              bg-lis-panel-header
              px-5
              py-4
              text-lis-success-text
              
            "
          >
            {successMessage}
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden bg-lis-primary    w-full">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full "></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-lis-panel-header/10 rounded-full "></div>

        <div className="relative   mx-auto px-4 md:px-10 py-10">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            {/* Left */}
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/10
                  bg-white/10
                  
                  px-4
                  py-1.5
                  text-white
                  text-sm
                  mb-5
                "
              >
                Monitoring Progress Summary
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                MPS Term Dashboard
              </h1>

              <p className="text-white/80 text-base mt-3 max-w-2xl">
                Monitor academic performance by term and examination type,
                analyze learner achievement, and manage school reports
                efficiently.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-8">
                <div
                  className="
                    bg-white/10
                    
                    border
                    border-white/10
                    rounded-sm
                    px-5
                    py-4
                    min-w-[170px]
                  "
                >
                  <p className="text-xs uppercase tracking-wide text-white/80">
                    School Year
                  </p>

                  <h3 className="text-xl font-bold text-white mt-1">
                    {school_year}
                  </h3>
                </div>

                <div
                  className="
                    bg-white/10
                    
                    border
                    border-white/10
                    rounded-sm
                    px-5
                    py-4
                    min-w-[170px]
                  "
                >
                  <p className="text-xs uppercase tracking-wide text-white/80">
                    Total Files
                  </p>

                  <h3 className="text-2xl font-bold text-white mt-1">
                    {mps.length}
                  </h3>
                </div>

                <div
                  className="
                    bg-white/10
                    
                    border
                    border-white/10
                    rounded-sm
                    px-5
                    py-4
                    min-w-[170px]
                  "
                >
                  <p className="text-xs uppercase tracking-wide text-white/80">
                    View Mode
                  </p>

                  <h3 className="text-lg font-bold text-white mt-1">
                    {viewMode ? "Individual" : "Consolidated"}
                  </h3>
                </div>
              </div>
            </div>

            {/* Right Card */}
            {profile.role === "admin" && (
              <div
                className="
                  bg-white/10
                  
                  border
                  border-white/10
                  rounded-sm
                  p-6
                  
                  w-full
                  max-w-sm
                "
              >
                <h2 className="text-white text-xl font-bold">Quick Action</h2>

                <p className="text-white/80 text-sm mt-1">
                  Upload and manage MPS Term reports for all classes.
                </p>

                <button
                  onClick={() => {
                    setInitialData(null);
                    setOpenForm(true);
                  }}
                  className="
                    mt-5
                    w-full
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-sm
                    bg-white
                    px-5
                    py-3
                    text-lis-text
                    font-semibold
                    
                    transition
                    hover:scale-[1.02]
                  "
                >
                  <BiPlus size={22} />

                  <span>Add New File</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full mx-auto px-4 md:px-10 py-8">
        {/* Term Tabs */}
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
            mb-6
            border-b
            border-lis-panel-border
            pb-1
          "
        >
          {TERMS.map((term) => {
            const count = Object.values(groupedByTerm[term] || {}).reduce(
              (sum, arr) => sum + arr.length,
              0,
            );

            const isActive = activeTerm === term;

            return (
              <button
                key={term}
                onClick={() => setActiveTerm(term)}
                className={`
                  inline-flex
                  items-center
                  gap-2
                  rounded-t-2xl
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  border-b-2
                  ${
                    isActive
                      ? "border-lis-panel-border text-lis-link bg-lis-panel-header/60"
                      : "border-transparent text-lis-muted hover:text-lis-text hover:bg-lis-panel-header"
                  }
                `}
              >
                <span>Term {term}</span>

                <span
                  className={`
                    inline-flex
                    items-center
                    justify-center
                    min-w-[22px]
                    h-[22px]
                    rounded-full
                    text-xs
                    font-bold
                    px-1.5
                    ${
                      isActive
                        ? "bg-lis-primary text-white"
                        : "bg-lis-panel-header text-lis-muted"
                    }
                  `}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toggle */}
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
            mb-8
          "
        >
          <button
            onClick={() => setViewMode(true)}
            className={`
              inline-flex
              items-center
              gap-2
              rounded-sm
              px-5
              py-3
              text-sm
              font-semibold
              transition-all
              duration-200
              
              ${
                viewMode
                  ? "bg-lis-primary   text-white "
                  : "bg-white border border-lis-panel-border text-lis-text hover:bg-lis-panel-header"
              }
            `}
          >
            <BiTable size={18} />

            <span>Individual Result</span>
          </button>

          <button
            onClick={() => setViewMode(false)}
            className={`
              inline-flex
              items-center
              gap-2
              rounded-sm
              px-5
              py-3
              text-sm
              font-semibold
              transition-all
              duration-200
              
              ${
                !viewMode
                  ? "bg-lis-primary   text-white "
                  : "bg-white border border-lis-panel-border text-lis-text hover:bg-lis-panel-header"
              }
            `}
          >
            <BiGridAlt size={18} />

            <span>Consolidated Result</span>
          </button>
        </div>

        {/* Term Tables */}
        <div className="space-y-8 w-full">
          {(() => {
            const examGroups = groupedByTerm[activeTerm] || {};

            const sortedExamTypes = Object.keys(examGroups).sort(
              (a, b) => EXAM_ORDER.indexOf(a) - EXAM_ORDER.indexOf(b),
            );

            const hasRecords = sortedExamTypes.length > 0;

            return (
              <>
                {sortedExamTypes.map((examType) => (
                  <div key={`${activeTerm}-${examType}`}>
                    {viewMode ? (
                      <TermTable
                        title={`Term ${activeTerm} — ${examType}`}
                        mps={[...examGroups[examType]].sort(
                          (a, b) => Number(a.class.grade) - Number(b.class.grade),
                        )}
                        profile={profile}
                        setInitialData={setInitialData}
                        setOpenForm={setOpenForm}
                        school_year={school_year}
                      />
                    ) : (
                      <ConsolidatedTable
                        title={`Term ${activeTerm} — ${examType}`}
                        mps={[...examGroups[examType]].sort(
                          (a, b) => Number(a.class.grade) - Number(b.class.grade),
                        )}
                      />
                    )}
                  </div>
                ))}

                {/* Empty */}
                {!hasRecords && (
                  <div
                    className="
                      bg-white
                      border
                      border-lis-panel-border
                      rounded-sm
                      p-16
                      text-center
                      
                    "
                  >
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-lis-text">
                        No Term {activeTerm} Files Yet
                      </h3>

                      <p className="text-lis-muted max-w-md mx-auto">
                        Upload a Monitoring Progress Summary report for Term{" "}
                        {activeTerm} to begin tracking learner performance.
                      </p>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default MPSTermClient;
