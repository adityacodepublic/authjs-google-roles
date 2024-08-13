import { z } from "zod";

export const formSchema = z.object({
  description: z.string().min(1, { message: "Description is required." }),
  org: z.string({required_error: "Please select a customer."}),
  printing: z.string().min(1, { message: "Printing is required." }),
  filmSize: z.string().min(1, { message: "Film Size is required." }),
  canSize: z.string().min(1, { message: "Can Size is required." }),
  type: z.string().min(1, { message: "Type is required." }),
  wireLength: z.string().min(1, { message: "Wire Length is required." }),
  wireType: z.string().min(1, { message: "Wire Type is required." }),
  quantity: z.coerce.number().int().min(1, { message: "Quantity is required." }),
  flowName: z.string().min(3, { message: "Flow Name is required." }),
  user: z.string().min(1, { message: "User is required." }), 
});