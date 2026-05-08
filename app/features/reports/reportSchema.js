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

export const reportSchema = z.object({
  filename: textField("Filename", 100),

  description: textField("Description", 100),

  link: z.string().trim().url("Invalid URL").max(500),

  type: textField("Type", 50, 1),

  stage: textField("Stage", 20, 1),

  school_year: textField("School year", 20, 1),
});
