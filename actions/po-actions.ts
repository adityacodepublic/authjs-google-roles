"use server"
import { getSignInStatus } from "@/lib/get-signin-status";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";
import { InStockSchema as quickSchema, formSchemaProduct as initialProduct }  from "@/lib/_schema/inventory/quickIn-Schema"
import { InStockSchema as poSchema, formSchema }  from "@/lib/_schema/inventory/purchaseOrderSchema"
import { z } from "zod";
import { Prisma, ProductIn } from "@prisma/client";


export const submitPO = async (data: z.infer<typeof poSchema> | z.infer<typeof quickSchema>):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
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
        },
        include:{
          products:true
        }
      });
      if(data.confirmed) await addQuantity(user.products);
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

export const updatePO = async (initialData: z.infer<typeof formSchema>, data: z.infer<typeof poSchema> | z.infer<typeof quickSchema>, id:string):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      if(data.confirmed) await undoQuantity(initialData.products);
      await prismadb.inStock.update({
        where:{
          id:id
        },
        data:{
          ...data,
          products:{
            deleteMany:{}
          },
        }, 
      });
      const update = await prismadb.inStock.update({
        where:{
          id:id
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
        include:{
          products:true
        }
      });
      if(data.confirmed) await addQuantity(update.products);
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

export const deletePO = async (id:string, confirmed:boolean):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.inStock.delete({
        where:{id},
        include:{
          products:true
        }
      });
      if(confirmed) await undoQuantity(user.products);
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





// Product Quantities
export const addQuantity = async(data:ProductIn[]):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const updatePromises = data.map(item =>
        prismadb.product.update({
          where: { code: item.productId },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        })
      );
      await Promise.all(updatePromises);
      revalidateTag("product");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    if(error){
      console.error("product quantity increase:", error);
      return {status:400, message:"Error occoured with product quantity."};
    }
    return {status:500};
  }
};

export const removeQuantity = async(productId:string, quantity:number):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
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
      console.error("product quantity increase:", error);
      return {status:400, message:"Error occoured with product quantity."};
    }
    return {status:500};
  };
};

export const undoQuantity = async(data:ProductIn[] | z.infer<typeof initialProduct>[]):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const updatePromises = data.map(item =>
        prismadb.product.update({
          where: { code: item.productId },
          data: {
            quantity: {
              decrement: item.quantity === "" ? 0 : item.quantity,
            },
          },
        })
      );
      await Promise.all(updatePromises);
      revalidateTag("product");
      return {status:200};
    }
    else return {status:401, message:"Something went wrong with request"};
  } catch (error) {
    if(error){
      console.error("product quantity increase:", error);
      return {status:400, message:"Error occoured with product quantity."};
    }
    return {status:500};
  }
};