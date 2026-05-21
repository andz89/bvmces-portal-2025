"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  textValueSchema,
  uuidSchema,
  scoreSchema,
  gradeSchema,
  quarterSchema,
} from "../../../../../utils/zodSchemas";
const createBulkGPASchema = z.object({
  quarter: z.enum(["1", "2", "3", "4"], {
    message: "Invalid quarter",
  }),

  class_id: uuidSchema("class ID"),

  section: textValueSchema({
    field: "Section",
    min: 1,
    max: 20,
  }),

  grade: textValueSchema({
    field: "Section",
    min: 1,
    max: 10,
  }),

  school_year: textValueSchema({
    field: "School Year",
    min: 4,
    max: 20,
  }),
});

const updateGPASchema = z.object({
  class_id: uuidSchema("class ID"),

  quarter: quarterSchema,

  subject: textValueSchema({
    field: "Subject",
    min: 2,
    max: 100,
  }),

  school_year: textValueSchema({
    field: "School Year",
    min: 4,
    max: 20,
  }),

  section: textValueSchema({
    field: "Section",
    min: 1,
    max: 20,
  }),

  grade: gradeSchema,

  not_meet_male: scoreSchema,
  not_meet_female: scoreSchema,

  fs_male: scoreSchema,
  fs_female: scoreSchema,

  s_male: scoreSchema,
  s_female: scoreSchema,

  vs_male: scoreSchema,
  vs_female: scoreSchema,

  e_male: scoreSchema,
  e_female: scoreSchema,
});

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

export async function createBulkGPA(data) {
  const validatedFields = createBulkGPASchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    };
  }

  const { quarter, class_id, section, grade, school_year } =
    validatedFields.data;

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

  return data;
}

export async function updateGPA(data) {
  const validatedFields = updateGPASchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.issues[0].message,
    };
  }

  const {
    class_id,
    quarter,
    subject,
    school_year,
    section,
    grade,

    not_meet_male,
    not_meet_female,

    fs_male,
    fs_female,

    s_male,
    s_female,

    vs_male,
    vs_female,

    e_male,
    e_female,
  } = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("gpa")
    .update({
      not_meet_male,
      not_meet_female,

      fs_male,
      fs_female,

      s_male,
      s_female,

      vs_male,
      vs_female,

      e_male,
      e_female,
    })
    .eq("class_id", class_id)
    .eq("quarter", quarter)
    .eq("subject", subject);

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
