import { auth } from "@/auth";

export const getCurrentId = async() => {
  const session = await auth();
  return session?.user.id;
}