import "server-only";

import getAuth from "./get-auth";

export const getSignInStatus = async() => {
  const session = await getAuth();
  if(session?.user) return true;
  return false;
}