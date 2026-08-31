"use server";
import { Buffer } from "node:buffer";
import { revalidatePath } from "next/cache";
import { handleAppScriptResponse } from "./handleAppScriptResponse";
import { createClient } from "@/utils/supabase/server";
import { checkRole } from "@/utils/lib/checkRole";

type LessonPlanFilters = {
  term?: number | string;
  week?: number | string;
  teacher_id?: string;
};
type LessonPlanByTermFilters = {
  term?: number | string;
  teacher_id?: string;
};
type AdminLessonPlanFilters = {
  term?: number | string;
  week?: number | string;
};
type AppsScriptResponse = {
  status: "success" | "error";
  message?: string;
  data?: unknown;
};
export async function getSettings() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("settings")
    .select("active")
    .eq("name", "upload_lesson_plan")
    .single();

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  return { data, error };
}
export async function getLessonPlans({
  term,
  week,
  teacher_id,
}: LessonPlanFilters = {}) {
  const appScriptUrl = process.env.APPSCRIPT_URL;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL is not configured.");
  }
  const response = await fetch(appScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      action: "getLessonPlans",
      teacher_id,
      week: week ? Number(week) : 1,
      term: term ? Number(term) : 1,
    }),
  });

  const result = await handleAppScriptResponse(response);

  return result;
}
export async function getAdminLessonPlans({
  term,
  week,
}: AdminLessonPlanFilters = {}) {
  const appScriptUrl = process.env.APPSCRIPT_URL;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL is not configured.");
  }
  const response = await fetch(appScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      action: "getAdminLessonPlans",
      week: week ? Number(week) : 1,
      term: term ? Number(term) : 1,
    }),
  });

  const result = await handleAppScriptResponse(response);

  return result;
}

// Checks whether `teacher_id` owns `file_id` by looking it up across all
// terms, reusing getLessonPlansByTerm's own owner-scoped, fail-closed fetch.
async function ownsLessonPlan(file_id: string, teacher_id: string) {
  const terms = [1, 2, 3];

  const settled = await Promise.allSettled(
    terms.map((term) => getLessonPlansByTerm({ term, teacher_id })),
  );

  const fulfilledValues = settled
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<unknown>).value as Array<{
      file_id?: unknown;
    }>);

  if (fulfilledValues.length === 0) {
    const rejected = settled.find(
      (r): r is PromiseRejectedResult => r.status === "rejected",
    );
    throw (
      rejected?.reason ??
      new Error("Unable to verify lesson plan ownership.")
    );
  }

  return fulfilledValues.some((plans) =>
    plans.some((plan) => String(plan.file_id ?? "").trim() === file_id),
  );
}

export async function deleteLessonPlan(file_id: string) {
  const profile = await checkRole();

  if (!profile) {
    throw new Error("Unauthorized.");
  }

  const trimmedFileId = String(file_id || "").trim();

  if (!trimmedFileId) {
    throw new Error("File ID is required.");
  }

  const isOwner = await ownsLessonPlan(trimmedFileId, profile.id);

  if (!isOwner) {
    console.error(
      `SECURITY ERROR: ${profile.id} attempted to delete lesson plan ${trimmedFileId} they do not own.`,
    );
    throw new Error("You can only delete your own lesson plans.");
  }

  const appScriptUrl = process.env.APPSCRIPT_URL;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL is not configured.");
  }
  const response = await fetch(appScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "delete",
      file_id: trimmedFileId,
    }),
  });

  const result = await handleAppScriptResponse(response, "delete");

  return result;
}

export async function getUsers() {
  const supabase = await createClient();

  // if (profile.role !== "admin") {
  //   return { message: "unauthorized" };
  // }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .not("grade", "is", null);

  if (error) throw error;
  return data;
}
export async function updateLessonPlanStatus(
  file_id: string,
  status: "PENDING" | "CHECKED",
) {
  const profile = await checkRole();

  if (!profile || profile.role !== "admin") {
    throw new Error("Only admins can update a lesson plan's status.");
  }

  const appScriptUrl = process.env.APPSCRIPT_URL;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL is not configured.");
  }
  const response = await fetch(appScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "updateLessonPlanStatus",
      file_id,
      checkedDetails: { status: status, checkedBy: profile.full_name },
    }),
  });

  const result = await handleAppScriptResponse(response);
  return result;
}
// export async function getLessonPlansByTerm({
//   term,
//   teacher_id,
// }: LessonPlanByTermFilters = {}) {
//   const appScriptUrl = process.env.APPSCRIPT_URL;

//   if (!appScriptUrl) {
//     throw new Error("APPSCRIPT_URL is not configured.");
//   }
//   const response = await fetch(appScriptUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     cache: "no-store",
//     body: JSON.stringify({
//       action: "getLessonPlansByTerm",
//       teacher_id,
//       term: term ? Number(term) : 1,
//     }),
//   });

//   const result = await handleAppScriptResponse(response);

//   return result;
// }
export async function getLessonPlansByTerm({
  term,
  teacher_id,
}: LessonPlanByTermFilters = {}) {
  const appScriptUrl = process.env.APPSCRIPT_URL;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL is not configured.");
  }

  // Fail closed
  const requestedTeacherId = String(teacher_id || "").trim();

  if (!requestedTeacherId) {
    throw new Error("Teacher ID is required.");
  }

  const requestedTerm = term ? Number(term) : 1;

  const response = await fetch(appScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      action: "getLessonPlansByTerm",
      teacher_id: requestedTeacherId,
      term: requestedTerm,
    }),
  });

  const result = await handleAppScriptResponse(
    response,
    "getLessonPlansByTerm",
  );

  // ---------------------------------
  // FINAL SAFETY CHECK
  // ---------------------------------

  if (!Array.isArray(result)) {
    throw new Error("Invalid lesson plan response.");
  }

  const unsafeRecord = result.some((lessonPlan) => {
    const ownerId = String(lessonPlan.teacher_id ?? "").trim();

    return ownerId !== requestedTeacherId;
  });

  if (unsafeRecord) {
    console.error(
      "SECURITY ERROR: getLessonPlansByTerm returned data belonging to another teacher.",
    );

    throw new Error("Unable to safely retrieve lesson plans.");
  }

  return result;
}
