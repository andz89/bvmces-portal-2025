import * as XLSX from "xlsx";

export function exportGPAToExcel(data, title = "GPA_Report") {
  const rows = data.map((item) => ({
    SUBJECT: item.subject?.toUpperCase() || "-",

    FAILED_MALE: item.not_meet_male || 0,
    FAILED_FEMALE: item.not_meet_female || 0,

    FS_MALE: item.fs_male || 0,
    FS_FEMALE: item.fs_female || 0,

    S_MALE: item.s_male || 0,
    S_FEMALE: item.s_female || 0,

    VS_MALE: item.vs_male || 0,
    VS_FEMALE: item.vs_female || 0,

    E_MALE: item.e_male || 0,
    E_FEMALE: item.e_female || 0,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 25 },

    { wch: 12 },
    { wch: 12 },
    { wch: 12 },

    { wch: 12 },
    { wch: 12 },
    { wch: 12 },

    { wch: 12 },
    { wch: 12 },
    { wch: 12 },

    { wch: 12 },
    { wch: 12 },
    { wch: 12 },

    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "GPA");

  XLSX.writeFile(workbook, `${title}.xlsx`);
}
