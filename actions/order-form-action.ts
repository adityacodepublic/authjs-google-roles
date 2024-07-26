"use server"

import { getSignInStatus } from "@/lib/get-signin-status";
import prismadb from "@/lib/prismadb";
import { revalidateTag, unstable_cache } from "next/cache";
import { formSchema } from "@/lib/_schema/orderSchema"
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const getFormData = async (id:string) => {
  const initialData = prismadb.order.findUnique({where:{id}});
  const customers = prismadb.organisation.findMany();
  const flim = prismadb.filmSize.findMany();
  const can = prismadb.canSize.findMany();
  const wire = prismadb.wireType.findMany();
  const [initial, customer, flims, cans, wires] = await Promise.all([initialData,customers, flim, can, wire]);
  return {initial, customer, flims, cans, wires};
}

// CUSTOMER
export const createCustomer = async (name:string):Promise<{name:string, id:string} | {status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.organisation.create({data:{name}});
      revalidateTag("org");
      return user;
    }
    else return {status:401};
  } catch (error) {
    console.error("Error creating product:", error);
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"A Customer with this name already exists"};
    }
    console.error("Error creating customer:", error);
    return {status:500};
  }
};

export const updateCustomer = async (id: string, name: string):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.organisation.update({where:{id},data:{name}});
      revalidateTag("org");
      return {status:200};
    }
    else return {status:401};
  } catch (error) {
    console.error("Error creating product:", error);
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"A Customer with this name already exists"};
    }
    console.error("Error creating customer:", error);
    return {status:500};
  }
};

export const deleteCustomer = async (id:string):Promise<{status:number}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.organisation.delete({where:{id}});
      revalidateTag("org");
      return {status:200};
    }
    else return {status:401};
  } catch (error) {
    console.error("Error creating customer:", error);
    return {status:500};
  }
};

// FLIMSIZE
export const createFlimsize = async (name:string):Promise<{name:string, id:string} | {status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.filmSize.create({data:{name, id:name}});
      revalidateTag("org");
      return user;
    }
    else return {status:401};
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"A Flimsize with this value already exists"};
    }
    console.error("Error creating Flimsize:", error);
    return {status:500};
  }
};

export const updateFlimsize = async (id: string, name: string):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.filmSize.update({where:{id},data:{name}});
      revalidateTag("org");
      return {status:200};
    }
    else return {status:401};
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"A Flimsize with this value already exists"};
    }
    console.error("Error creating Flimsize:", error);
    return {status:500};
  }
};

export const deleteFlimsize = async (id:string):Promise<{status:number}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.filmSize.delete({where:{id}});
      revalidateTag("org");
      return {status:200};
    }
    else return {status:401};
  } catch (error) {
    console.error("Error creating Flimsize:", error);
    return {status:500};
  }
};

// CANSIZE
export const createCansize = async (name:string):Promise<{name:string, id:string} | {status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.canSize.create({data:{name, id:name}});
      revalidateTag("org");
      return user;
    }
    else return {status:401};
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"A Cansize with this value already exists"};
    }
    console.error("Error creating Cansize:", error);
    return {status:500};
  }
};

export const updateCansize = async (id: string, name: string):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.canSize.update({where:{id},data:{name}});
      revalidateTag("org");
      return {status:200};
    }
    else return {status:401};
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"A Cansize with this value already exists"};
    }
    console.error("Error creating Cansize:", error);
    return {status:500};
  }
};

export const deleteCansize = async (id:string):Promise<{status:number}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.canSize.delete({where:{id}});
      revalidateTag("org");
      return {status:200};
    }
    else return {status:401};
  } catch (error) {
    console.error("Error creating Cansize:", error);
    return {status:500};
  }
};

// WIRETYPE
export const createWiretype = async (name:string):Promise<{name:string, id:string} | {status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.wireType.create({data:{name, id:name}});
      revalidateTag("org");
      return user;
    }
    else return {status:401};
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"A Wire type with this value already exists"};
    }
    console.error("Error creating wireType:", error);
    return {status:500};
  }
};

export const updateWiretype = async (id: string, name: string):Promise<{status:number, message?:string}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.wireType.update({where:{id},data:{name}});
      revalidateTag("org");
      return {status:200};
    }
    else return {status:401};
  } catch (error) {
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"A Wire type with this value already exists"};
    }
    console.error("Error creating wireType:", error);
    return {status:500};
  }
};

export const deleteWiretype = async (id:string):Promise<{status:number}> => {
  try {
    if(await getSignInStatus()){
      const user = await prismadb.wireType.delete({where:{id}});
      revalidateTag("org");
      return {status:200};
    }
    else return {status:401};
  } catch (error) {
    console.error("Error creating wireType:", error);
    return {status:500};
  }
};


// ORDER
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
    else return {status:401};
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
    else return {status:401};
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
    else return {status:401};
  } catch (error) {
    console.error("Error deleting customer:", error);
    return {status:500};
  }
};

