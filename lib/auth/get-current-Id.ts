import "server-only";

import getAuth from "@/lib/auth/get-auth";

export const getCurrentId = async() => {
  const session = await getAuth();
  return session?.user.id;
};