import { z } from "zod";

export const formSchema = z.object({
  productId: z.string().min(2, {
    message: "Product Id must be at least 2 characters.",
  }),
  quantity: z
  .string()
  .min(1, 'cannot be empty')
  .default('')
  .refine(     
    (val) => !isNaN(Number(val)),
    { message: 'Quantity must be at least 1 characters.' }
  ),
  batchLogId: z.string().min(5, {
    message: "batch LogId must be at least 5 characters.",
  }),
  userId: z.string().min(1, { message: "User is required" }),
});