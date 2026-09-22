"use client";

import { React, useState } from "react";

import {
  BiPlus,
  BiTable,
  BiGridAlt,
  BiBarChartAlt2,
  BiFilterAlt,
} from "react-icons/bi";

import BulkAddGPATermModal from "./BulkAddGPATermModal";
import GPATermTable from "./GPATermTable";
import ConsolidatedGradeTermTable from "./ConsolidatedGradeTermTable";
import EditGPATermModal from "./EditGPATermModal";

const GPATermClient = ({ school_year, profile, gpa, classData }) => {
  const [initialData, setInitialData] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  const [openBulkAddModal, setOpenBulkAddModal] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [showConsolidated, setShowConsolidated] = useState(false);

  const [filterTerm, setFilterTerm] = useState("all");

  const [filterGrade, setFilterGrade] = useState("all");

  // Distinct grades available for this school year, for the filter dropdown
  const availableGrades = Array.from(
    new Set((classData.classes || []).map((item) => String(item.grade))),
  ).sort((a, b) => Number(a) - Number(b));

  // Apply the Term / Grade filter before grouping anything for display
  const filteredGpa = gpa.filter((item) => {
    const termMatch = item.term?.toString().match(/\d+/);

    const normalizedTerm = termMatch ? termMatch[0] : item.term;

    const matchesTerm = filterTerm === "all" || normalizedTerm === filterTerm;

    const matchesGrade =
      filterGrade === "all" || String(item.class.grade) === filterGrade;

    return matchesTerm && matchesGrade;
  });

  // Group by term and section
  const groupedData = filteredGpa.reduce((acc, item) => {
    let term = item.term || "No Term";

    const termMatch = term.toString().match(/\d+/);

    const normalizedTerm = termMatch ? termMatch[0] : term;

    const section = item.class.section || "No Section";

    if (!acc[normalizedTerm]) {
      acc[normalizedTerm] = {};
    }

    if (!acc[normalizedTerm][section]) {
      acc[normalizedTerm][section] = [];
    }

    acc[normalizedTerm][section].push(item);

    return acc;
  }, {});

  // Consolidated
  const consolidatedData = filteredGpa.reduce((acc, item) => {
    let term = item.term || "No Term";

    const termMatch = term.toString().match(/\d+/);

    const normalizedTerm = termMatch ? termMatch[0] : term;

    const grade = item.class.grade || "No Grade";

    if (!acc[normalizedTerm]) {
      acc[normalizedTerm] = {};
    }

    if (!acc[normalizedTerm][grade]) {
      acc[normalizedTerm][grade] = [];
    }

    acc[normalizedTerm][grade].push(item);

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-lis-bg pb-20">
      {/* Edit Modal */}
      <EditGPATermModal
        openEdit={openEdit}
        onClose={() => setOpenEdit(false)}
        initialData={initialData}
        school_year={school_year}
        classData={classData}
      />

      {/* Bulk Add */}
      <BulkAddGPATermModal
        classData={classData}
        open={openBulkAddModal}
        onClose={() => setOpenBulkAddModal(false)}
        school_year={school_year}
      />

      {/* Hero */}
      <div className="relative overflow-hidden bg-lis-primary   ">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full "></div>

        <div className="absolute bottom-0 left-0 w-72 h-72 bg-lis-panel-header/10 rounded-full "></div>

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

            px-4
            py-1.5
            text-white
            text-sm
            mb-5
          "
              >
                Grade Performance Analysis
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                GPA Term Dashboard
              </h1>

              <p className="text-white/80 text-base mt-3 max-w-2xl">
                Analyze learner performance, monitor grade trends, and manage
                GPA Term reports efficiently.
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
                    GPA Records
                  </p>

                  <h3 className="text-2xl font-bold text-white mt-1">
                    {filteredGpa.length}
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
                    {showConsolidated ? "Consolidated" : "Individual"}
                  </h3>
                </div>
              </div>
            </div>

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
                <h2 className="text-white text-xl font-bold">Quick Actions</h2>

                <p className="text-white/80 text-sm mt-1">
                  Manage GPA Term records and consolidated reports.
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
              rounded-sm
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
                      {showConsolidated
                        ? "Show Individual"
                        : "Show Consolidated"}
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
              rounded-sm
              bg-white
              px-5
              py-3
              text-lis-success-text
              font-semibold

              hover:scale-[1.02]
              transition
            "
                  >
                    <BiPlus size={22} />

                    <span>Add GPA</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border-b border-lis-panel-border bg-white px-4 md:px-10 py-4">
        <div className="flex items-center gap-2 text-lis-muted mb-3">
          <BiFilterAlt size={18} />
          <span className="text-sm font-medium">Filter</span>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          {/* Term */}
          <div className="min-w-40">
            <label className="mb-2 block text-sm font-medium text-lis-text">
              Term
            </label>

            <select
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              className="w-full rounded-sm border border-lis-panel-border px-4 py-2.5 text-sm text-lis-text outline-none transition focus:border-lis-primary focus:ring-4 focus:ring-lis-primary"
            >
              <option value="all">All Terms</option>
              <option value="1">Term 1</option>
              <option value="2">Term 2</option>
              <option value="3">Term 3</option>
            </select>
          </div>

          {/* Grade */}
          <div className="min-w-40">
            <label className="mb-2 block text-sm font-medium text-lis-text">
              Grade
            </label>

            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="w-full rounded-sm border border-lis-panel-border px-4 py-2.5 text-sm text-lis-text outline-none transition focus:border-lis-primary focus:ring-4 focus:ring-lis-primary"
            >
              <option value="all">All Grades</option>
              {availableGrades.map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full mx-auto px-4 md:px-10 py-8">
        {filteredGpa.length === 0 && (
          <div className="rounded-sm border border-dashed border-lis-panel-border bg-white p-14 text-center">
            <h3 className="text-lg font-semibold text-lis-text">
              No Matching GPA Records
            </h3>

            <p className="mt-2 text-sm text-lis-muted">
              No records match the selected Term and Grade filters.
            </p>
          </div>
        )}

        <div className="space-y-12">
          {Object.entries(showConsolidated ? consolidatedData : groupedData)
            .sort(([termA], [termB]) => {
              const numA = parseInt(termA.match(/\d+/)?.[0] || 0);

              const numB = parseInt(termB.match(/\d+/)?.[0] || 0);

              return numA - numB;
            })
            .map(([term, gradeSectionData]) => (
              <div key={term} className="space-y-6">
                {/* Term Header */}
                <div className="flex items-center gap-4">
                  <div
                    className="
                      h-14
                      w-14
                      rounded-sm
                      bg-lis-primary


                      text-white
                      flex
                      items-center
                      justify-center

                    "
                  >
                    <BiBarChartAlt2 size={28} />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-lis-text">
                      Term {term}
                    </h2>

                    <p className="text-lis-muted mt-1">
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
                          <ConsolidatedGradeTermTable
                            grade={grade}
                            schoolYear={schoolYear}
                            term={items[0]?.term}
                            data={sortedItems}
                          />
                        ) : (
                          <GPATermTable
                            grade={grade}
                            section={gradeOrSection}
                            schoolYear={schoolYear}
                            term={items[0]?.term}
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

export default GPATermClient;
