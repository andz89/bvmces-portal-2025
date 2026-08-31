import { z } from "zod";

// reusable text validator
export const textField = (fieldName, max = 100, min = 1) =>
  z
    .string()
    .trim()
    .min(
      min,
      min === 1
        ? `${fieldName} is required.`
        : `${fieldName} must be at least ${min} characters`,
    )
    .max(max, `${fieldName} must not exceed ${max} characters`);

export const scoreSchema = z.coerce
  .number()
  .min(0, "Value cannot be negative")
  .max(101, "Value is too large");

export const EXAM_TYPES = ["ST1", "ST2", "Test Exam"];

export const reportSchema = z.object({
  class_id: textField("Class", 100, 1),
  term: textField("Term", 20, 1),
  exam_type: z.enum(EXAM_TYPES, {
    errorMap: () => ({ message: "Please select a valid examination type." }),
  }),

  gmrc: scoreSchema,
  epp: scoreSchema,
  filipino: scoreSchema,
  english: scoreSchema,
  math: scoreSchema,
  science: scoreSchema,
  ap: scoreSchema,
  mapeh: scoreSchema,
  reading_literacy: scoreSchema,
});
