import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function QuarterTable({ title, data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (data.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">{title}</h2>

      <div className="bg-white  rounded-sm  border border-slate-600    overflow-x-auto">
        <table className="min-w-full text-sm text-left ">
          <thead className="bg-slate-800 text-xs uppercase border border-slate-600  text-white text-center">
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
              <tr key={row.id} className="  hover:bg-gray-50 text-center">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border border-slate-600 px-4 py-2 text-xs"
                  >
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
