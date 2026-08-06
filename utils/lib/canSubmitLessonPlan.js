export function canSubmitLessonPlan() {
  const now = new Date();

  // Philippine time
  const manila = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Manila",
    }),
  );

  const day = manila.getDay(); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
  const hour = manila.getHours();

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
