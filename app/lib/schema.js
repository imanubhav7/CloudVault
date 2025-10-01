import z, { email } from "zod";

export const formSchema = (type) => z.object({
  email: z
    .string()
    .email("Invalid email address"),
  fullName:
  type === 'sign-up'?
   z.string()
    .min(2, "Full name is too short")
    .max(50, "Full name is too long")
    :z.string().optional()
   
});