"use client";

const ConsolidatedGradeTable = ({ grade, schoolYear, data, quarter }) => {
  // Group items by subject and consolidate across all sections
  const consolidatedBySubject = data.reduce((acc, item) => {
    const subject = item.subject;

    if (!acc[subject]) {
      acc[subject] = {
        subject,
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

    acc[subject].not_meet_male += Number(item.not_meet_male);
    acc[subject].not_meet_female += Number(item.not_meet_female);
    acc[subject].fs_male += Number(item.fs_male);
    acc[subject].fs_female += Number(item.fs_female);
    acc[subject].s_male += Number(item.s_male);
    acc[subject].s_female += Number(item.s_female);
    acc[subject].vs_male += Number(item.vs_male);
    acc[subject].vs_female += Number(item.vs_female);
    acc[subject].e_male += Number(item.e_male);
    acc[subject].e_female += Number(item.e_female);

    return acc;
  }, {});

  // Convert to array and sort alphabetically
  const sortedData = Object.values(consolidatedBySubject).sort((a, b) =>
    a.subject.localeCompare(b.subject),
  );

  return (
    <div className="mb-10">
      <div className="px-2 mx-4 mb-4">
        <h2 className="text-lg font-medium text-slate-800">
          Quarter {quarter.toUpperCase()} / Grade {grade} - CONSOLIDATED
        </h2>
      </div>

      <div className="overflow-x-auto mx-5 border border-slate-300 rounded-lg">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th rowSpan="2" className="border border-slate-500 px-4 py-3">
                SUBJECTS
              </th>

              <th colSpan="3" className="border border-slate-500 px-4 py-3">
                FAILED
              </th>

              <th colSpan="3" className="border border-slate-500 px-4 py-3">
                FAIRLY SATISFACTORY
              </th>

              <th colSpan="3" className="border border-slate-500 px-4 py-3">
                SATISFACTORY
              </th>

              <th colSpan="3" className="border border-slate-500 px-4 py-3">
                VERY SATISFACTORY
              </th>

              <th colSpan="3" className="border border-slate-500 px-4 py-3">
                EXCELLENT
              </th>
            </tr>

            <tr className="bg-slate-900 text-white">
              {/* FAILED */}
              <th className="border border-slate-500 px-3 py-2">M</th>
              <th className="border border-slate-500 px-3 py-2">F</th>
              <th className="border border-slate-500 px-3 py-2">T</th>

              {/* FS */}
              <th className="border border-slate-500 px-3 py-2">M</th>
              <th className="border border-slate-500 px-3 py-2">F</th>
              <th className="border border-slate-500 px-3 py-2">T</th>

              {/* SATISFACTORY */}
              <th className="border border-slate-500 px-3 py-2">M</th>
              <th className="border border-slate-500 px-3 py-2">F</th>
              <th className="border border-slate-500 px-3 py-2">T</th>

              {/* VS */}
              <th className="border border-slate-500 px-3 py-2">M</th>
              <th className="border border-slate-500 px-3 py-2">F</th>
              <th className="border border-slate-500 px-3 py-2">T</th>

              {/* EXCELLENT */}
              <th className="border border-slate-500 px-3 py-2">M</th>
              <th className="border border-slate-500 px-3 py-2">F</th>
              <th className="border border-slate-500 px-3 py-2">T</th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((item) => (
              <tr key={item.subject} className="text-center hover:bg-slate-50">
                <td className="border border-slate-400 px-4 py-3 font-medium text-left">
                  {item.subject.toUpperCase()}
                </td>

                {/* FAILED */}
                <td className="border border-slate-400">
                  {item.not_meet_male}
                </td>

                <td className="border border-slate-400">
                  {item.not_meet_female}
                </td>

                <td className="border border-slate-400 font-semibold">
                  {item.not_meet_male + item.not_meet_female}
                </td>

                {/* FS */}
                <td className="border border-slate-400">{item.fs_male}</td>

                <td className="border border-slate-400">{item.fs_female}</td>

                <td className="border border-slate-400 font-semibold">
                  {item.fs_male + item.fs_female}
                </td>

                {/* SATISFACTORY */}
                <td className="border border-slate-400">{item.s_male}</td>

                <td className="border border-slate-400">{item.s_female}</td>

                <td className="border border-slate-400 font-semibold">
                  {item.s_male + item.s_female}
                </td>

                {/* VS */}
                <td className="border border-slate-400">{item.vs_male}</td>

                <td className="border border-slate-400">{item.vs_female}</td>

                <td className="border border-slate-400 font-semibold">
                  {item.vs_male + item.vs_female}
                </td>

                {/* EXCELLENT */}
                <td className="border border-slate-400">{item.e_male}</td>

                <td className="border border-slate-400">{item.e_female}</td>

                <td className="border border-slate-400 font-semibold">
                  {item.e_male + item.e_female}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsolidatedGradeTable;
