"use server"
import { getSignInStatus } from "@/lib/get-signin-status";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { getCurrentRole } from "@/lib/get-current-role";
import { userSchema } from "@/lib/_schema/settings/userSchema";



export const updateUser = async (data: z.infer<typeof userSchema>):Promise<{status:number, message?:string}> => {
  try {
    const role = await getCurrentRole();
    if(await getSignInStatus() && userSchema.safeParse(data).success && role?.toLowerCase() === "admin"){
      const user = await prismadb.user.update({
        where:{
          id:data.id
        },
        data:{
          role:data.role
        }
      });
      revalidateTag("user");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    console.log(error);
    return {status:500, message:"Something went wrong."};
  }
};

