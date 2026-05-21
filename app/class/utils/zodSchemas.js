import { z } from "zod";

export const textValueSchema = ({
  field = "Field",
  min = 1,
  max = 50,
  optional = false,
}) => {
  let schema = z
    .string()
    .trim()
    .min(min, `${field} must be at least ${min} characters`)
    .max(max, `${field} must not exceed ${max} characters`);

  return optional ? schema.optional() : schema;
};
export const optionalTextFieldURL = (fieldName, max = 300) =>
  z
    .string()
    .trim()
    .url(`${fieldName} must be a valid URL`)
    .max(max, `${fieldName} must not exceed ${max} characters`)
    .optional()
    .or(z.literal(""));

export const uuidSchema = (field = "ID") => z.string().uuid(`Invalid ${field}`);
export const quarterSchema = z.enum(["1", "2", "3", "4"], {
  message: "Invalid quarter",
});

export const gradeSchema = z.enum(["1", "2", "3", "4", "5", "6"]);
export const scoreSchema = z.coerce
  .number()
  .min(0, "Value cannot be negative")
  .max(999, "Value is too large");
