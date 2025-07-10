import z from "zod";

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must have at least 1 uppercase character")
  .regex(/[a-z]/, "Password must have at least 1 lowercase character")
  .regex(/[0-9]/, "Password must have at least 1 number")
  .regex(
    /[!@#$%^&*()_\-+={[\]}|:;"'<,>.]/,
    "Password must have at least 1 special character (!@#$%^&*()_-+={[}]|:;\"'<,>.)"
  );

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
});

export const signUpSchema = z
  .object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );
