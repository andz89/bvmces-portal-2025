export default function DashboardHomePage() {
  // SAMPLE DATA WITH SECTIONS
  const enrollmentData = [
    {
      grade: "Kinder",
      sections: [
        { name: "A", boys: 15, girls: 14 },
        { name: "B", boys: 13, girls: 12 },
        { name: "C", boys: 12, girls: 12 },
      ],
    },
    {
      grade: "Grade 1",
      sections: [
        { name: "A", boys: 18, girls: 16 },
        { name: "B", boys: 17, girls: 15 },
        { name: "C", boys: 17, girls: 17 },
      ],
    },
    {
      grade: "Grade 2",
      sections: [
        { name: "A", boys: 17, girls: 15 },
        { name: "B", boys: 16, girls: 16 },
        { name: "C", boys: 17, girls: 15 },
      ],
    },
    {
      grade: "Grade 3",
      sections: [
        { name: "A", boys: 16, girls: 17 },
        { name: "B", boys: 16, girls: 16 },
        { name: "C", boys: 16, girls: 17 },
      ],
    },
    {
      grade: "Grade 4",
      sections: [
        { name: "A", boys: 15, girls: 14 },
        { name: "B", boys: 15, girls: 14 },
        { name: "C", boys: 15, girls: 14 },
      ],
    },
    {
      grade: "Grade 5",
      sections: [
        { name: "A", boys: 14, girls: 13 },
        { name: "B", boys: 14, girls: 13 },
        { name: "C", boys: 15, girls: 14 },
      ],
    },
    {
      grade: "Grade 6",
      sections: [
        { name: "A", boys: 14, girls: 12 },
        { name: "B", boys: 14, girls: 12 },
        { name: "C", boys: 14, girls: 12 },
      ],
    },
  ];

  // TOTALS
  const totalBoys = enrollmentData.reduce(
    (sum, grade) => sum + grade.sections.reduce((s, sec) => s + sec.boys, 0),
    0
  );

  const totalGirls = enrollmentData.reduce(
    (sum, grade) => sum + grade.sections.reduce((s, sec) => s + sec.girls, 0),
    0
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">School Enrollment Overview</h1>

      {/* TOTAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Boys" value={totalBoys} />
        <StatCard title="Total Girls" value={totalGirls} />
        <StatCard title="Total Enrollment" value={totalBoys + totalGirls} />
      </div>

      {/* SUMMARY TABLE */}
      <div className="bg-white border rounded-lg">
        <h2 className="text-lg font-semibold p-4 border-b">
          Enrollment Summary by Grade & Section
        </h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Grade</th>
              <th className="text-left p-3">Section</th>
              <th className="text-right p-3">Boys</th>
              <th className="text-right p-3">Girls</th>
              <th className="text-right p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {enrollmentData.map((grade) =>
              grade.sections.map((sec, index) => (
                <tr key={`${grade.grade}-${sec.name}`} className="border-t">
                  <td className="p-3">{index === 0 ? grade.grade : ""}</td>
                  <td className="p-3">{sec.name}</td>
                  <td className="p-3 text-right">{sec.boys}</td>
                  <td className="p-3 text-right">{sec.girls}</td>
                  <td className="p-3 text-right font-medium">
                    {sec.boys + sec.girls}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* REUSABLE CARD */
function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded-lg p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}
