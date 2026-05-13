import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { exportGPAToExcel } from "./exportGPAToExcel";

export default function QuarterTable({ title, data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data || data.length === 0) return null;

  return (
    <div className="mb-8">
      {title && (
        <h2 className="mb-3 text-sm font-semibold text-gray-700">{title}</h2>
      )}
      <button
        onClick={() => exportGPAToExcel(data, title)}
        className="bg-green-600 text-white px-3 py-2 rounded"
      >
        Export Excel
      </button>
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
                          header.getContext(),
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
