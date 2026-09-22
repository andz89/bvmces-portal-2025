"use client";

import React from "react";

import {
  BiBookOpen,
  BiBarChartAlt2,
  BiCalendar,
  BiCategory,
} from "react-icons/bi";

import GPATable from "./GPATable";

const GPAClient = ({ school_year, profile, gpa, class_id, section, grade }) => {
  // Group by quarter
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

  return (
    <div className="min-h-screen bg-lis-bg pb-20">
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
                Analyze learner performance and monitor grade distribution.
                This view is read-only.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-8">
                {/* School Year */}
                <div
                  className="
                    bg-white/10
                    
                    border
                    border-white/10
                    rounded-sm
                    px-5
                    py-4
                    min-w-[180px]
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        h-11
                        w-11
                        rounded-sm
                        bg-white/10
                        flex
                        items-center
                        justify-center
                        text-white
                      "
                    >
                      <BiCalendar size={22} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/80">
                        School Year
                      </p>

                      <h3 className="text-lg font-bold text-white mt-1">
                        {school_year}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Records */}
                <div
                  className="
                    bg-white/10
                    
                    border
                    border-white/10
                    rounded-sm
                    px-5
                    py-4
                    min-w-[180px]
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        h-11
                        w-11
                        rounded-sm
                        bg-white/10
                        flex
                        items-center
                        justify-center
                        text-white
                      "
                    >
                      <BiBookOpen size={22} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/80">
                        Grade
                      </p>

                      <h3 className="text-2xl font-bold text-white mt-1">
                        {grade}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Section */}
                <div
                  className="
                    bg-white/10
                    
                    border
                    border-white/10
                    rounded-sm
                    px-5
                    py-4
                    min-w-[180px]
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        h-11
                        w-11
                        rounded-sm
                        bg-white/10
                        flex
                        items-center
                        justify-center
                        text-white
                      "
                    >
                      <BiCategory size={22} />
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/80">
                        Section
                      </p>

                      <h3 className="text-lg font-bold text-white mt-1 uppercase">
                        {section}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Read-Only Notice */}
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
              <h2 className="text-white text-xl font-bold">Read-Only</h2>

              <p className="text-white/80 text-sm mt-1">
                This is a read-only archive of quarter-based GPA records. Use
                GPA Term to add or edit records.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full mx-auto px-4 md:px-10 py-8">
        <div className="space-y-12">
          {Object.entries(groupedData)
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
                      GPA performance analysis and learner statistics
                    </p>
                  </div>
                </div>

                {/* Tables */}
                {Object.entries(gradeSectionData).map(
                  ([gradeOrSection, items]) => {
                    const grade = items[0]?.class.grade;

                    const sortedItems = [...items].sort((a, b) =>
                      a.subject.localeCompare(b.subject),
                    );

                    return (
                      <div key={gradeOrSection} className="space-y-4">
                        <GPATable
                          grade={grade}
                          section={gradeOrSection}
                          school_year={school_year}
                          quarter={items[0]?.quarter}
                          data={sortedItems}
                        />
                      </div>
                    );
                  },
                )}
              </div>
            ))}

          {/* Empty */}
          {gpa.length === 0 && (
            <div
              className="
                bg-white
                rounded-sm
                border
                border-lis-panel-border
                
                p-16
                text-center
              "
            >
              <h3 className="text-2xl font-bold text-lis-text">
                No GPA Records Yet
              </h3>

              <p className="text-lis-muted mt-2">
                No GPA data has been recorded for this class section.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GPAClient;
