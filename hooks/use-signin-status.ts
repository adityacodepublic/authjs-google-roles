import { useSession } from "next-auth/react";

export const useSignInStatus = () => {
  const session = useSession();
  if(session) return true;
  return false;
}