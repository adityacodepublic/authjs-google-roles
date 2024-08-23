"use server"
import prismadb from "../lib/prismadb";
import { getCurrentId } from "../lib/get-current-Id";
import { signOut } from "@/auth";
import { cache } from "react";

export const isUser = cache(async() => {
  const id = await getCurrentId();
  if(id){
    const user = await prismadb.user.findUnique({where:{id}});
    console.log("user checked");
    if(!user){
      await signOut();
    };
  };
  console.log("called");
});

// export async function validateUser() {
//     const isValidUser = await isUser();
//     if (!isValidUser) {
//       await signOut();
//       console.log("user invalidated");
//     }
// };