"use client";

import { React, useState } from "react";

import { BiPlus, BiTable, BiGridAlt, BiBarChartAlt2 } from "react-icons/bi";

import BulkAddGPAModal from "./BulkAddGPAModal";
import GPATable from "./GPATable";
import ConsolidatedGradeTable from "./ConsolidatedGradeTable";
import EditGPAModal from "./EditGPAModal";

const GPAClient = ({ school_year, profile, gpa, classData }) => {
  const [initialData, setInitialData] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  const [openBulkAddModal, setOpenBulkAddModal] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [showConsolidated, setShowConsolidated] = useState(false);

  // Group by quarter and section
  const groupedData = gpa.reduce((acc, item) => {
    let quarter = item.quarter || "No Quarter";

    const quarterMatch = quarter.toString().match(/\d+/);

    const normalizedQuarter = quarterMatch ? quarterMatch[0] : quarter;

    const section = item.class.section || "No Section";

    if (!acc[normalizedQuarter]) {
      acc[normalizedQuarter] = {};
    }

    if (!acc[normalizedQuarter][section]) {
      acc[normalizedQuarter][section] = [];
    }

    acc[normalizedQuarter][section].push(item);

    return acc;
  }, {});

  // Consolidated
  const consolidatedData = gpa.reduce((acc, item) => {
    let quarter = item.quarter || "No Quarter";

    const quarterMatch = quarter.toString().match(/\d+/);

    const normalizedQuarter = quarterMatch ? quarterMatch[0] : quarter;

    const grade = item.class.grade || "No Grade";

    if (!acc[normalizedQuarter]) {
      acc[normalizedQuarter] = {};
    }

    if (!acc[normalizedQuarter][grade]) {
      acc[normalizedQuarter][grade] = [];
    }

    acc[normalizedQuarter][grade].push(item);

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#f4f7fb] pb-20">
      {/* Edit Modal */}
      <EditGPAModal
        openEdit={openEdit}
        onClose={() => setOpenEdit(false)}
        initialData={initialData}
        school_year={school_year}
        classData={classData}
      />

      {/* Bulk Add */}
      <BulkAddGPAModal
        classData={classData}
        open={openBulkAddModal}
        onClose={() => setOpenBulkAddModal(false)}
        school_year={school_year}
      />

      {/* Hero */}
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl"></div>

        <div className="relative w-full mx-auto px-4 md:px-10 py-10">
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
            backdrop-blur-md
            px-4
            py-1.5
            text-white
            text-sm
            mb-5
          "
              >
                Grade Performance Analysis
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                GPA Dashboard
              </h1>

              <p className="text-emerald-100 text-base mt-3 max-w-2xl">
                Analyze learner performance, monitor grade trends, and manage
                GPA reports efficiently.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-8">
                <div
                  className="
              bg-white/10
              backdrop-blur-xl
              border
              border-white/10
              rounded-2xl
              px-5
              py-4
              min-w-[170px]
            "
                >
                  <p className="text-xs uppercase tracking-wide text-emerald-100">
                    School Year
                  </p>

                  <h3 className="text-xl font-bold text-white mt-1">
                    {school_year}
                  </h3>
                </div>

                <div
                  className="
              bg-white/10
              backdrop-blur-xl
              border
              border-white/10
              rounded-2xl
              px-5
              py-4
              min-w-[170px]
            "
                >
                  <p className="text-xs uppercase tracking-wide text-emerald-100">
                    GPA Records
                  </p>

                  <h3 className="text-2xl font-black text-white mt-1">
                    {gpa.length}
                  </h3>
                </div>

                <div
                  className="
              bg-white/10
              backdrop-blur-xl
              border
              border-white/10
              rounded-2xl
              px-5
              py-4
              min-w-[170px]
            "
                >
                  <p className="text-xs uppercase tracking-wide text-emerald-100">
                    View Mode
                  </p>

                  <h3 className="text-lg font-bold text-white mt-1">
                    {showConsolidated ? "Consolidated" : "Individual"}
                  </h3>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div
              className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/10
          rounded-3xl
          p-6
          shadow-2xl
          w-full
          max-w-sm
        "
            >
              <h2 className="text-white text-xl font-bold">Quick Actions</h2>

              <p className="text-emerald-100 text-sm mt-1">
                Manage GPA records and consolidated reports.
              </p>

              <div className="space-y-3 mt-5">
                {/* Toggle */}
                <button
                  onClick={() => setShowConsolidated(!showConsolidated)}
                  className="
              w-full
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-white/10
              border
              border-white/10
              px-5
              py-3
              text-white
              font-semibold
              hover:bg-white/20
              transition
            "
                >
                  {showConsolidated ? (
                    <BiTable size={20} />
                  ) : (
                    <BiGridAlt size={20} />
                  )}

                  <span>
                    {showConsolidated ? "Show Individual" : "Show Consolidated"}
                  </span>
                </button>

                {/* Add */}
                <button
                  onClick={() => setOpenBulkAddModal(true)}
                  className="
              w-full
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-white
              px-5
              py-3
              text-emerald-700
              font-semibold
              shadow-lg
              hover:scale-[1.02]
              transition
            "
                >
                  <BiPlus size={22} />

                  <span>Add GPA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full mx-auto px-4 md:px-10 py-8">
        <div className="space-y-12">
          {Object.entries(showConsolidated ? consolidatedData : groupedData)
            .sort(([quarterA], [quarterB]) => {
              const numA = parseInt(quarterA.match(/\d+/)?.[0] || 0);

              const numB = parseInt(quarterB.match(/\d+/)?.[0] || 0);

              return numA - numB;
            })
            .map(([quarter, gradeSectionData]) => (
              <div key={quarter} className="space-y-6">
                {/* Quarter Header */}
                <div className="flex items-center gap-4">
                  <div
                    className="
                      h-14
                      w-14
                      rounded-2xl
                      bg-gradient-to-r
                      from-indigo-600
                      to-blue-600
                      text-white
                      flex
                      items-center
                      justify-center
                      shadow-lg
                    "
                  >
                    <BiBarChartAlt2 size={28} />
                  </div>

                  <div>
                    <h2 className="text-3xl font-black text-gray-800">
                      Quarter {quarter}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Academic performance data and analytics
                    </p>
                  </div>
                </div>

                {/* Tables */}
                {Object.entries(gradeSectionData)
                  .sort(([, itemsA], [, itemsB]) => {
                    const valueA = parseInt(itemsA[0]?.class.grade || 0);

                    const valueB = parseInt(itemsB[0]?.class.grade || 0);

                    return valueA - valueB;
                  })
                  .map(([gradeOrSection, items]) => {
                    const schoolYear = items[0]?.school_year;

                    const class_id = items[0]?.class.id;

                    const grade = items[0]?.class.grade;

                    const adviser = items[0]?.class?.adviser?.full_name;

                    const sortedItems = [...items].sort((a, b) =>
                      a.subject.localeCompare(b.subject),
                    );

                    return (
                      <div key={gradeOrSection}>
                        {showConsolidated ? (
                          <ConsolidatedGradeTable
                            grade={grade}
                            schoolYear={schoolYear}
                            quarter={items[0]?.quarter}
                            data={sortedItems}
                          />
                        ) : (
                          <GPATable
                            grade={grade}
                            section={gradeOrSection}
                            schoolYear={schoolYear}
                            quarter={items[0]?.quarter}
                            data={sortedItems}
                            profile={profile}
                            deleteId={deleteId}
                            setDeleteId={setDeleteId}
                            setInitialData={setInitialData}
                            initialData={initialData}
                            setOpenEdit={setOpenEdit}
                            class_id={class_id}
                            adviser={adviser}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GPAClient;
