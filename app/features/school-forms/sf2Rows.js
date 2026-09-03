// SF2's detail summary table rows. Must stay in sync with SF2_ROWS in
// appscript/SchoolForms.gs (same keys, same order).
export const SF2_ROWS = [
  { key: "enrolment", label: "Enrolment as of 1st Friday of June" },
  { key: "late_enrolment", label: "Late Enrolment during the month (beyond cut-off)" },
  { key: "registered_learners", label: "Registered Learners as of end of month" },
  { key: "percent_enrolment", label: "Percentage of Enrolment as of end of month" },
  { key: "avg_daily_attendance", label: "Average Daily Attendance" },
  { key: "percent_attendance", label: "Percentage of Attendance for the month" },
  { key: "absent_5_days", label: "Number of students absent for 5 consecutive days" },
  { key: "dropped_out", label: "Dropped out" },
  { key: "transferred_out", label: "Transferred out" },
  { key: "transferred_in", label: "Transferred in" },
];

export const SCHOOL_FORM_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: `sf-${i + 1}`,
  label: `SF${i + 1}`,
}));

// These are class-level reports, so they need Grade and Section; the rest
// (sf-4, sf-6, sf-7) are school-level reports with neither field.
// Must stay in sync with GRADE_SECTION_SHEETS in appscript/SchoolForms.gs.
export const SF_NEEDS_GRADE_SECTION = ["sf-1", "sf-2", "sf-3", "sf-5", "sf-8", "sf-9", "sf-10"];
