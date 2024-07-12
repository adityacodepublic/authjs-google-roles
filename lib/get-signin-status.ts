import { auth } from "@/auth"

export const getSignInStatus = async() => {
  const session = await auth();
  if(session) return true;
  return false;
}