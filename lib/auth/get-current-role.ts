import "server-only";

import getAuth from "./get-auth";

export const getCurrentRole = async() => {
  const session = await getAuth();
  return session?.user?.role;
}