"use server"
import { getSignInStatus } from "@/lib/get-signin-status";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";
import { InStockSchema, formSchema }  from "@/lib/_schema/inventory/purchaseSchema"
import { z } from "zod";
import { Prisma } from "@prisma/client";


export const submitPO = async (data: z.infer<typeof InStockSchema>):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      console.log("hi");
      console.log(data);
      const { supplierId, products, ...otherData } = data;
      const user = await prismadb.inStock.create({
        data:{
          ...otherData,
          supplier:{
            connect:{id:data.supplierId}
          },
          products:{
            createMany:{
              data: [
                ...data.products.map((item)=>(item))
              ]
            }
          }
        }
      });
      revalidateTag("PO");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"PO with this code already exists"};
    }
    return {status:500};
  }
};

export const updatePO = async (data: z.infer<typeof InStockSchema>):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.inStock.update({
        where:{
          id:data.id
        },
        data:{
          ...data,
          products:{
            deleteMany:{}
          },
        }, 
      });
      await prismadb.inStock.update({
        where:{
          id:data.id
        },
        data:{
          products:{
            createMany:{
              data: [
                ...data.products.map((item)=>(item))
              ]
            }
          },
        }, 
      });
      revalidateTag("PO");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"PO with this code already exists"};
    }
    return {status:500};
  }
};

export const deletePO = async (id:string):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.inStock.delete({where:{id}});
      revalidateTag("PO");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    if(error){
      console.error("Error deleting PO:", error);
      return {status:400, message:"PO with this code already exists"};
    }
    return {status:500};
  }
};
