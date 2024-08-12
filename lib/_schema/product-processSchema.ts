import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(3,{ message:"Process name should be minimum 3 chracters."}),
  process: z.array(z.object({ 
    name: z.string().min(1, "Process name is required"),
    position: z.coerce.number().int().min(1, {message:"Position should be a valid integer."})
  })).min(1,{message:"Minimum one process name required"}),
});