"use server"
import prismadb from "@/lib/prismadb";

export const getUsers = async (email:string) => {
  try {
    const user = await prismadb.user.findMany(); 
    
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id:string) => {
  try {
    const user = await prismadb.user.findUnique({ where:{id}}); 
    return user;
  } catch (error) {
    //console.log(error);
    return null;
  }
};

export const getUserByEmail = async (email:string) => {
  try {
    const user = await prismadb.user.findUnique({ where:{email}}); 
    
  } catch (error) {
    return null;
  }
};

