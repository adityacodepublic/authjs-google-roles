"use server"

import { getSignInStatus } from "@/lib/auth/get-signin-status";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";
import { formSchema } from "@/lib/_schema/reports/reports-schema"
import { z } from "zod";



export const submitReport = async (data: z.infer<typeof formSchema>):Promise<{status:number}> => {
  try {
    if(await getSignInStatus() && formSchema.safeParse(data).success){
      const user = await prismadb.report.create({
        data: {
          ...data
        },
      });
      revalidateTag("report");
      return {status:200};
    }
    else return {status:401};
  } catch (error) {
    return {status:500};
  }
};


export const updateReport = async (data: z.infer<typeof formSchema>, id:string):Promise<{status:number}> => {
  try {
    if(await getSignInStatus() && formSchema.safeParse(data).success){
      const user = await prismadb.report.update({
        where:{id},
        data: {
          ...data
        },
      });
      revalidateTag("report");
      return {status:200};
    }
    else return {status:401};
  } catch (error) {
    return {status:500};
  }
};


export const deleteReport = async (id:string):Promise<{status:number}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.report.delete({
        where:{id}
      });
      revalidateTag("report");
      return {status:200};
    }
    else return {status:401};
  } catch (error) {
    return {status:500};
  }
};
