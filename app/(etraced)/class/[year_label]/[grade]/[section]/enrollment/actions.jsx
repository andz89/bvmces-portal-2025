"use server";

import { createClient } from "../../../../../../../utils/supabase/server";
import { revalidatePath } from "next/cache";
export async function createOrUpdateEnrollment(formData, year_label, section) {
  const supabase = await createClient();

  const id = formData.get("id");

  const class_id = formData.get("class_id");

  const boys = Number(formData.get("boys")) || 0;

  const girls = Number(formData.get("girls")) || 0;

  if (!id) {
    throw new Error("Enrollment ID is required.");
  }

  /* -----------------------------------
     UPDATE ENROLLMENT
  ----------------------------------- */
  const { error } = await supabase
    .from("enrollment")
    .update({
      boys,
      girls,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath(`/class/${year_label}/${section}/${class_id}`);

  return {
    success: true,
    action: "updated",
  };
}
export async function createEnrollment(class_id, year_label, section) {
  const supabase = await createClient();

  if (!class_id) {
    throw new Error("Class ID is required.");
  }

  // ✅ School months
  const schoolMonths = [
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
  ];

  /* -----------------------------------
     CREATE 11 MONTH ROWS
  ----------------------------------- */
  const enrollmentRows = schoolMonths.map((month) => ({
    class_id,
    month,
    boys: 0,
    girls: 0,
  }));

  const { error } = await supabase.from("enrollment").insert(enrollmentRows);

  if (error) {
    throw error;
  }

  revalidatePath(`/class/${year_label}/${section}/${class_id}`);

  return {
    success: true,
    action: "created",
  };
}
export async function deleteEnrollment(id, year_label, section, class_id) {
  const supabase = await createClient();

  const { error } = await supabase.from("enrollment").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete enrollment data");
  }
  revalidatePath(`/class/${year_label}/${section}/${class_id}`);
}
