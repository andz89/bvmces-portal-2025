"use client";

import { React, useState } from "react";

import { BiTable, BiGridAlt, BiBarChartAlt2 } from "react-icons/bi";

import GPATable from "./GPATable";
import ConsolidatedGradeTable from "./ConsolidatedGradeTable";

const GPAClient = ({ school_year, profile, gpa, classData }) => {
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
    <div className="min-h-screen bg-lis-bg pb-20">
      {/* Hero */}
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
                GPA Dashboard
              </h1>

              <p className="text-white/80 text-base mt-3 max-w-2xl">
                Analyze learner performance and monitor grade trends. This
                view is read-only — use GPA Term to add or edit records.
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
                    {gpa.length}
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
              <h2 className="text-white text-xl font-bold">View Options</h2>

              <p className="text-white/80 text-sm mt-1">
                This is a read-only archive of quarter-based GPA records.
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
                      Quarter {quarter}
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
