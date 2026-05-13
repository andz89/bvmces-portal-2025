import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as XLSX from "xlsx";

export default function QuarterTable({ title, data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data || data.length === 0) return null;

  function exportGradeToExcel() {
    const rows = data.map((row) => ({
      Subject: row.subject,

      "Failed Male": row.not_meet_male,
      "Failed Female": row.not_meet_female,
      "Failed Total": row.not_meet_male + row.not_meet_female,

      "FS Male": row.fs_male,
      "FS Female": row.fs_female,
      "FS Total": row.fs_male + row.fs_female,

      "S Male": row.s_male,
      "S Female": row.s_female,
      "S Total": row.s_male + row.s_female,

      "VS Male": row.vs_male,
      "VS Female": row.vs_female,
      "VS Total": row.vs_male + row.vs_female,

      "E Male": row.e_male,
      "E Female": row.e_female,
      "E Total": row.e_male + row.e_female,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title || "GPA");

    XLSX.writeFile(workbook, `GPA_${title}.xlsx`);
  }

  return (
    <div className="mb-8">
      <div className="mb-3 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>

        <button
          onClick={exportGradeToExcel}
          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export Excel
        </button>
      </div>

      <div className="bg-white border rounded-sm overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border border-slate-600 px-3 py-2 text-center font-semibold bg-slate-800 text-white"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border px-3 py-1 text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
