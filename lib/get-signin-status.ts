import { auth } from "@/auth"

export const getLoggedInStatus = async() => {
  const session = await auth();
  if(session) return true;
  return false;
}