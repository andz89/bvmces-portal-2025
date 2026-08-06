"use server";
import { Buffer } from "node:buffer";
import { revalidatePath } from "next/cache";
import { handleAppScriptResponse } from "./handleAppScriptResponse";
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
type LessonPlanByTermFilters = {
  term?: number | string;
  teacher_id?: string;
};
export async function deleteLessonPlan(file_id: string) {
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
      file_id: file_id,
    }),
  });

  const result = await handleAppScriptResponse(response);

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
      subject: formData.get("subject"),

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
  const result = await handleAppScriptResponse(response);

  revalidatePath("/lesson-plan");

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
  name: string,
) {
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
      checkedDetails: { status: status, checkedBy: name },
    }),
  });

  const result = await handleAppScriptResponse(response);
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
  const response = await fetch(appScriptUrl, {
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

  const result = await handleAppScriptResponse(response);

  return result;
}
