"use client";

import QuarterTable from "./QuarterTable.jsx";

const MPSClient = ({ profile, mps, school_year, class_id, section, grade }) => {
  // Group by quarter
  const groupedByQuarter = mps.reduce((acc, item) => {
    const quarter = item.quarter || "No Quarter";

    if (!acc[quarter]) {
      acc[quarter] = [];
    }

    acc[quarter].push(item);

    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#f3f6fb] pb-16 w-full">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-300/10 rounded-full blur-3xl"></div>

        <div className="relative   mx-auto px-4 md:px-10 py-10">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
            {/* Left */}
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-white/10
                  backdrop-blur-md
                  border
                  border-white/10
                  rounded-full
                  px-4
                  py-1.5
                  text-white
                  text-sm
                  mb-5
                "
              >
                Monitoring Progress Summary
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                MPS Dashboard
              </h1>

              <p className="text-blue-100 text-base mt-3 max-w-2xl">
                Track learner performance and organize MPS records. This view
                is read-only.
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
                  <p className="text-xs uppercase tracking-wide text-blue-100">
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
                  <p className="text-xs uppercase tracking-wide text-blue-100">
                    Class
                  </p>

                  <h3 className="text-xl font-bold text-white mt-1">
                    Grade {grade}
                  </h3>

                  <p className="text-sm text-blue-100 uppercase mt-1">
                    {section}
                  </p>
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
                  <p className="text-xs uppercase tracking-wide text-blue-100">
                    Total Files
                  </p>

                  <h3 className="text-2xl font-black text-white mt-1">
                    {mps.length}
                  </h3>
                </div>
              </div>
            </div>

            {/* Right */}
            <div
              className="
                  bg-white/10
                  backdrop-blur-xl
                  border
                  border-white/10
                  rounded-3xl
                  p-5
                  shadow-2xl
                  w-full
                  max-w-sm
                "
            >
              <h2 className="text-white text-xl font-bold">Read-Only</h2>

              <p className="text-blue-100 text-sm mt-1">
                This is a read-only archive of quarter-based MPS files.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quarter Sections */}
      <div className="w-full mx-auto px-4 md:px-6 py-8 space-y-8">
        {Object.entries(groupedByQuarter).map(([quarter, data]) => (
          <QuarterTable key={quarter} title={quarter} mps={[...data]} />
        ))}

        {/* Empty */}
        {mps.length === 0 && (
          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-3xl
              p-16
              text-center
              shadow-sm
            "
          >
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-700">
                No MPS Files Yet
              </h3>

              <p className="text-gray-500 max-w-md mx-auto">
                No Monitoring Progress Summary files have been recorded for
                this class.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MPSClient;
