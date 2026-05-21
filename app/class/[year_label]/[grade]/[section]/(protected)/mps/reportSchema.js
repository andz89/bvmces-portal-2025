import { z } from "zod";
// reusable text validator
export const textField = (fieldName, max = 100, min = 5) =>
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

// reusable optional text validator
export const optionalTextField = (fieldName, max = 300) =>
  z
    .string()
    .trim()

    .max(max, `${fieldName} must not exceed ${max} characters`)
    .optional()
    .or(z.literal(""));
// reusable optional text validator
export const optionalTextFieldURL = (fieldName, max = 300) =>
  z
    .string()
    .trim()
    .url(`${fieldName} must be a valid URL`)
    .max(max, `${fieldName} must not exceed ${max} characters`)
    .optional()
    .or(z.literal(""));

export const optionalNumberField = (fieldName, max = 101) =>
  z.union([
    z.literal(""),

    z.coerce
      .number()
      .min(0, `${fieldName} cannot be negative`)
      .max(max, `${fieldName} must not exceed ${max}`),
  ]);
export const scoreSchema = z.coerce
  .number()
  .min(0, "Value cannot be negative")
  .max(101, "Value is too large");
export const reportSchema = z.object({
  class_id: textField("Class", 100, 1),

  quarter: textField("Quarter year", 20, 1),

  gmrc: scoreSchema,
  epp: scoreSchema,
  filipino: scoreSchema,
  english: scoreSchema,
  math: scoreSchema,
  science: scoreSchema,
  ap: scoreSchema,
  mapeh: scoreSchema,
  reading_literacy: scoreSchema,
  llc_source: optionalTextFieldURL(" llc_source", 500),
  mps_source: optionalTextFieldURL("MPS Source", 500),
});
