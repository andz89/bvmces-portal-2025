"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { checkRole } from "@/utils/lib/checkRole";

function parseLock({ school_year, term, week }) {
  const schoolYear = String(school_year || "").trim();
  const termNum = Number(term);
  const weekNum = Number(week);

  if (!schoolYear) throw new Error("School year is required.");
  if (!Number.isInteger(termNum) || termNum < 1 || termNum > 3) {
    throw new Error("Term must be between 1 and 3.");
  }
  if (!Number.isInteger(weekNum) || weekNum < 1 || weekNum > 15) {
    throw new Error("Week must be between 1 and 15.");
  }

  return { school_year: schoolYear, term: termNum, week: weekNum };
}

function revalidateLockPages() {
  revalidatePath("/admin-dashboard");
  revalidatePath("/lesson-plan");
  revalidatePath("/lesson-plan/teacher");
}

export async function getLessonPlanLocks(school_year) {
  const supabase = await createClient();

  let query = supabase
    .from("lesson_plan_locks")
    .select("id,school_year,term,week,created_at")
    .order("school_year", { ascending: false })
    .order("term", { ascending: true })
    .order("week", { ascending: true });

  if (school_year) query = query.eq("school_year", school_year);

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// Fails closed: if the lock table can't be read, the upload is treated as
// locked so a Supabase hiccup can't let uploads through a locked week.
export async function isLessonPlanWeekLocked(values) {
  const { school_year, term, week } = parseLock(values);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lesson_plan_locks")
    .select("id")
    .eq("school_year", school_year)
    .eq("term", term)
    .eq("week", week)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Unable to check whether this week is locked.");
  }

  return !!data;
}

export async function lockLessonPlanWeek(values) {
  const profile = await checkRole();

  if (!profile || profile.role !== "admin") {
    return { error: "Only admins can lock lesson plan uploads." };
  }

  let lock;
  try {
    lock = parseLock(values);
  } catch (err) {
    return { error: err.message };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_plan_locks")
    .insert({ ...lock, locked_by: profile.id });

  if (error) {
    // 23505 = unique violation: already locked.
    if (error.code === "23505") {
      return {
        error: `Term ${lock.term} Week ${lock.week} (${lock.school_year}) is already locked.`,
      };
    }
    return { error: error.message };
  }

  revalidateLockPages();

  return { success: true };
}

export async function unlockLessonPlanWeek(id) {
  const profile = await checkRole();

  if (!profile || profile.role !== "admin") {
    return { error: "Only admins can unlock lesson plan uploads." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("lesson_plan_locks")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidateLockPages();

  return { success: true };
}
