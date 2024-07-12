import { useSession } from "next-auth/react";

export const useLoggedInStatus = () => {
  const session = useSession();
  if(session) return true;
  return false;
}