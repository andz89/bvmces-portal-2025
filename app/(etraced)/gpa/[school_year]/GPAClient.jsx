"use client";
import { React, useState } from "react";

import BulkAddGPAModal from "./BulkAddGPAModal";
import GPATable from "./GPATable";
import ConsolidatedGradeTable from "./ConsolidatedGradeTable";
import EditGPAModal from "./EditGPAModal";

const GPAClient = ({ school_year, profile, gpa, classData }) => {
  const [initialData, setInitialData] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [viewMode, setViewMode] = useState(true);
  const [openBulkAddModal, setOpenBulkAddModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [showConsolidated, setShowConsolidated] = useState(false);
  // Group by quarter and section for individual view
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

  // Group by quarter and grade for consolidated view
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
    <div className="w-full">
      <EditGPAModal
        openEdit={openEdit}
        onClose={() => setOpenEdit(false)}
        initialData={initialData}
        school_year={school_year}
        classData={classData}
      />

      <div className="flex flex-col gap-4 m-5 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">GPA </h1>
          <h2 className="text-lg">{school_year}</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowConsolidated(!showConsolidated)}
            className={`px-3 py-2 rounded cursor-pointer text-white font-medium ${
              showConsolidated
                ? "bg-slate-800 hover:bg-slate-900"
                : "bg-slate-600 hover:bg-slate-700"
            }`}
          >
            {showConsolidated ? "Show Individual" : "Show Consolidated"}
          </button>

          <button
            onClick={() => setOpenBulkAddModal(true)}
            className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-900 cursor-pointer text-white"
          >
            Add GPA
          </button>
        </div>
      </div>

      <BulkAddGPAModal
        classData={classData}
        open={openBulkAddModal}
        onClose={() => setOpenBulkAddModal(false)}
        school_year={school_year}
      />

      <div>
        {Object.entries(showConsolidated ? consolidatedData : groupedData)
          .sort(([quarterA], [quarterB]) => {
            const numA = parseInt(quarterA.match(/\d+/)?.[0] || 0);
            const numB = parseInt(quarterB.match(/\d+/)?.[0] || 0);
            return numA - numB;
          })
          .map(([quarter, gradeSectionData]) => (
            <div key={quarter} className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-800 px-4">
                Quarter {quarter}
              </h2>
              {Object.entries(gradeSectionData)
                .sort(([, itemsA], [, itemsB]) => {
                  const valueA = showConsolidated
                    ? parseInt(itemsA[0]?.class.grade || 0)
                    : parseInt(itemsA[0]?.class.grade || 0);
                  const valueB = showConsolidated
                    ? parseInt(itemsB[0]?.class.grade || 0)
                    : parseInt(itemsB[0]?.class.grade || 0);
                  return valueA - valueB;
                })
                .map(([gradeOrSection, items]) => {
                  const schoolYear = items[0]?.school_year;
                  const class_id = items[0]?.class.id;
                  const grade = items[0]?.class.grade;
                  // Sort subjects alphabetically
                  const sortedItems = [...items].sort((a, b) =>
                    a.subject.localeCompare(b.subject),
                  );

                  return (
                    <div key={gradeOrSection} className="space-y-4">
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
                          setOpenForm={setOpenForm}
                          setDeleteId={setDeleteId}
                          setInitialData={setInitialData}
                          initialData={initialData}
                          setOpenEdit={setOpenEdit}
                          class_id={class_id}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
      </div>
    </div>
  );
};

export default GPAClient;
