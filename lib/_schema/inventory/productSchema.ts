import { z } from "zod";

export const formSchema = z.object({
  code: z.string().min(1, { message: "Product code is required." }),
  productCategory: z.string().min(1, { message: "Please select the category of product." }),
  valueUnit: z.string().min(1, { message: "Unit of product is required" }),
});