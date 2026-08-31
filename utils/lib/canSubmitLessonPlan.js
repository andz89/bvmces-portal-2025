export function canSubmitLessonPlan(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);

  const weekday = parts.find((p) => p.type === "weekday").value;
  let hour = Number(parts.find((p) => p.type === "hour").value);

  // Some ICU implementations report midnight as "24" even with hourCycle h23.
  if (hour === 24) hour = 0;

  const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const day = dayMap[weekday];

  // Friday 8:00 AM onwards
  if (day === 5 && hour >= 8) return true;

  // Saturday
  if (day === 6) return true;

  // Sunday
  if (day === 0) return true;

  // Monday before 8:00 AM
  if (day === 1 && hour < 8) return true;

  return false;
}
