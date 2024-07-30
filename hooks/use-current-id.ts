import { useSession } from "next-auth/react";

export const useCurrentId = () => {
  const session = useSession();
  return session.data?.user.id;
}