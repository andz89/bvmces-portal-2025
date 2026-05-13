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

  if (data.length === 0) return null;
  function exportToExcel() {
    if (!data || data.length === 0) return;

    const rows = data.map((row) => {
      const result = {};

      columns.forEach((col) => {
        if (!col.header) return;

        // 🚫 skip Link column
        if (col.header === "Link") return;

        const header = typeof col.header === "string" ? col.header : "Value";

        if (col.accessorKey) {
          const keys = col.accessorKey.split(".");
          result[header] = keys.reduce((acc, key) => acc?.[key], row);
        }
      });

      return result;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, title || "Sheet");

    XLSX.writeFile(workbook, `${title?.replace(/\s+/g, "_") || "Table"}.xlsx`);
  }

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>

        <button
          onClick={exportToExcel}
          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export Excel
        </button>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4">
                    {flexRender(
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
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 text-xs">
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
