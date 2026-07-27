"use server";
import { Buffer } from "node:buffer";
import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";

export async function getLessonPlans({ term, week, teacher_id } = {}) {
  const res = await fetch(process.env.APPSCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      action: "getLessonPlans",
      teacher_id,
      week: week ? parseInt(week) : 1,
      term: term ? parseInt(term) : 1,
    }),
  });

  if (!res.ok) {
    throw new Error("Unable to connect to the lesson plan service.");
  }

  const result = await res.json();

  // Apps Script returned an error
  if (result.status === "error") {
    throw new Error(result.message || "Unable to fetch lesson plans.");
  }

  return result;
}
export async function getAdminLessonPlans({ term, week } = {}) {
  const res = await fetch(process.env.APPSCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      action: "getAdminLessonPlans",
      week: week ? parseInt(week) : 1,
      term: term ? parseInt(term) : 1,
    }),
  });

  if (!res.ok) {
    throw new Error("Unable to fetch lesson plans.");
  }

  return await res.json();
}
export async function deleteLessonPlan(file_id: string) {
  const res = await fetch(process.env.APPSCRIPT_URL, {
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

export async function addLessonPlan(formData) {
  const file = formData.get("file");

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
      week: parseInt(formData.get("week")) || null,
      grade: formData.get("grade")?.toString() || null,
      term: parseInt(formData.get("term")) || null,
      teacher_id: formData.get("teacher_id"),
      ...(fileData && { fileData }),
    },
  };

  const response = await fetch(process.env.APPSCRIPT_URL, {
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
export async function updateLessonPlanStatus(file_id, status, name) {
  const res = await fetch(process.env.APPSCRIPT_URL, {
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

  const result = await res.json();

  if (result.status !== "success") {
    throw new Error(result.message || "Failed to update status.");
  }

  return result;
}
export async function getLessonPlansByTerm({ term, teacher_id } = {}) {
  const res = await fetch(process.env.APPSCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      action: "getLessonPlansByTerm",
      teacher_id,
      term: term ? parseInt(term) : 1,
    }),
  });

  if (!res.ok) {
    throw new Error("Unable to connect to the lesson plan service.");
  }

  const result = await res.json();

  // Apps Script returned an error
  if (result.status === "error") {
    throw new Error(result.message || "Unable to fetch lesson plans.");
  }

  return result;
}
