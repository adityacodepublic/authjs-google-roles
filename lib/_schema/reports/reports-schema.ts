import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(5, { message: "Name should be more than 5 chracters." } ),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, { message: 'Phone number must be 10 digits.' }),
  title: z.string().min(5, { message: 'Title of the report is required.' }),
  description: z.string().min(5, { message: 'Description of the report is required.' }),
  address: z.string().min(5, { message: 'Address of the report is required.' }),
  type: z.string().min(1, { message: "Select the type of the incident." }),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  valid: z.boolean().optional(),
});