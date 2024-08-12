"use server"

import { getSignInStatus } from "@/lib/get-signin-status";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";
import { Prisma, Supplier } from "@prisma/client";
import { formSchema } from "@/lib/_schema/product-processSchema"
import { z } from "zod";



export const submitProcess = async (data: z.infer<typeof formSchema>):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus() && formSchema.safeParse(data).success){
      const user = await prismadb.processFlow.create({
        data: {
          name: data.name,
          process: {
            createMany: {
              data: data.process.map((item) => ({...item})),
            },
          },
        },
      });
      revalidateTag("process");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"Process with this name already exists."};
    }
    return {status:500};
  }
};


export const updateProcess = async (data: z.infer<typeof formSchema>, name:string):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus() && formSchema.safeParse(data).success){
      const user = await prismadb.processFlow.update({
        where:{name:name},
        data: {
          name: data.name,
          process: {
            deleteMany:{}
          },
        },
      });
      await prismadb.processFlow.update({
        where:{name:user.name},
        data: {
          process: {
            createMany: {
              data: data.process.map((item) => ({...item})),
            },
          },
        },
      });
      revalidateTag("process");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"Process with this name already exists."};
    }
    return {status:500};
  }
};


export const deleteProcess = async (name:string):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.processFlow.delete({where:{name}});
      revalidateTag("process");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"Process with this name already exists."};
    }
    return {status:500};
  }
};
