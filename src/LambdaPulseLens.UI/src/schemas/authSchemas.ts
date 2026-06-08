import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email({ error: "Invalid email format." }),
    password: z.string().min(6, { error: "Password must be at least 6 characters long." }),
    confirmPassword: z.string().min(1, { error: "Confirmation is required." })
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"]
  });

export type RegisterFormInputs = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email({ error: "Invalid email format." }),
  password: z.string().min(1, { error: "Password is required." })
});

export type LoginFormInputs = z.infer<typeof loginSchema>;
