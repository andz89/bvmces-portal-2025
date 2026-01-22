import { useMemo } from "react";

export function useMPSColumns() {
  return useMemo(
    () => [
      {
        accessorKey: "class.grade",
        header: "GRADE",
        cell: ({ getValue }) => getValue().toUpperCase(),
      },
      {
        accessorKey: "subject",
        header: "SUBJECTS",
        cell: ({ getValue }) => getValue().toUpperCase(),
      },

      {
        header: "FAILED",
        columns: [
          { accessorKey: "not_meet_male", header: "M" },
          { accessorKey: "not_meet_female", header: "F" },
          {
            id: "not_meet_total",
            header: "T",
            cell: ({ row }) =>
              (row.original.not_meet_male || 0) +
              (row.original.not_meet_female || 0),
          },
        ],
      },

      {
        header: "FAIRLY SATISFACTORY",
        columns: [
          { accessorKey: "fs_male", header: "M" },
          { accessorKey: "fs_female", header: "F" },
          {
            id: "fs_total",
            header: "T",
            cell: ({ row }) =>
              (row.original.fs_male || 0) + (row.original.fs_female || 0),
          },
        ],
      },

      {
        header: "SATISFACTORY",
        columns: [
          { accessorKey: "s_male", header: "M" },
          { accessorKey: "s_female", header: "F" },
          {
            id: "s_total",
            header: "T",
            cell: ({ row }) =>
              (row.original.s_male || 0) + (row.original.s_female || 0),
          },
        ],
      },

      {
        header: "VERY SATISFACTORY",
        columns: [
          { accessorKey: "vs_male", header: "M" },
          { accessorKey: "vs_female", header: "F" },
          {
            id: "vs_total",
            header: "T",
            cell: ({ row }) =>
              (row.original.vs_male || 0) + (row.original.vs_female || 0),
          },
        ],
      },

      {
        header: "EXCELLENT",
        columns: [
          { accessorKey: "e_male", header: "M" },
          { accessorKey: "e_female", header: "F" },
          {
            id: "e_total",
            header: "T",
            cell: ({ row }) =>
              (row.original.e_male || 0) + (row.original.e_female || 0),
          },
        ],
      },
    ],
    []
  );
}
