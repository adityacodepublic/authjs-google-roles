import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Supplier Name must be at least 2 characters.",
  }),
  address: z.string().min(10, {
    message: "Address must be at least 5 characters.",
  }),
  contacts: z.array(
    z.object({
      contactName: z.string().min(2, {
        message: "Contact Name must be at least 2 characters.",
      }),
      contactNumber: z.string().min(9, {
        message: "Contact Number must be at least 9 characters.",
      }).max(929999999999,{message:"Invalid Contact Number"}),
    })
  ).min(1, { message: "At least one contact is required." }),
});