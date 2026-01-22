"use client";

import { useMemo } from "react";
import QuarterTable from "./QuarterTable";
import { useMPSColumns } from "./useMPSColumns";
import Link from "next/link";

export default function PublicGPAClientTable({ data, classPath }) {
  const columns = useMPSColumns();

  // ✅ GROUP DATA BY QUARTER
  const dataByQuarter = useMemo(() => {
    const getGradeNumber = (grade) =>
      Number(String(grade).replace(/[^0-9]/g, ""));

    const quarters = {
      "1st Quarter": {},
      "2nd Quarter": {},
      "3rd Quarter": {},
      "4th Quarter": {},
    };

    data.forEach((item) => {
      const quarter = item.quarter;
      if (!quarters[quarter]) return;

      const gradeKey = item.class.grade;

      // Initialize grade bucket if missing
      if (!quarters[quarter][gradeKey]) {
        quarters[quarter][gradeKey] = {
          quarter,
          subject: item.subject,
          class: item.class,

          not_meet_male: 0,
          not_meet_female: 0,
          fs_male: 0,
          fs_female: 0,
          s_male: 0,
          s_female: 0,
          vs_male: 0,
          vs_female: 0,
          e_male: 0,
          e_female: 0,
        };
      }

      const target = quarters[quarter][gradeKey];

      // ✅ SUM ALL VALUES
      target.not_meet_male += item.not_meet_male || 0;
      target.not_meet_female += item.not_meet_female || 0;

      target.fs_male += item.fs_male || 0;
      target.fs_female += item.fs_female || 0;

      target.s_male += item.s_male || 0;
      target.s_female += item.s_female || 0;

      target.vs_male += item.vs_male || 0;
      target.vs_female += item.vs_female || 0;

      target.e_male += item.e_male || 0;
      target.e_female += item.e_female || 0;
    });

    // Convert grade maps to sorted arrays
    const result = {};

    Object.keys(quarters).forEach((q) => {
      result[q] = Object.values(quarters[q]).sort(
        (a, b) => getGradeNumber(a.class.grade) - getGradeNumber(b.class.grade)
      );
    });

    return result;
  }, [data]);

  const QUARTERS = ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"];

  return (
    <div className="bg-slate-100 p-2 space-y-4">
      <div className="flex justify-between items-center">
        <div className="bg-yellow-400   py-2 px-3 rounded">
          <h2 className="font-semibold">GPA</h2>
        </div>

        <Link
          target="blank"
          href={classPath}
          className="p-2 bg-blue-300 rounded "
        >
          {" "}
          Go to Class
        </Link>
      </div>

      {QUARTERS.map(
        (q) =>
          dataByQuarter[q]?.length > 0 && (
            <QuarterTable
              key={q}
              title={q.toUpperCase()}
              data={dataByQuarter[q]}
              columns={columns}
            />
          )
      )}
    </div>
  );
}
