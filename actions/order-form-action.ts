"use server"

import { getSignInStatus } from "@/lib/get-signin-status";
import prismadb from "@/lib/prismadb";
import { revalidateTag, unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { formSchema } from "@/lib/_schema/orderSchema"
import { z } from "zod";
import { Order, organisation } from "@prisma/client";

export const createCustomer = async (name:string):Promise<organisation | {status:number}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.organisation.create({data:{name}});
      revalidateTag("org");
      return user;
    }
    else return {status:400};
  } catch (error) {
    console.error("Error creating customer:", error);
    return {status:500};
  }
};

export const deleteOrder = async (id:string):Promise<{status:number}> => {
  try {
    if(await getSignInStatus()){
      const order = await prismadb.order.delete({where:{id}});
      revalidateTag("order");
      return {status:200};
    }
    else return {status:400};
  } catch (error) {
    console.error("Error deleting customer:", error);
    return {status:500};
  }
};


async function generateCode(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const count = await prismadb.order.count({
    where: {
      createdAt: {
        gte: firstDayOfMonth,
        lt: firstDayOfNextMonth,
      },
    },
  });
  const code = `${year}${month}${(count+1).toString().padStart(3, '0')}`;
  return code;
};


export const submitOrder = async (data: z.infer<typeof formSchema>):Promise<{ status:number }>  => {
  try {
    if(await getSignInStatus()){
      const code = await generateCode();
      const order = await prismadb.order.create({
        data:{
          id:code,
          ...data
        },
        select:{
          type:true
        }
      });
      revalidateTag("order");
      return {status:200};
    }
    else return {status:400};
  } catch (error) {
    console.error("Error creating customer:", error);
    return {status:500};
  }
};

export const updateOrder = async (data: z.infer<typeof formSchema>, id:string):Promise<{ status:number }>  => {
  try {
    if(await getSignInStatus()){
      const order = await prismadb.order.update({
        where: {
          id: id
        },
        data:data
      });
      revalidateTag("order");
      return {status:200};
    }
    else return {status:400};
  } catch (error) {
    console.error("Error creating customer:", error);
    return {status:500};
  }
};


