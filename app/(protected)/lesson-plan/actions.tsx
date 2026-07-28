"use server";
import { Buffer } from "node:buffer";
import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";
type LessonPlanFilters = {
  term?: number | string;
  week?: number | string;
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
export async function getLessonPlans({
  term,
  week,
  teacher_id,
}: LessonPlanFilters = {}) {
  const appScriptUrl = process.env.APPSCRIPT_URL;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL is not configured.");
  }
  const res = await fetch(appScriptUrl, {
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

  if (!res.ok) {
    throw new Error("Unable to connect to the lesson plan service.");
  }

  const result: AppsScriptResponse = await res.json();

  // Apps Script returned an error
  if (result.status === "error") {
    throw new Error(result.message || "Unable to fetch lesson plans.");
  }

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
  const res = await fetch(appScriptUrl, {
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

  if (!res.ok) {
    throw new Error("Unable to fetch lesson plans.");
  }

  return await res.json();
}
type LessonPlanByTermFilters = {
  term?: number | string;
  teacher_id?: string;
};
export async function deleteLessonPlan(file_id: string) {
  const appScriptUrl = process.env.APPSCRIPT_URL;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL is not configured.");
  }
  const res = await fetch(appScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "delete",
      file_id: file_id,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete lesson plan.");
  }

  const result = await res.json();

  return result;
}

export async function addLessonPlan(formData: FormData) {
  const file = formData.get("file") as File | null;

  let fileData = null;

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());

    fileData = {
      fileName: file.name,
      mimeType: file.type,
      data: buffer.toString("base64"),
    };
  }

  const payload = {
    action: "addLessonPlan",
    formDataObj: {
      schoolYear: formData.get("schoolYear"),
      teacherName: formData.get("teacherName"),
      week: Number(formData.get("week")?.toString()) || null,
      grade: formData.get("grade")?.toString() || null,
      term: Number(formData.get("term")?.toString()) || null,
      teacher_id: formData.get("teacher_id"),
      ...(fileData && { fileData }),
    },
  };
  const appScriptUrl = process.env.APPSCRIPT_URL;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL is not configured.");
  }
  const response = await fetch(appScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });
  revalidatePath("/lesson-plan");

  return await response.json();
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
  name: string,
) {
  const appScriptUrl = process.env.APPSCRIPT_URL;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL is not configured.");
  }
  const res = await fetch(appScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify({
      action: "updateLessonPlanStatus",
      file_id,
      checkedDetails: { status: status, checkedBy: name },
    }),
  });

  if (!res.ok) {
    throw new Error("Unable to connect to the server.");
  }

  const result: AppsScriptResponse = await res.json();

  if (result.status !== "success") {
    throw new Error(result.message || "Failed to update status.");
  }

  return result;
}
export async function getLessonPlansByTerm({
  term,
  teacher_id,
}: LessonPlanByTermFilters = {}) {
  const appScriptUrl = process.env.APPSCRIPT_URL;

  if (!appScriptUrl) {
    throw new Error("APPSCRIPT_URL is not configured.");
  }
  const res = await fetch(appScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      action: "getLessonPlansByTerm",
      teacher_id,
      term: term ? Number(term) : 1,
    }),
  });

  if (!res.ok) {
    throw new Error("Unable to connect to the lesson plan service.");
  }

  const result: AppsScriptResponse = await res.json();

  // Apps Script returned an error
  if (result.status === "error") {
    throw new Error(result.message || "Unable to fetch lesson plans.");
  }

  return result;
}
