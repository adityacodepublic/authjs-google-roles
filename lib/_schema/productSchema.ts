import { z } from "zod";

export const formSchema = z.object({
  code: z.string().min(1, { message: "Product code is required." }),
  suppliers: z.array(z.string({required_error: "Please select all suppliers."})),
  productCategory: z.string().min(1, { message: "Please select the category of product." }),
  valueUnit: z.string().min(1, { message: "Unit of product is required" }),
  quantity: z.coerce.number().int().min(1, { message: "Quantity is required." }),
});