"use server"

import { getSignInStatus } from "@/lib/get-signin-status";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { Supplier } from "@prisma/client";


export const deleteSupplier = async (id:string):Promise<{status:number}> => {
  try {
    if(await getSignInStatus()){
      const supplier = await prismadb.supplier.delete({where:{id}});
      revalidateTag("supplier");
      return {status:200};
    }
    else return {status:400};
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return {status:500};
  }
};

type SupplierData = {
  name: string;
  address: string;
  contacts: string[];
};

export const submitSupplier = async (data: SupplierData):Promise<{status:number}>  => {
  try {
    if(await getSignInStatus()){
      const suppilier = await prismadb.supplier.create({
        data:{
          ...data
        },
        select:{
          name:true
        }
      });
      revalidateTag("suppilier");
      return {status:200};
    }
    else return {status:400};
  } catch (error) {
    console.error("Error creating supplier:", error);
    return {status:500};
  }
};

export const updateSupplier = async (data: SupplierData, id:string):Promise<{status:number}>  => {
  try {
    if(await getSignInStatus()){
      const supplier = await prismadb.supplier.update({
        where: {
          id:id
        },
        data:data,
        select:{
          name:true
        }
      });
      revalidateTag("supplier");
      return {status:200};
    }
    else return {status:400};
  } catch (error) {
    console.error("Error creating supplier:", error);
    return {status:500};
  }
};


