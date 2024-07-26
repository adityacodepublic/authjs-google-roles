"use server"

import { getSignInStatus } from "@/lib/get-signin-status";
import prismadb from "@/lib/prismadb";
import { Prisma, ProductCategory } from "@prisma/client";
import { revalidateTag } from "next/cache";



type ProductData = {
  code: string;
  valueUnit: string;
  quantity: number;
  suppliers: string[];
  productCategory: string;
};

export const deleteProduct = async (id:string):Promise<{status:number}> => {
  try {
    if(await getSignInStatus()){
      await prismadb.product.delete({where:{code:id}});
      revalidateTag("product");
      return {status:200};
    }
    else return {status:400};
  } catch (error) {
    console.error("Error deleting product:", error);
    return {status:500};
  }
};

export const submitProduct = async (data: ProductData):Promise<{status:number, message:string}>  => {
  try {
    if(await getSignInStatus()){
      const product = await prismadb.product.create({
        data:{
          code:data.code,
          productCategoryId:data.productCategory,
          valueUnit:data.valueUnit,
          quantity:data.quantity,
          suppliers:{
            createMany:{
              data:[
                ...data.suppliers.map((supplier)=>({supplierId:supplier}))
              ]
            }
          }
        }
      });
      revalidateTag("product");
      console.log(product);
      return {status:200, message:"Product Created Successfully"};
    }
    else return {status:401, message:"Invalid request"};
  } catch (error) {
    console.error("Error creating product:", error);
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"Product with this code already exists"};
    }
    else return {status:500, message:"Internal server error"};
  }
};

export const updateProduct = async (data: ProductData, id:string):Promise<{status:number, message:string}>  => {
  try {
    if(await getSignInStatus()){
      await prismadb.product.update({
        where: {
          code:id
        },
        data:{
          productCategoryId:data.productCategory,
          valueUnit:data.valueUnit,
          quantity:data.quantity,
          suppliers:{
            deleteMany:{}
          }
        }
      });
      const product = await prismadb.product.update({
        where:{
          code:id
        },
        data:{
          suppliers:{
            createMany:{
              data:[
                ...data.suppliers.map((supplier)=>({supplierId:supplier}))
              ]
            }
          }
        },
        include:{
          suppliers:true
        }
      });
      revalidateTag("product");
      console.log(product);
      return {status:200, message:"Product Updated Successfully"};
    }
    else return {status:401, message:"Invalid request"};
  } catch (error) {
    console.error("Error creating product:", error);
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
      return {status:400, message:"A product with this code already exists"};
    }
    else return {status:500, message:"Internal server error"};
  }
};

// Product Category
export const createProductCategory = async (name:string):Promise<ProductCategory | {status:number}>  => {
  try {
    if(await getSignInStatus()){
      const product = await prismadb.productCategory.create({data:{name}});
      revalidateTag("productCategory");
      return product;
    }
    else return {status:400};
  } catch (error) {
    console.error("Error creating Product Category:", error);
    return {status:200};
  }
};

export const updateProductCategory = async (id:string,name:string):Promise<{status:number}>  => {
  try {
    if(await getSignInStatus()){
      const product = await prismadb.productCategory.update({where:{id},data:{name}});
      revalidateTag("productCategory");
      console.log("updated------------------------------------------");
      return {status:200};
    }
    else return {status:400};
  } catch (error) {
    console.error("Error updating Product Category:", error);
    return {status:500};
  }
};

export const deleteProductCategory = async (id:string):Promise<{status:number}>  => {
  try {
    if(await getSignInStatus()){
      const product = await prismadb.productCategory.delete({where:{id}});
      revalidateTag("productCategory");
      return {status:200};
    }
    else return {status:400};
  } catch (error) {
    console.error("Error deleting Product Category:", error);
    return {status:500};
  }
};

