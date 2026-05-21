import * as XLSX from "xlsx";

export function exportToExcel(mps, individual = true) {
  const rows = mps.map((item) => {
    // Individual Result
    if (individual) {
      const scores = [
        item.gmrc,
        item.epp,
        item.filipino,
        item.english,
        item.math,
        item.science,
        item.ap,
        item.mapeh,
        item.reading_literacy,
      ].filter(
        (score) => score !== null && score !== undefined && score !== "",
      );

      const total = scores.reduce((sum, score) => sum + Number(score), 0);

      const average =
        scores.length > 0 ? (total / scores.length).toFixed(2) : "-";

      return {
        Grade: item.grade,
        Section: item.section,
        GMRC: item.gmrc,
        EPP: item.epp,
        Filipino: item.filipino,
        English: item.english,
        Math: item.math,
        Science: item.science,
        AP: item.ap,
        MAPEH: item.mapeh,
        Reading: item.reading_literacy,
        Average: average,
      };
    }

    // Consolidated Result
    return {
      Grade: item.grade,
      GMRC: item.gmrc,
      EPP: item.epp,
      Filipino: item.filipino,
      English: item.english,
      Math: item.math,
      Science: item.science,
      AP: item.ap,
      MAPEH: item.mapeh,
      Reading: item.reading_literacy,
      Average: item.average || "-",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "MPS");

  XLSX.writeFile(workbook, "MPS_Report.xlsx");
}
