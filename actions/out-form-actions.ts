"use server"
import { getSignInStatus } from "@/lib/get-signin-status";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";
import { formSchema }  from "@/lib/_schema/inventory/outSchema"
import { z } from "zod";
import { OutStock, Prisma } from "@prisma/client";


export const submitOut = async (data: z.infer<typeof formSchema>):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus() && formSchema.safeParse(data).success){
      const user = await prismadb.outStock.create({
        data:{
          ...data,
          quantity:parseInt(data.quantity)
        },
        include:{
          products:true
        }
      });
      await addQuantity(user.productId, user.quantity);
      revalidateTag("out");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003'){
      return {status:400, message:"Invalid Batch LogId"};
    }
    console.log(error);
    return {status:500};
  }
};

export const updateOut = async (initial: OutStock, data: z.infer<typeof formSchema>, id:string):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus() && formSchema.safeParse(data).success){
      const update = await prismadb.outStock.update({
        where:{
          id:id
        },
        data:{
          ...data,
          quantity:parseInt(data.quantity)
        },
        include:{
          products:true
        }
      });
      await removeQuantity(initial.productId, initial.quantity);
      await addQuantity(update.productId, update.quantity);
      revalidateTag("out");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003'){
      return {status:400, message:"Invalid Batch LogId"};
    }
    return {status:500};
  }
};

export const deleteOut = async (id:string):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.outStock.delete({
        where:{id},
        include:{
          products:true
        }
      });
      await removeQuantity(user.productId, user.quantity);
      revalidateTag("PO");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    if(error){
      console.error("Error deleting OutStock:", error);
      return {status:400, message:"Error deleting outstock."};
    }
    return {status:500};
  }
};





// Product Quantities
export const addQuantity = async(productId:string, quantity:number):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus() && typeof productId === 'string' && typeof(quantity) === 'number'){
      const updatePromise = await prismadb.product.update({
        where:{
          code:productId
        },
        data:{
          quantity:{
            increment: quantity
          },
        }
      });
      revalidateTag("product");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    if(error){
      console.error("product quantity add:", error);
      return {status:400, message:"Error occoured with product quantity."};
    }
    return {status:500};
  };
};

export const removeQuantity = async(productId:string, quantity:number):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus() && typeof productId === 'string' && typeof(quantity) === 'number'){
      const updatePromise = await prismadb.product.update({
        where:{
          code:productId
        },
        data:{
          quantity:{
            decrement: quantity
          },
        }
      });
      revalidateTag("product");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    if(error){
      console.error("product quantity remove:", error);
      return {status:400, message:"Error occoured with product quantity."};
    }
    return {status:500};
  };
};
