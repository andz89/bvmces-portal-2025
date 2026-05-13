"use client";
import { exportToExcel } from "../utils/exportAsExcel.js";

const ConsolidatedTable = ({ title, mps }) => {
  const consolidatedData = Object.values(
    mps.reduce((acc, item) => {
      const grade = item.class.grade;

      if (!acc[grade]) {
        acc[grade] = {
          grade,
          gmrc: [],
          epp: [],
          filipino: [],
          english: [],
          math: [],
          science: [],
          ap: [],
          mapeh: [],
          reading_literacy: [],
        };
      }

      const subjects = [
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

      subjects.forEach((subject) => {
        const value = Number(item[subject]);

        if (!isNaN(value) && value > 0) {
          acc[grade][subject].push(value);
        }
      });

      return acc;
    }, {}),
  ).map((item) => {
    const averageSubject = (arr) => {
      if (!arr.length) return "-";

      return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
    };

    const subjectValues = [
      averageSubject(item.gmrc),
      averageSubject(item.epp),
      averageSubject(item.filipino),
      averageSubject(item.english),
      averageSubject(item.math),
      averageSubject(item.science),
      averageSubject(item.ap),
      averageSubject(item.mapeh),
      averageSubject(item.reading_literacy),
    ]
      .filter((v) => v !== "-")
      .map(Number);

    const overallAverage =
      subjectValues.length > 0
        ? (
            subjectValues.reduce((a, b) => a + b, 0) / subjectValues.length
          ).toFixed(2)
        : "-";

    return {
      grade: item.grade,
      gmrc: averageSubject(item.gmrc),
      epp: averageSubject(item.epp),
      filipino: averageSubject(item.filipino),
      english: averageSubject(item.english),
      math: averageSubject(item.math),
      science: averageSubject(item.science),
      ap: averageSubject(item.ap),
      mapeh: averageSubject(item.mapeh),
      reading_literacy: averageSubject(item.reading_literacy),
      average: overallAverage,
    };
  });

  return (
    <div>
      <div className="flex justify-between items-center mx-5">
        <div className="   ">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            {title}
          </h2>
        </div>
        <div className="   ">
          <button
            onClick={() => exportToExcel(consolidatedData, false)}
            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm mx-5">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left">Grade</th>

              <th className="px-4 py-3 text-center">GMRC</th>

              <th className="px-4 py-3 text-center">EPP</th>

              <th className="px-4 py-3 text-center">Filipino</th>

              <th className="px-4 py-3 text-center">English</th>

              <th className="px-4 py-3 text-center">Math</th>

              <th className="px-4 py-3 text-center">Science</th>

              <th className="px-4 py-3 text-center">AP</th>

              <th className="px-4 py-3 text-center">MAPEH</th>

              <th className="px-4 py-3 text-center">Reading</th>

              <th className="px-4 py-3 text-center">Average</th>
            </tr>
          </thead>

          <tbody>
            {consolidatedData.map((item) => (
              <tr
                key={item.grade}
                className="border-t border-slate-200 hover:bg-slate-50"
              >
                <td className="px-4 py-3">{item.grade}</td>

                <td className="px-4 py-3 text-center">{item.gmrc}</td>

                <td className="px-4 py-3 text-center">{item.epp}</td>

                <td className="px-4 py-3 text-center">{item.filipino}</td>

                <td className="px-4 py-3 text-center">{item.english}</td>

                <td className="px-4 py-3 text-center">{item.math}</td>

                <td className="px-4 py-3 text-center">{item.science}</td>

                <td className="px-4 py-3 text-center">{item.ap}</td>

                <td className="px-4 py-3 text-center">{item.mapeh}</td>

                <td className="px-4 py-3 text-center">
                  {item.reading_literacy}
                </td>

                <td className="px-4 py-3 text-center font-semibold">
                  {item.average}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsolidatedTable;
