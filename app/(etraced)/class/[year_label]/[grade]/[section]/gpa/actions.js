"use server";

import { createClient } from "../../../../../../../utils/supabase/server";
import { revalidatePath } from "next/cache";

const SUBJECTS = [
  "gmrc",
  "epp/MTB",
  "filipino",
  "english",
  "math",
  "science",
  "ap",
  "mapeh",
  "reading",
];

export async function createBulkGPA({
  quarter,
  class_id,
  section,
  grade,
  school_year,
}) {
  const supabase = await createClient();

  const { data: existingSection } = await supabase
    .from("gpa")
    .select("id")
    .eq("class_id", class_id)
    .eq("quarter", quarter)
    .limit(1);

  if (existingSection.length > 0) {
    throw new Error(
      ` Quarter  ${quarter} is already added for this class. Please delete the existing record before adding a new one.`,
    );
  }
  const rows = [];

  for (const subject of SUBJECTS) {
    rows.push({
      class_id,
      subject,
      quarter,

      not_meet_male: 0,
      not_meet_female: 0,

      fs_male: 0,
      fs_female: 0,

      s_male: 0,
      s_female: 0,

      vs_male: 0,
      vs_female: 0,

      e_male: 0,
      e_female: 0,
    });
  }

  const { error } = await supabase.from("gpa").insert(rows);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(
    `/class/${school_year}/${grade}/${section}/gpa?id=${class_id}`,
  );

  return {
    success: true,
    inserted: rows.length,
  };
}
export async function getGPA(school_year, id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gpa")
    .select(
      `
      *,
      class:class_id!inner (
        id,
        grade,
        section
      )
    `,
    )

    .eq("class.school_year", school_year)
    .eq("class.id", id);

  if (error) {
    throw new Error(error.message);
  }
  console.log(data);
  return data;
}

export async function updateGPA(
  class_id,
  quarter,
  subject,
  formData,
  school_year,
  section,
  grade,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("gpa")
    .update({
      not_meet_male: Number(formData.not_meet_male) || 0,

      not_meet_female: Number(formData.not_meet_female) || 0,

      fs_male: Number(formData.fs_male) || 0,

      fs_female: Number(formData.fs_female) || 0,

      s_male: Number(formData.s_male) || 0,

      s_female: Number(formData.s_female) || 0,

      vs_male: Number(formData.vs_male) || 0,

      vs_female: Number(formData.vs_female) || 0,

      e_male: Number(formData.e_male) || 0,

      e_female: Number(formData.e_female) || 0,
    })
    .eq("class_id", class_id)
    .eq("quarter", quarter)
    .eq("subject", subject);
  console.log(subject);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(
    `/class/${school_year}/${grade}/${section}/gpa?id=${class_id}`,
  );

  return {
    success: true,
  };
}
export async function deleteGPA(
  quarter,
  class_id,
  school_year,
  section,
  grade,
  password,
) {
  if (password !== process.env.DELETE_PASSWORD) {
    return { message: "invalid_password" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gpa")
    .delete()
    .eq("class_id", class_id)
    .eq("quarter", quarter)
    .select();

  if (!data.length) {
    return {
      success: false,
      message: "No GPA record found",
    };
  }
  revalidatePath(
    `/class/${school_year}/${grade}/${section}/gpa?id=${class_id}`,
  );

  return {
    success: true,
    message: "GPA deleted successfully",
  };
}
