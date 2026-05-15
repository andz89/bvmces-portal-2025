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
export const reportSchema = z.object({
  class_id: textField("Class id", 100, 1),

  quarter: textField("Quarter year", 20, 1),

  gmrc: optionalTextField("gmrc", 20, 1),
  epp: optionalTextField("epp", 20, 1),
  filipino: optionalTextField("filipino", 20, 1),
  english: optionalTextField("english", 20, 1),
  math: optionalTextField("math", 20, 1),
  science: optionalTextField("science", 20, 1),
  ap: optionalTextField("ap", 20, 1),
  mapeh: optionalTextField("mapeh", 20, 1),
  reading_literacy: optionalTextField("reading_literacy", 20, 1),
  llc_source: optionalTextFieldURL(" llc_source", 500),
  mps_source: optionalTextFieldURL("MPS Source", 500),
});
