import { z } from "zod";

export const userSchema = z.object({
  id:   z.string().min(5),
  role: z.string().min(3)
});