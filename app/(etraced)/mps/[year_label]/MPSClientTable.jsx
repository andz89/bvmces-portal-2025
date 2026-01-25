"use client";

import { useState, useMemo } from "react";

import QuarterTable from "./QuarterTable";
export default function MPSClientTable({ profile, mpsData }) {
  const [viewMode, setViewMode] = useState("quarter");

  const SUBJECT_KEYS = [
    "gmrc",
    "epp",
    "filipino",
    "english",
    "math",
    "science",
    "ap",
    "mapeh",
    "reading_literacy",
  ];

  const columns = useMemo(() => [
    {
      accessorKey: "class.grade",
      header: "Grade",
      cell: ({ getValue }) => getValue().toUpperCase(),
    },

    {
      accessorKey: "class.section",
      header: "Section",
      cell: ({ getValue }) => getValue().toUpperCase(),
    },

    { accessorKey: "gmrc", header: "GMRC" },
    { accessorKey: "epp", header: "EPP" },
    { accessorKey: "filipino", header: "Fil" },
    { accessorKey: "english", header: "Eng" },
    { accessorKey: "math", header: "Math" },
    { accessorKey: "science", header: "Sci" },
    { accessorKey: "ap", header: "AP" },
    { accessorKey: "mapeh", header: "MAPEH" },
    { accessorKey: "reading_literacy", header: "Reading" },

    {
      header: "Total",
      cell: ({ row }) => {
        const values = SUBJECT_KEYS.map((key) =>
          Number(row.original[key])
        ).filter((v) => !isNaN(v) && v > 0);

        if (values.length === 0) return "-";

        const average = values.reduce((sum, v) => sum + v, 0) / values.length;

        return average.toFixed(2);
      },
    },

    {
      accessorKey: "link",
      header: "Link",
      cell: ({ getValue }) =>
        getValue() ? (
          <a href={getValue()} target="_blank" className="text-blue-600 ">
            View
          </a>
        ) : (
          "-"
        ),
    },
  ]);

  const dataByQuarter = useMemo(() => {
    const getGradeNumber = (grade) => Number(grade.replace(/[^0-9]/g, ""));

    const grouped = {
      "1st quarter": [],
      "2nd quarter": [],
      "3rd quarter": [],
      "4th quarter": [],
    };

    mpsData.forEach((item) => {
      if (grouped[item.quarter]) {
        grouped[item.quarter].push(item);
      }
    });

    Object.keys(grouped).forEach((q) => {
      grouped[q].sort(
        (a, b) => getGradeNumber(a.class.grade) - getGradeNumber(b.class.grade)
      );
    });

    return grouped;
  }, [mpsData]);
  const consolidatedByQuarter = useMemo(() => {
    const result = {
      "1st quarter": [],
      "2nd quarter": [],
      "3rd quarter": [],
      "4th quarter": [],
    };

    const getGradeNumber = (grade) => Number(grade.replace(/[^0-9]/g, ""));

    Object.keys(result).forEach((quarter) => {
      const map = {};

      mpsData
        .filter((row) => row.quarter === quarter)
        .forEach((row) => {
          const gradeKey = row.class.grade; // ✅ FIXED

          if (!map[gradeKey]) {
            map[gradeKey] = {
              grade: gradeKey,
              counts: {},
            };

            SUBJECT_KEYS.forEach((subj) => {
              map[gradeKey][subj] = 0;
              map[gradeKey].counts[subj] = 0;
            });
          }

          SUBJECT_KEYS.forEach((subj) => {
            const value = Number(row[subj]);
            if (!isNaN(value) && value > 0) {
              map[gradeKey][subj] += value;
              map[gradeKey].counts[subj] += 1;
            }
          });
        });

      result[quarter] = Object.values(map)
        .map((item) => {
          SUBJECT_KEYS.forEach((subj) => {
            item[subj] =
              item.counts[subj] > 0
                ? (item[subj] / item.counts[subj]).toFixed(2)
                : "-";
          });
          delete item.counts;
          return item;
        })
        .sort(
          (a, b) => getGradeNumber(a.grade) - getGradeNumber(b.grade) // ✅ FIXED
        );
      // 👉 OVERALL AVERAGE ROW
      const totals = {};
      SUBJECT_KEYS.forEach((subj) => {
        totals[subj] = { sum: 0, count: 0 };
      });

      result[quarter].forEach((row) => {
        SUBJECT_KEYS.forEach((subj) => {
          const val = Number(row[subj]);
          if (!isNaN(val)) {
            totals[subj].sum += val;
            totals[subj].count += 1;
          }
        });
      });

      const overallRow = {
        grade: "OVERALL AVERAGE",
      };

      SUBJECT_KEYS.forEach((subj) => {
        overallRow[subj] =
          totals[subj].count > 0
            ? (totals[subj].sum / totals[subj].count).toFixed(2)
            : "-";
      });

      // push at bottom
      result[quarter].push(overallRow);
    });

    return result;
  }, [mpsData]);

  const consolidatedColumns = useMemo(() => [
    {
      accessorKey: "grade",
      header: "Grade",
      cell: ({ getValue }) => getValue().toUpperCase(),
    },

    { accessorKey: "gmrc", header: "GMRC" },
    { accessorKey: "epp", header: "EPP" },
    { accessorKey: "filipino", header: "Fil" },
    { accessorKey: "english", header: "Eng" },
    { accessorKey: "math", header: "Math" },
    { accessorKey: "science", header: "Sci" },
    { accessorKey: "ap", header: "AP" },
    { accessorKey: "mapeh", header: "MAPEH" },
    { accessorKey: "reading_literacy", header: "Reading" },

    {
      header: "Total",
      cell: ({ row }) => {
        const values = SUBJECT_KEYS.map((key) =>
          Number(row.original[key])
        ).filter((v) => !isNaN(v));

        if (!values.length) return "-";

        return (values.reduce((sum, v) => sum + v, 0) / values.length).toFixed(
          2
        );
      },
    },
  ]);

  return (
    <>
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setViewMode("quarter")}
          className={`px-3 py-1 text-sm rounded ${
            viewMode === "quarter" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Individual Result
        </button>

        <button
          onClick={() => setViewMode("consolidated")}
          className={`px-3 py-1 text-sm rounded ${
            viewMode === "consolidated"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Consolidated Result
        </button>
      </div>

      {viewMode === "quarter" &&
        Object.entries(dataByQuarter).map(([quarter, data]) => (
          <QuarterTable
            key={quarter}
            title={quarter}
            data={data}
            columns={columns}
          />
        ))}

      {viewMode === "consolidated" &&
        Object.entries(consolidatedByQuarter).map(([quarter, data]) => (
          <QuarterTable
            key={quarter}
            title={`${quarter} – Consolidated`}
            data={data}
            columns={consolidatedColumns}
          />
        ))}
    </>
  );
}
