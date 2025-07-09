import z from "zod";

export const emailSchema = z.string().email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must have at least 1 uppercase character")
  .regex(/[a-z]/, "Password must have at least 1 lowercase character")
  .regex(/[0-9]/, "Password must have at least 1 number")
  .regex(
    /[!@#$%^&*()_\-+={[\]}|:;"'<,>.]/,
    "Password must have at least 1 special character (!@#$%^&*()_-+={[}]|:;\"'<,>.)"
  );
