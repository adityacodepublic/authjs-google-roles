"use server"
import { getSignInStatus } from "@/lib/get-signin-status";
import {formSchema} from "./text-area"
import { revalidateTag } from "next/cache";
import { z } from "zod";
import prismadb from "@/lib/prismadb";

type WindingCore = {
  code: string;
  name: string;
  valueUnit: string;
};

function filter(rawData: (string | undefined)[][]): WindingCore[] {
  return rawData
    .filter(arr => arr.length === 3 && arr.every(item => typeof item === 'string'))
    .map(arr => ({
      code: arr[1] as string,
      name: arr[0] as string,
      valueUnit: arr[2] as string,
    }));
}

export const submitProduct = async (data: z.infer<typeof formSchema>):Promise<{ status:number }>  => {
  try {
    if(await getSignInStatus()){
      const transformed = filter(data.excelData.split('\n').map(row => row.split('\t')));
      await prismadb.product.createMany({
        data: transformed.map(item => ({
          ...item,
          quantity: 0,
          productCategoryId: data.productCategoryId
        })),
        skipDuplicates: true 
      });
      revalidateTag("product");
      return {status:200};
    }
    else return {status:401};
  } catch (error) {
    console.error("Error creating customer:", error);
    return {status:500};
  }
};